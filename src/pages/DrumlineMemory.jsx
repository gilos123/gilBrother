
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/api/entities";
import { UserProgress } from "@/api/entities";
import { ArrowLeft, Trophy, Home, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import VexFlowStaff from "../components/training/VexFlowStaff";
import { motion, AnimatePresence } from "framer-motion";
import ArethaCelebration from '../components/training/ArethaCelebration';
import ArethaIntroduction from '../components/training/ArethaIntroduction';
import ArethaMascot from '../components/shared/ArethaMascot';

// **Design Change**: Updated level configuration with new XP values
const LEVEL_CONFIG = {
  1: {
    timeSignature: [2, 4],
    rounds: 6,
    xpPerCorrect: 2, // CHANGED: Increased from 1 to 2 XP
    title: "Level 1 - 2/4 Time"
  },
  2: {
    timeSignature: [4, 4],
    rounds: 8, // Changed from 12
    xpPerCorrect: 3, // Level 2: 3 XP per correct answer
    title: "Level 2 - 4/4 Time"
  },
  3: {
    timeSignature: [3, 4],
    rounds: 10, // Changed from 9
    xpPerCorrect: 5, // Level 3: 5 XP per correct answer
    title: "Level 3 - 3/4 Time"
  }
};

// **Design Change**: Prevent all-rest measures and confusing notation
function generateRhythmMeasure(level) {
  const config = LEVEL_CONFIG[level];
  const [beatsPerMeasure] = config.timeSignature;
  let pattern = [];
  let attempts = 0;
  const epsilon = 0.001; // Small value for floating point comparisons, moved to the top of the function scope

  do {
    pattern = [];
    let currentBeat = 0;
    // Epsilon is now defined outside this loop

    while (currentBeat < beatsPerMeasure - epsilon) {
      const remainingBeats = beatsPerMeasure - currentBeat;
      let possibleDurations = [];
      // Checks if currentBeat is on a main beat (e.g., 0, 1, 2, 3)
      const isOnBeat = Math.abs(currentBeat % 1) < epsilon;

      // Define possible notes for the current level
      if (level === 1) {
        if (remainingBeats >= 1 - epsilon) possibleDurations.push({ dur: 1, name: 'Quarter Note', restName: 'Quarter Rest' });
        if (remainingBeats >= 0.5 - epsilon) possibleDurations.push({ dur: 0.5, name: 'Eighth Note', restName: 'Eighth Rest' });
      } else if (level === 2) {
        if (remainingBeats >= 1 - epsilon) possibleDurations.push({ dur: 1, name: 'Quarter Note', restName: 'Quarter Rest' });
        if (remainingBeats >= 0.5 - epsilon) possibleDurations.push({ dur: 0.5, name: 'Eighth Note', restName: 'Eighth Rest' });
        if (remainingBeats >= 0.25 - epsilon) possibleDurations.push({ dur: 0.25, name: 'Sixteenth Note', restName: 'Sixteenth Rest' });
      } else if (level === 3) {
        if (remainingBeats >= 1.5 - epsilon) possibleDurations.push({ dur: 1.5, name: 'Dotted Quarter', restName: 'Dotted Quarter Rest' });
        if (remainingBeats >= 1 - epsilon) possibleDurations.push({ dur: 1, name: 'Quarter Note', restName: 'Quarter Rest' });
        if (remainingBeats >= 0.5 - epsilon) possibleDurations.push({ dur: 0.5, name: 'Eighth Note', restName: 'Eighth Rest' });
      }

      // **Design Change**: Prevent long notes on off-beats
      if (!isOnBeat) {
        // Filter out notes/rests longer than an eighth note (0.5) if not on a main beat.
        // This prevents things like a quarter note starting on the '&' of 1.
        possibleDurations = possibleDurations.filter(d => d.dur < 1);
      }

      if (possibleDurations.length === 0) {
        // If no suitable duration found, try to fill with smallest possible rest to prevent infinite loop.
        if (remainingBeats >= 0.25 - epsilon) {
          pattern.push({ type: 'rest', duration: 0.25, beat: currentBeat, name: 'Sixteenth Rest' });
          currentBeat += 0.25;
        }
        break; // No other suitable durations
      }

      const chosenDur = possibleDurations[Math.floor(Math.random() * possibleDurations.length)];
      const noteCount = pattern.filter(p => p.type === 'note').length;
      // Adjusted noteProb: higher chance for notes if none yet, or if near end of measure
      const noteProb = noteCount === 0 && currentBeat >= beatsPerMeasure / 2 ? 0.95 : 0.75;
      const isNote = Math.random() < noteProb;

      pattern.push({
        type: isNote ? 'note' : 'rest',
        duration: chosenDur.dur,
        beat: currentBeat,
        name: isNote ? chosenDur.name : chosenDur.restName
      });
      currentBeat += chosenDur.dur;
    }
    attempts++;
  } while (pattern.filter(p => p.type === 'note').length === 0 && attempts < 20); // Retry if all rests generated

  // Ensure the measure is full. Fill remaining space with appropriate rests
  let totalDuration = pattern.reduce((sum, item) => sum + item.duration, 0);
  if (totalDuration < beatsPerMeasure - epsilon) {
    let fillBeat = totalDuration;
    while (fillBeat < beatsPerMeasure - epsilon) {
      const remaining = beatsPerMeasure - fillBeat;
      if (remaining >= 1.5 - epsilon && level === 3) { // Dotted Quarter Rest for Level 3
        pattern.push({ type: 'rest', duration: 1.5, beat: fillBeat, name: 'Dotted Quarter Rest' });
        fillBeat += 1.5;
      } else if (remaining >= 1 - epsilon) {
        pattern.push({ type: 'rest', duration: 1, beat: fillBeat, name: 'Quarter Rest' });
        fillBeat += 1;
      } else if (remaining >= 0.5 - epsilon) {
        pattern.push({ type: 'rest', duration: 0.5, beat: fillBeat, name: 'Eighth Rest' });
        fillBeat += 0.5;
      } else if (remaining >= 0.25 - epsilon) { // Add 16th Rest check
        pattern.push({ type: 'rest', duration: 0.25, beat: fillBeat, name: 'Sixteenth Rest' });
        fillBeat += 0.25;
      } else {
        break; // Cannot fill remaining small gap
      }
    }
  }

  // Fallback: If pattern is empty (e.g. initial generation failed somehow), add a default note.
  // This helps prevent crashes from empty patterns.
  if (pattern.length === 0) {
    pattern.push({ type: 'note', duration: 1, beat: 0, name: 'Quarter Note' });
  }

  pattern.sort((a, b) => a.beat - b.beat);
  return pattern;
};


const generateDistractorMeasure = (originalMeasure, level) => { // Now accepts 'level'
  let attempts = 0;
  let distractor;

  do {
    distractor = generateRhythmMeasure(level); // Pass level
    attempts++;
  } while (JSON.stringify(distractor) === JSON.stringify(originalMeasure) && attempts < 20);

  // Additional check to ensure truly different patterns
  if (JSON.stringify(distractor) === JSON.stringify(originalMeasure)) {
    // Force a different pattern by modifying a random element
    const modifiedDistractor = [...distractor];
    if (modifiedDistractor.length > 0) {
      const randomIndex = Math.floor(Math.random() * modifiedDistractor.length);
      const item = modifiedDistractor[randomIndex];

      let newType;
      let newName;

      if (item.type === 'note') {
        newType = 'rest';
        if (item.duration === 1) newName = 'Quarter Rest';
        else if (item.duration === 0.5) newName = 'Eighth Rest';
        else if (item.duration === 0.25) newName = 'Sixteenth Rest';
        else if (item.duration === 1.5) newName = 'Dotted Quarter Rest'; // For dotted notes in level 3
        else newName = 'Rest'; // Fallback
      } else { // item.type === 'rest'
        newType = 'note';
        if (item.duration === 1) newName = 'Quarter Note';
        else if (item.duration === 0.5) newName = 'Eighth Note';
        else if (item.duration === 0.25) newName = 'Sixteenth Note';
        else if (item.duration === 1.5) newName = 'Dotted Quarter'; // For dotted notes in level 3
        else newName = 'Note'; // Fallback
      }
      modifiedDistractor[randomIndex] = {
        ...item, // Keep original duration and beat
        type: newType,
        name: newName,
      };
    }
    return modifiedDistractor;
  }

  return distractor;
};

// FIXED: Additional function to prevent identical options
const ensureUniqueOptions = (correctPattern, distractorA, distractorB, level) => { // Now accepts 'level'
  const patterns = [correctPattern, distractorA, distractorB];
  const signatures = patterns.map(p => JSON.stringify(p));

  // Check for duplicates
  const hasDuplicates = signatures.length !== new Set(signatures).size;

  if (hasDuplicates) {
    // Generate new distractors until we have unique patterns
    let newDistractorB = generateDistractorMeasure(correctPattern, level); // Pass level
    let attempts = 0;

    while ((JSON.stringify(newDistractorB) === JSON.stringify(correctPattern) ||
            JSON.stringify(newDistractorB) === JSON.stringify(distractorA)) &&
           attempts < 30) {
      newDistractorB = generateRhythmMeasure(level); // Pass level
      attempts++;
    }

    return [correctPattern, distractorA, newDistractorB];
  }

  return patterns;
};

export default function DrumlineMemory() {
  const synthesizer = useRef(null);
  const navigate = useNavigate();

  const [level, setLevel] = useState(1);
  const [measures, setMeasures] = useState([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [gameState, setGameState] = useState('intro'); // intro, ready, listening, guessing, feedback, ended
  const [showIntro, setShowIntro] = useState(false);
  const [options, setOptions] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalXpEarned, setTotalXpEarned] = useState(0); // Renamed from totalXP
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [gameEnded, setGameEnded] = useState(false);

  // User and UserProgress states
  const [user, setUser] = useState(null);
  const [userProgress, setUserProgress] = useState(null);

  const config = LEVEL_CONFIG[level];

  const loadUserProgress = useCallback(async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      if (currentUser && currentUser.email) {
        const progressList = await UserProgress.filter({ created_by: currentUser.email });
        if (progressList.length > 0) {
          setUserProgress(progressList[0]);
        } else {
          // If no progress exists, create a new one
          const newProgress = await UserProgress.create({
            created_by: currentUser.email,
            total_xp: 0,
            daily_xp: 0,
            drumline_memory_level: 1,
            last_practice_date: new Date().toISOString().split('T')[0],
          });
          setUserProgress(newProgress);
        }
      } else {
        setUserProgress(null); // Not logged in
      }
    } catch (error) {
      console.error("Failed to load user progress:", error);
      setUser(null);
      setUserProgress(null);
    }
  }, []);

  const updateProgress = useCallback(async (xpToAdd) => {
    if (!userProgress || xpToAdd <= 0) return;
    try {
      const today = new Date().toISOString().split('T')[0];
      // **Design Change**: Use functional update form to prevent race conditions
      // This is a more robust way to update state based on previous state.
      const currentTotalXp = userProgress.total_xp || 0;
      const currentDailyXp = userProgress.daily_xp || 0;

      await UserProgress.update(userProgress.id, {
        total_xp: currentTotalXp + xpToAdd,
        daily_xp: currentDailyXp + xpToAdd,
        last_practice_date: today,
        drumline_memory_level: Math.max(userProgress.drumline_memory_level || 1, level),
      });
      await loadUserProgress();
    } catch (error) {
      console.error("Failed to update user progress:", error);
    }
  }, [userProgress, level, loadUserProgress]);

  const handleSessionComplete = useCallback(async () => {
    setGameEnded(true);
    setGameState('ended');
    
    const config = LEVEL_CONFIG[level];
    const totalXp = correctAnswers * config.xpPerCorrect;
    setTotalXpEarned(totalXp);

    // **Design Change**: Fixed XP not saving if session is not perfect
    // The updateProgress call is now guaranteed to run when the session is complete.
    if (totalXp > 0) {
      await updateProgress(totalXp);
    }
  }, [correctAnswers, level, updateProgress]);

  // Memoize playFullSequence
  const playFullSequence = useCallback(async (measureSequence) => {
    if (!synthesizer.current || isPlayingAudio) return;

    setIsPlayingAudio(true);

    try {
      await synthesizer.current.initAudioContext();

      const bpm = 90;
      const beatDuration = 60 / bpm;
      const [beatsPerMeasure] = config.timeSignature;
      const measureDuration = beatsPerMeasure * beatDuration;

      const countInBeats = beatsPerMeasure;
      const countInDuration = countInBeats * beatDuration;

      const startTime = synthesizer.current.audioContext.currentTime + 0.1;

      // Schedule metronome count-in with consistent beat sound
      for (let beat = 0; beat < countInBeats; beat++) {
        const clickTime = startTime + (beat * beatDuration);
        synthesizer.current.scheduleMetronomeClick(clickTime, false); // ALWAYS false for consistent sound
      }

      const rhythmStartTime = startTime + countInDuration;
      let totalScheduledDuration = countInDuration;

      measureSequence.forEach((measure, measureIndex) => {
        const measureStartTime = rhythmStartTime + (measureIndex * measureDuration);

        measure.forEach(note => {
          if (note.type === 'note') {
            const noteTime = measureStartTime + (note.beat * beatDuration);
            synthesizer.current.playSnareSound(noteTime);
          }
        });

        totalScheduledDuration = countInDuration + ((measureIndex + 1) * measureDuration);
      });

      setTimeout(() => {
        setIsPlayingAudio(false);
        // Always transition to guessing state after audio finishes
        setGameState('guessing');
      }, (totalScheduledDuration * 1000) + 500); // Added a small buffer

    } catch (error) {
      console.error('Error playing sequence:', error);
      setIsPlayingAudio(false);
      // Even on error, transition to guessing state
      setGameState('guessing');
    }
  }, [config.timeSignature, isPlayingAudio]); // Dependencies for useCallback

  // Memoize generateNextRound
  const generateNextRound = useCallback(() => {
    // Generate the measure for the current round
    const newMeasure = generateRhythmMeasure(level); // Pass level
    const newMeasuresSequence = [...measures, newMeasure]; // Add it to the sequence
    setMeasures(newMeasuresSequence);
    setCurrentRound(prev => prev + 1); // Increment round count here

    // Generate options for this newMeasure
    const correctOption = { id: 'correct', pattern: newMeasure };
    const distractorB = { id: 'distractor1', pattern: generateDistractorMeasure(newMeasure, level) }; // Pass level
    const distractorC = { id: 'distractor2', pattern: generateDistractorMeasure(newMeasure, level) }; // Pass level

    const [uniqueCorrect, uniqueB, uniqueC] = ensureUniqueOptions(
      newMeasure,
      distractorB.pattern,
      distractorC.pattern,
      level // Pass level
    );

    const shuffledOptions = [
        { id: 'correct', pattern: uniqueCorrect },
        { id: 'distractor1', pattern: uniqueB },
        { id: 'distractor2', pattern: uniqueC }
    ].sort(() => Math.random() - 0.5);

    setOptions(shuffledOptions);
    setSelectedAnswer(null); // Clear previous selection

    setGameState('listening'); // Now we are in listening state
    setTimeout(() => {
      playFullSequence(newMeasuresSequence); // Play the full sequence including the new measure
    }, 500);
  }, [currentRound, config, level, measures, playFullSequence]); // Added level to dependencies

  // Memoize startNewGame
  const startNewGame = useCallback(() => {
    setCorrectAnswers(0);
    setTotalXpEarned(0); // Renamed from totalXP
    setGameEnded(false);
    setSelectedAnswer(null);
    setIsPlayingAudio(false);
    setMeasures([]); // Clear measures for a new game
    setCurrentRound(1); // Reset round count
    setGameState('ready'); // Prepare for the user to start
  }, []);

  // Memoize handleStartFromIntro
  const handleStartFromIntro = useCallback(() => {
    setShowIntro(false);
    startNewGame(); // Go directly into the game
    localStorage.setItem('drumline_intro_seen_v3', 'true');
  }, [startNewGame]);

  useEffect(() => {
    // Read level from URL
    const params = new URLSearchParams(window.location.search);
    const urlLevel = parseInt(params.get('level'));
    if (urlLevel && LEVEL_CONFIG[urlLevel]) {
      setLevel(urlLevel);
    } else {
      setLevel(1); // Default to level 1 if invalid
    }
  }, []); // Empty dependency array means this runs once on mount.

  // Load synthesizer, user progress, and check for intro
  useEffect(() => {
    const initAudio = async () => {
      // Lazy-load AudioSynthesizer
      const { AudioSynthesizer } = await import('../components/training/AudioSynthesizer');
      synthesizer.current = new AudioSynthesizer();
    };
    initAudio();

    // Load user progress
    loadUserProgress();

    // Changed localStorage key to reset the intro for all users
    const introSeen = localStorage.getItem('drumline_intro_seen_v3');
    if (!introSeen) {
      setShowIntro(true);
      setGameState('intro'); // Set intro state if not seen
    } else {
      setGameState('ready'); // Set ready state if seen
    }

    return () => {
      if (synthesizer.current) {
        synthesizer.current.stop();
      }
    };
  }, [loadUserProgress]); // Run once on component mount, re-run if loadUserProgress changes (though it's stable)

  const handleAnswer = (option) => {
    if (gameState !== 'guessing' || isPlayingAudio) return;
    
    setSelectedAnswer(option);
    setGameState('feedback'); // Transition to feedback state immediately to show Aretha
    
    const isCorrect = option.id === 'correct';
    
    if (isCorrect) {
      const newCorrectAnswers = correctAnswers + 1; // Calculate new count before setting state
      setCorrectAnswers(newCorrectAnswers);
      
      // **Design Change**: Smooth transition to next round with proper timing
      setTimeout(() => {
        if (newCorrectAnswers < config.rounds) { // Check if there are more rounds to play after this correct answer
          generateNextRound(); // Generate and play the next rhythm sequence
        } else {
          // If this was the last round AND correct, then the level is complete
          handleSessionComplete(); // All rounds completed successfully
        }
        setSelectedAnswer(null); // Clear selected answer for next round/end screen
      }, 2500); // Display feedback for 2.5 seconds before proceeding
    } else {
      // Incorrect answer, game ends immediately.
      // Calculate XP for display based on correct answers so far.
      const finalXPForLoss = correctAnswers * config.xpPerCorrect;
      setTotalXpEarned(finalXPForLoss); // Set XP for display on loss screen
      
      // **Design Change**: Smooth transition to game end with proper timing
      setTimeout(() => {
        setGameEnded(true); // Indicate game has ended for UI
        setGameState('ended'); // Transition to ended state
        // For a loss, we still want to save earned XP if any.
        // updateProgress will correctly not advance drumline_memory_level if the current level was not completed.
        if (finalXPForLoss > 0) {
            updateProgress(finalXPForLoss);
        }
        setSelectedAnswer(null); // Clear selected answer for end screen
      }, 2500); // Display feedback for 2.5 seconds before proceeding
    }
  };

  const progress = ((currentRound - 1) / config.rounds) * 100; // Calculate progress based on completed rounds

  // Handle intro as a full-screen overlay before main app renders
  if (showIntro) {
    return (
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
        <ArethaIntroduction onComplete={handleStartFromIntro} />
      </div>
    );
  }

  // Handle game end (complete or failed) as a full-screen overlay
  if (gameEnded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 p-4 sm:p-8 flex flex-col items-center justify-center">
        {gameState === 'ended' && (
          <motion.div
            key="game-end"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center w-full max-w-md"
          >
            <Card className="clay-card bg-white/90 rounded-2xl p-8"> {/* Added outline styling */}
              <CardContent className="p-0"> {/* Remove default padding, controlled by parent card */}
                {correctAnswers === config.rounds ? (
                  <>
                    <ArethaCelebration message={`Level ${level} Complete! You've got the soul!`} />
                    <div className="space-y-6 mt-4">
                      <p className="text-gray-600">You completed the challenge flawlessly!</p>
                      <div className="text-xl font-bold text-green-600">+{totalXpEarned} XP Total</div> {/* Changed totalXP to totalXpEarned */}

                      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                        {level < Object.keys(LEVEL_CONFIG).length && (
                          <Link to={createPageUrl(`DrumlineMemory?level=${level + 1}`)}>
                            <Button className="clay-button bg-green-600 hover:bg-green-700 text-white">
                              Next Level
                            </Button>
                          </Link>
                        )}
                        <Button onClick={startNewGame} variant="outline" className="clay-button text-black">
                          Play Again
                        </Button>
                        <Link to={createPageUrl("RhythmTrainingMenu")}>
                          <Button variant="outline" className="clay-button text-black">
                            <Home className="w-4 h-4 mr-2" />
                            Back to Menu
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-6xl">💔</div>
                    <h2 className="text-2xl font-bold text-red-600">Game Over</h2>
                    <p className="text-gray-600">You reached round {Math.max(0, currentRound - 1)} of {config.rounds}</p>
                    <div className="text-lg font-semibold text-blue-600">Score: {correctAnswers}/{Math.max(0, currentRound - 1)}</div>
                    <div className="text-xl font-bold text-blue-600">+{totalXpEarned} XP Total</div> {/* Changed totalXP to totalXpEarned */}

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                      <Button onClick={startNewGame} className="clay-button bg-red-600 hover:bg-red-700 text-black">
                        Try Again
                      </Button>
                      <Link to={createPageUrl("RhythmTrainingMenu")}>
                        <Button variant="outline" className="clay-button text-black">
                          <Home className="w-4 h-4 mr-2" />
                          Back to Menu
                        </Button>
                      </Link>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 p-4 sm:p-8 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link to={createPageUrl("RhythmTrainingMenu")}>
            <Button variant="ghost" size="icon" className="clay-button">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">Drumline Memory</h1>
            <p className="text-gray-600">Level {level} - {config.timeSignature[0]}/{config.timeSignature[1]} Time</p>
          </div>
          <Link to={createPageUrl('Home')}>
            <Button variant="ghost" size="icon" className="clay-button">
              <Home className="w-5 h-5" />
            </Button>
          </Link>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-medium text-gray-700">Round {Math.max(0, currentRound - 1)} of {config.rounds}</span>
          </div>
          <Progress value={progress} className="mb-8" />
        </div>

        {/* Ready State */}
        {gameState === 'ready' && (
          <motion.div
            key="ready"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            <Card className="clay-card">
              <CardContent className="p-8">
                <Trophy className="w-16 h-16 mx-auto text-red-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Drumline Memory!</h2>
                <p className="text-gray-600 mb-6">Listen to rhythm sequences and identify the new measure added in each round.</p>
                <Button onClick={generateNextRound} className="clay-button bg-red-600 hover:bg-red-700 text-black">
                  Start Level {level}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Listening State */}
        {(gameState === 'listening' || isPlayingAudio) && (
           <motion.div
             key="listening"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="text-center p-8 clay-card bg-white/50"
           >
             <h2 className="text-2xl font-bold text-gray-800 mb-4">Listen...</h2>
             <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto"/>
             <p className="text-gray-600 mt-4">Memorize the sequence.</p>
           </motion.div>
        )}

        {/* Guessing State */}
        {gameState === 'guessing' && measures.length > 0 && (
          <div className="w-full">
            <div className="text-center mb-4">
              <p className="text-lg text-gray-700">Which notation matches measure {Math.max(0, currentRound - 1)}?</p>
              <p className="text-sm text-gray-500">Select the card with the correct rhythm.</p>
            </div>
            
            {/* Options */}
            <div className="grid grid-cols-1 gap-4 w-full justify-center">
              {options.map((option, index) => {
                const isSelected = selectedAnswer && selectedAnswer.id === option.id;
                const isCorrectOptionSelected = isSelected && selectedAnswer.id === 'correct';
                const revealCorrectAfterIncorrect = selectedAnswer && !isCorrectOptionSelected && option.id === 'correct';
                
                const optionLabels = ['A', 'B', 'C'];
                const optionLetter = optionLabels[index];

                return (
                  <Card
                    key={option.id}
                    onClick={() => handleAnswer(option)}
                    className={`clay-card p-4 transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? isCorrectOptionSelected ? 'ring-2 ring-green-500' : 'ring-2 ring-red-500'
                        : 'hover:bg-white/80'
                    } ${
                      revealCorrectAfterIncorrect ? 'ring-2 ring-green-500' : ''
                    } ${
                      gameState === 'feedback' ? 'pointer-events-none' : ''
                    }`}
                  >
                    <CardContent className="p-2 flex flex-col items-center">
                      <h4 className="font-bold text-gray-700 mb-2">{`Option ${optionLetter}`}</h4>
                      <div className="w-full h-[120px] overflow-hidden"> 
                        <VexFlowStaff
                          rhythmPattern={option.pattern}
                          timeSignature={config.timeSignature}
                          compact={true}
                        />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="mt-6 flex flex-col items-center gap-4">
              {/* Replay Button */}
              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={() => playFullSequence(measures)}
                  disabled={isPlayingAudio || selectedAnswer !== null}
                  className="clay-button"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Replay Full Sequence
                </Button>
              </div>

              {/* Measure blocks */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                {measures.slice(0, -1).map((_, index) => (
                  <div key={index} className="clay-card bg-white/60 px-4 py-2 rounded-lg text-center">
                    <p className="text-sm font-semibold text-gray-700">Measure {index + 1}</p>
                  </div>
                ))}
                <div className="clay-card bg-red-100 border-2 border-red-400 px-4 py-2 rounded-lg text-center">
                  <p className="text-sm font-bold text-red-700">Current Measure</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* **Design Change**: Enhanced Aretha feedback with smooth animations */}
        <AnimatePresence>
          {gameState === 'feedback' && selectedAnswer && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-2xl max-w-md w-full"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <ArethaMascot size="medium" variant="singing" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-purple-100 rounded-lg p-4 text-center">
                      <p className="text-purple-800 font-bold text-lg">
                        {selectedAnswer.id === 'correct' 
                          ? `+${config.xpPerCorrect} XP - That's it, baby!` 
                          : "That's not quite right, sugar!"}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
