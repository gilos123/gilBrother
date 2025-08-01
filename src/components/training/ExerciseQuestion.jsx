
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Volume2, Loader2, Clock, RotateCcw, Merge, Flame } from "lucide-react"; // Flame icon added for streak display
import { Badge } from "@/components/ui/badge";
import { AudioSynthesizer, INTERVALS, CHORDS } from "./AudioSynthesizer";
import { AudioFeedback } from "./AudioFeedback";
import { AnimatePresence, motion } from "framer-motion";
import TipDisplay from './TipDisplay';
import VexFlowInterval from './VexFlowInterval';
import VexFlowStaff from './VexFlowStaff';
import VexFlowSightReading from './VexFlowSightReading';

export default function ExerciseQuestion({ exercise, onAnswer, moduleColor, tip, consecutiveCorrect = 0, isRetrySession = false }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [playingOptionId, setPlayingOptionId] = useState(null);
  const [audioError, setAudioError] = useState(false);
  const [useMetronome, setUseMetronome] = useState(false);
  const [timeLeft, setTimeLeft] = useState(exercise.timer || 10);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const synthesizerRef = useRef(null);
  const feedbackRef = useRef(null);

  useEffect(() => {
    try {
      synthesizerRef.current = new AudioSynthesizer();
      feedbackRef.current = new AudioFeedback();
    } catch (error) {
      console.error("Error initializing audio:", error);
      setAudioError(true); // Set audio error state if initialization fails
    }
    
    return () => {
      try {
        if (synthesizerRef.current && typeof synthesizerRef.current.stop === 'function') {
          synthesizerRef.current.stop();
        }
      } catch (error) {
        console.error("Error stopping audio:", error);
      }
    };
  }, []);

  useEffect(() => {
    try {
      if (synthesizerRef.current && typeof synthesizerRef.current.stop === 'function') {
        synthesizerRef.current.stop();
      }
    } catch (error) {
      console.error("Error stopping audio on exercise change:", error);
    }
    
    setPlayingOptionId(null);
    setAudioError(false); // Reset audio error for new exercise
    setSelectedAnswer(null);
    setShowFeedback(false);
    setNotifications([]); // Clear notifications for new exercise

    // Start timer for sight reading exercises
    if (exercise && exercise.type === 'note_identification') {
      setTimeLeft(exercise.timer || 10);
      setIsTimerActive(true);
      setQuestionStartTime(Date.now());
    } else {
      setIsTimerActive(false);
      setQuestionStartTime(null);
    }
  }, [exercise]);

  // Timer countdown effect
  useEffect(() => {
    let timer;
    if (isTimerActive && timeLeft > 0 && !showFeedback) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && !showFeedback && isTimerActive) {
      handleAnswerSelect(null);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timeLeft, isTimerActive, showFeedback, exercise]); // Added exercise to dependencies for completeness

  const addNotification = (notification) => {
    try {
      const id = Date.now() + Math.random(); // Use Math.random() for more unique IDs within a short timeframe
      const newNotification = { ...notification, id };
      
      setNotifications(prev => [...prev, newNotification]);
      
      // Remove notification after duration
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, notification.duration || 2000);
    } catch (error) {
      console.error("Error adding notification:", error);
    }
  };

  const handleAnswerSelect = (answer) => {
    if (showFeedback) return;

    try {
      const responseTime = questionStartTime ? (Date.now() - questionStartTime) / 1000 : null;
      let currentHasSpeedBonus = false; // Flag to track if speed bonus is earned for this answer

      if (exercise && exercise.type === 'note_identification' && responseTime !== null && responseTime <= 2 && answer === exercise.correct_answer) {
        currentHasSpeedBonus = true;
        
        addNotification({
          type: 'speed_bonus',
          message: 'Speed Bonus! +1 XP',
          icon: '⚡',
          duration: 2000
        });
      }

      setSelectedAnswer(answer);
      setShowFeedback(true);
      setIsTimerActive(false);

      if (synthesizerRef.current && typeof synthesizerRef.current.stop === 'function') {
        synthesizerRef.current.stop();
      }
      setPlayingOptionId(null);

      const isCorrect = answer === exercise?.correct_answer;
      if (isCorrect) {
        if (feedbackRef.current && typeof feedbackRef.current.playCorrectSound === 'function') {
          feedbackRef.current.playCorrectSound();
        }
      } else {
        if (feedbackRef.current && typeof feedbackRef.current.playIncorrectSound === 'function') {
          feedbackRef.current.playIncorrectSound();
        }
      }

      setTimeout(() => {
        if (typeof onAnswer === 'function') {
          onAnswer(answer, currentHasSpeedBonus); // Pass the calculated speed bonus to the parent
        }
      }, 1500);
    } catch (error) {
      console.error("Error handling answer selection:", error);
      // Still call onAnswer even if there's an error
      if (typeof onAnswer === 'function') {
        onAnswer(answer, false); // Ensure `false` is passed for speed bonus on error
      }
    }
  };

  const playAudioForOption = async (option) => {
    if (!option || !exercise) return;
    
    try {
      if (playingOptionId) {
        if (synthesizerRef.current && typeof synthesizerRef.current.stop === 'function') {
          synthesizerRef.current.stop();
        }
        setPlayingOptionId(null);
        if (playingOptionId === option.id) return;
      }

      setPlayingOptionId(option.id);
      setAudioError(false);

      if (exercise.type === 'rhythm_recognition' && option.pattern) {
        const audioPattern = option.pattern.map(item => ({
          type: item.type,
          beat: item.beat,
          duration: item.duration
        }));

        if (synthesizerRef.current && typeof synthesizerRef.current.playRhythmPattern === 'function') {
          await synthesizerRef.current.playRhythmPattern(audioPattern, 80, useMetronome);
        }

        const bpmDuration = (60000 / 80) * 4; // Assuming 4 beats per measure for rhythm pattern length
        setTimeout(() => setPlayingOptionId(null), bpmDuration + 200);
      }
    } catch (e) {
      console.error("Audio playback error:", e);
      setAudioError(true);
      setPlayingOptionId(null);
    }
  };

  const playPrimaryAudio = async () => {
    if (!exercise || playingOptionId) return;
    
    try {
      setAudioError(false);
      setPlayingOptionId('primary');

      // Initialize AudioSynthesizer if it wasn't initialized or failed previously
      if (!synthesizerRef.current) {
        synthesizerRef.current = new AudioSynthesizer();
      }
      await synthesizerRef.current.initAudioContext();

      const baseFrequency = exercise.baseFrequency || 261.63; // C4
      let audioDuration = 2000;

      if (exercise.type === 'interval_identification') {
        const semitones = INTERVALS[exercise.correct_answer];
        if (typeof semitones !== 'undefined') {
          audioDuration = await synthesizerRef.current.playInterval(baseFrequency, semitones, exercise.level);
        } else {
          throw new Error(`Interval definition not found for: ${exercise.correct_answer}`);
        }
      } else if (exercise.type === 'chord_identification') {
        const offsets = CHORDS[exercise.correct_answer];
        if (offsets) {
          audioDuration = await synthesizerRef.current.playChord(baseFrequency, offsets);
        } else {
          throw new Error(`Chord definition not found for: ${exercise.correct_answer}`);
        }
      }
      
      setTimeout(() => setPlayingOptionId(null), audioDuration + 100);
    } catch (error) {
      console.error("Error playing primary audio:", error);
      setAudioError(true);
      setPlayingOptionId(null);
    }
  };

  const playHarmonicPreview = async () => {
    if (!exercise || playingOptionId || exercise.type !== 'interval_identification') return;
    
    try {
      setAudioError(false);
      setPlayingOptionId('harmonic_preview');
      
      const semitones = INTERVALS[exercise.correct_answer];
      if (typeof semitones !== 'undefined' && synthesizerRef.current) {
        const baseFrequency = exercise.baseFrequency || 261.63; // C4
        // Assuming harmonic playback is available for specific levels of intervals, e.g., level 5 and below
        const audioDuration = await synthesizerRef.current.playIntervalHarmonically(baseFrequency, semitones);
        setTimeout(() => setPlayingOptionId(null), audioDuration + 100);
      } else {
        throw new Error("Could not play harmonic preview.");
      }
    } catch (error) {
      console.error("Error playing harmonic preview:", error);
      setAudioError(true);
      setPlayingOptionId(null);
    }
  };


  if (!exercise) {
    return (
      <div className="text-center p-6">
        <p>Loading exercise...</p>
      </div>
    );
  }

  const isCorrect = selectedAnswer === exercise.correct_answer;

  // FIXED: Get the display name for the correct answer, especially for translated intervals
  let correctAnswerDisplayName = exercise.correct_answer;
  if (exercise.type === 'interval_identification' && Array.isArray(exercise.options) && exercise.options.length > 0 && typeof exercise.options[0] === 'object') {
    const correctOption = exercise.options.find(opt => opt.id === exercise.correct_answer);
    if (correctOption) {
      correctAnswerDisplayName = correctOption.name;
    }
  }


  return (
    <div className="space-y-6 relative">
      {/* FIXED: Ensure only one tip is displayed, with a consistent title. */}
      {tip && <TipDisplay title="Let's try this again:" tip={tip} />}
      
      {/* Notification Stack */}
      <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 space-y-2">
        <AnimatePresence>
          {notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: -20, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                y: index * 60, // Stacks notifications vertically
                scale: 1 
              }}
              exit={{ opacity: 0, y: -20, scale: 0.8 }}
              className={`px-6 py-3 rounded-full shadow-lg font-bold flex items-center gap-2 ${
                notification.type === 'speed_bonus' 
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
                  : 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
              }`}
            >
              <span className="text-2xl">{notification.icon}</span>
              <span>{notification.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Card className="clay-card">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              {exercise.question || 'Loading question...'}
            </h2>
            {/* Display consecutive correct streak if applicable */}
            {consecutiveCorrect > 0 && !isRetrySession && ( // Only show streak badge if streak is active and not a retry session
              <Badge variant="secondary" className="bg-orange-500 text-white text-md px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                <Flame className="w-4 h-4" />
                {consecutiveCorrect}
              </Badge>
            )}
          </div>

          {/* Audio Controls for Ear Training */}
          {(exercise.type === 'interval_identification' || exercise.type === 'chord_identification') && (
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              <Button
                variant="outline"
                size="lg"
                onClick={playPrimaryAudio}
                className="bg-white/10"
                disabled={playingOptionId !== null}
              >
                <Volume2 className="w-5 h-5 mr-2" />
                {playingOptionId === 'primary' ? 'Playing...' : 'Play'}
              </Button>
              
              {!showFeedback && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={playPrimaryAudio} // Replay uses the same function
                  className="bg-white/10"
                  disabled={playingOptionId !== null}
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Replay
                </Button>
              )}

              {/* NEW: Harmonic Playback Button */}
              {!showFeedback && exercise.type === 'interval_identification' && exercise.level <= 5 && ( // Added level condition for harmonic playback
                <Button
                  variant="outline"
                  size="lg"
                  onClick={playHarmonicPreview}
                  className="bg-white/10"
                  disabled={playingOptionId !== null}
                >
                  <Merge className="w-5 h-5 mr-2" />
                  {playingOptionId === 'harmonic_preview' ? 'Playing...' : 'Play Together'}
                </Button>
              )}
            </div>
          )}

          {/* VexFlow display for Musical Geography */}
          {(exercise.type === 'musical_geography_identification' || exercise.type === 'musical_geography_generation') && (
            <VexFlowInterval
              notes={exercise.notes}
              clef="treble"
            />
          )}

          {/* SIGHT READING STAFF DISPLAY */}
          {exercise.type === 'note_identification' && exercise.note && (
            <div className="mb-4">
              <VexFlowSightReading note={exercise.note} />
              
              {/* Timer positioned under the notation */}
              {isTimerActive && (
                <div className="mt-4 flex justify-center">
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                    timeLeft <= 3 ? 'bg-red-100 text-red-700' :
                    timeLeft <= 5 ? 'bg-orange-100 text-orange-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    <Clock className="w-4 h-4" />
                    <span className="font-bold">{timeLeft}s</span>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* FIXED: Speed bonus message only shows if NOT a retry session */}
          {exercise.type === 'note_identification' && isTimerActive && !showFeedback && !isRetrySession && (
            <div className="mt-4 text-sm text-yellow-700 bg-yellow-50 px-3 py-2 rounded-lg">
              ⚡ Answer in 2 seconds or less for a speed bonus!
            </div>
          )}

          {audioError && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
              ⚠️ Audio error. Please try again or check your device volume.
            </div>
          )}
        </CardContent>
      </Card>

      {/* RHYTHM STAFF DISPLAY - RESTORED */}
      {exercise.type === 'rhythm_recognition' && exercise.rhythmPattern && (
        <VexFlowStaff
          rhythmPattern={exercise.rhythmPattern}
          tempo={90} // Assuming a default tempo for display, adjust if exercise provides one
        />
      )}

      {/* Answer Options */}
      <div className="space-y-4">
        {exercise.type === 'rhythm_recognition' && (
            <div className="flex items-center justify-center space-x-2">
                <Switch
                    id="metronome-mode"
                    checked={useMetronome}
                    onCheckedChange={setUseMetronome}
                />
                <Label htmlFor="metronome-mode" className="text-gray-700">Easy Mode (with Metronome)</Label>
            </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {exercise.options && exercise.options.map((option, index) => {
            const isSelected = selectedAnswer === (option.id || option);
            const isCorrectOption = (option.id || option) === exercise.correct_answer;
            const isThisOnePlaying = playingOptionId === option.id;

            let buttonStyle = "clay-button text-gray-800";
            if (showFeedback && isSelected) {
              buttonStyle = isCorrect
                ? "bg-gradient-to-br from-green-400 to-emerald-500 text-white"
                : "bg-gradient-to-br from-red-400 to-pink-500 text-white";
            } else if (showFeedback && isCorrectOption && !isCorrect) {
              buttonStyle = "bg-gradient-to-br from-green-300 to-emerald-400 text-white opacity-70";
            }

            if (exercise.type === 'rhythm_recognition') {
              return (
                <div key={option.id || index} className="col-span-1 sm:col-span-2 flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="lg"
                    className={`flex-1 h-16 text-lg font-medium transition-all duration-200 ${buttonStyle}`}
                    onClick={() => handleAnswerSelect(option.id)}
                    disabled={showFeedback}
                  >
                    {option.name}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-16 h-16 rounded-full clay-button"
                    onClick={() => playAudioForOption(option)}
                    disabled={showFeedback || (playingOptionId !== null && playingOptionId !== option.id)}
                  >
                    {isThisOnePlaying ? <Loader2 className="w-6 h-6 animate-spin"/> : <Volume2 className="w-6 h-6" />}
                  </Button>
                </div>
              );
            }

            // FIXED: Musical Geography Generation with note letter options
            if (exercise.type === 'musical_geography_generation') {
              return (
                <Button
                  key={option.id}
                  variant="outline"
                  size="lg"
                  className={`h-16 text-lg font-medium transition-all duration-200 ${buttonStyle}`}
                  onClick={() => handleAnswerSelect(option.id)}
                  disabled={showFeedback}
                >
                  {option.label || option.name || option}
                </Button>
              );
            }

            // Default button for other exercise types
            return (
              <Button
                key={option.id || index}
                variant="outline"
                size="lg"
                className={`h-16 text-lg font-medium transition-all duration-200 ${buttonStyle}`}
                onClick={() => handleAnswerSelect(option.id || option)}
                disabled={showFeedback}
              >
                {option.name || option}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Feedback */}
      {showFeedback && (
        <div className="text-center">
          <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white ${
            isCorrect
              ? 'bg-green-500'
              : 'bg-red-500'
          }`}>
            {isCorrect ? '🎉 Correct!' :
             selectedAnswer === null ? '⏰ Time\'s up!' :
             `❌ Incorrect. Answer: ${correctAnswerDisplayName}`}
          </div>
        </div>
      )}
    </div>
  );
}
