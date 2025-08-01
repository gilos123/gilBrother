import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { User } from '@/api/entities';
import { UserProgress } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Volume2, Home, RotateCcw, ArrowRight, Trophy } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { AnimatePresence, motion } from 'framer-motion';
import { generateMelodicExerciseForLevel } from '../components/training/ExerciseGenerator';
import { AudioSynthesizer } from '../components/training/AudioSynthesizer';
import VexFlowSightReading from '../components/training/VexFlowSightReading';
import MistakeIntro from '../components/training/MistakeIntro';
import ArethaMascot from '../components/shared/ArethaMascot';

const LEVEL_CONFIG = {
  1: { questions: 5, xp: 2, title: "Note Identification" },
  2: { questions: 5, xp: 3, title: "Simple Phrases" },
  3: { questions: 5, xp: 5, title: "Intermediate Phrases" },
  4: { questions: 5, xp: 6, title: "The Remix" },
};

export default function EarTrainingInActionLevel() {
  const location = useLocation();
  const navigate = useNavigate();
  const synthesizerRef = useRef(null);

  const [level, setLevel] = useState(1);
  const [levelConfig, setLevelConfig] = useState(LEVEL_CONFIG[1]);
  const [exercises, setExercises] = useState([]);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalXpEarned, setTotalXpEarned] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameState, setGameState] = useState('playing');
  const [userProgress, setUserProgress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const usedExerciseKeys = useRef(new Set());
  const [mistakes, setMistakes] = useState([]);
  const [isRetrySession, setIsRetrySession] = useState(false);

  useEffect(() => {
    synthesizerRef.current = new AudioSynthesizer();
    return () => {
      if (synthesizerRef.current?.closeAudioContext) {
        synthesizerRef.current.closeAudioContext();
      }
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const levelParam = parseInt(params.get('level'), 10) || 1;
    setLevel(levelParam);
    setLevelConfig(LEVEL_CONFIG[levelParam] || LEVEL_CONFIG[1]);
    loadUserProgress().then(() => {
        startLevel(false, levelParam);
        setIsLoading(false);
    });
  }, [location.search]);
  
  const loadUserProgress = async () => { /* ... same as before */ };

  const startLevel = useCallback((retry = false, currentLevel) => {
    usedExerciseKeys.current.clear();
    setGameState('playing');
    setQuestionNumber(0);
    setCorrectAnswers(0);
    setTotalXpEarned(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    
    const exercisesToUse = retry ? mistakes : Array.from({ length: LEVEL_CONFIG[currentLevel].questions }, () => generateMelodicExerciseForLevel(currentLevel, usedExerciseKeys.current));
    setExercises(exercisesToUse);
    setIsRetrySession(retry);
    setMistakes([]);
  }, []);

  const handleAnswerSelect = (answer) => {
    if (showFeedback) return;
    setSelectedAnswer(answer);
    setShowFeedback(true);

    const exercise = exercises[questionNumber];
    const isCorrect = answer === exercise.correct_answer;

    if (isCorrect) {
      if (!isRetrySession) {
        setCorrectAnswers(prev => prev + 1);
        setTotalXpEarned(prev => prev + levelConfig.xp);
      }
    } else {
      if (!isRetrySession) {
        setMistakes(prev => [...prev, exercise]);
      }
    }

    setTimeout(() => {
      handleNextQuestion();
    }, 1500);
  };

  const handleNextQuestion = () => {
    if (questionNumber + 1 < exercises.length) {
      setQuestionNumber(prev => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      handleLevelComplete();
    }
  };
  
  const updateProgress = async (xpToAdd) => { /* ... same as before */ };
  
  const handleLevelComplete = async () => {
    setGameState('level_complete');

    // **Design Change**: XP is now calculated per question, add bonus here.
    let finalXp = totalXpEarned;
    const isPerfect = correctAnswers === levelConfig.questions;
    if (isPerfect && !isRetrySession) {
      finalXp += 5; // Add 5 XP bonus for perfection
      setTotalXpEarned(finalXp);
    }
    
    if (finalXp > 0) {
      await updateProgress(finalXp);
    }
    
    // **Design Change**: Level unlocking logic
    const canUnlockNext = correctAnswers >= 3;
    if (canUnlockNext && !isRetrySession && userProgress?.ear_training_in_action_level === level) {
      await UserProgress.update(userProgress.id, {
        ear_training_in_action_level: level + 1
      });
      // reload progress to reflect unlock
      await loadUserProgress();
    }
  };

  const playAudio = async () => { /* ... same as before */ };

  if (isLoading) return <div>Loading...</div>;

  const exercise = exercises[questionNumber];

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {gameState === 'playing' && exercise && (
        null
      )}

      {gameState === 'mistake_intro' && (
        <MistakeIntro
          mentorComponent={<ArethaMascot size="large" />}
          mentorName="Aretha"
          message="Don't worry, honey. Let's go over the ones you missed. R-E-S-P-E-C-T the process!"
          onStart={() => startLevel(true, level)}
        />
      )}

      {gameState === 'level_complete' && (
        <div className="text-center space-y-6">
          <Trophy className="w-16 h-16 text-yellow-400 mx-auto glowing-crown" />
          <h2 className="text-3xl font-bold">Level Complete!</h2>
          <p className="text-lg text-gray-700">You scored {correctAnswers} / {levelConfig.questions} correct.</p>
          <p className="text-xl font-bold text-green-600">You earned {totalXpEarned} XP!</p>
          {correctAnswers === levelConfig.questions && !isRetrySession && (
            <p className="text-md text-green-500">(Includes 5 XP perfection bonus!)</p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {mistakes.length > 0 && !isRetrySession && (
              <Button size="lg" onClick={() => setGameState('mistake_intro')}>
                <RotateCcw className="w-5 h-5 mr-2" />
                Retry Mistakes
              </Button>
            )}
            <Button size="lg" variant="outline" onClick={() => navigate(createPageUrl("EarTrainingInAction"))}>
              <Home className="w-5 h-5 mr-2" />
              Back to Levels
            </Button>
            {(userProgress?.ear_training_in_action_level > level) && level < 4 && (
               <Button size="lg" className="bg-green-500 hover:bg-green-600" onClick={() => navigate(createPageUrl(`EarTrainingInActionLevel?level=${level + 1}`))}>
                 Next Level
                 <ArrowRight className="w-5 h-5 ml-2" />
               </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}