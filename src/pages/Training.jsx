import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { User, UserProgress, Session, WeeklyArena } from "@/api/entities";
import { getYear, getISOWeek, subWeeks } from 'date-fns';
import { generateExercises, shouldLevelUp, getLevelRange } from "../components/training/ExerciseGenerator";
import { generateTip } from "../components/training/TipGenerator";
import { checkAndAwardBasicBadges } from '../components/training/BadgeManager';
import ExerciseQuestion from "../components/training/ExerciseQuestion";
import SessionResults from "../components/training/SessionResults";
import BachIntroduction from "../components/training/BachIntroduction";
import JimiIntroduction from "../components/training/JimiIntroduction";
import DukeIntroduction from "../components/training/DukeIntroduction";
import FreddieIntroduction from "../components/training/FreddieIntroduction";
import MotivationBoost from "../components/training/MotivationBoost";
import LevelUpCelebration from "../components/training/LevelUpCelebration";
import MistakeIntro from "../components/training/MistakeIntro";
import TipDisplay from "../components/training/TipDisplay";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AnimatePresence, motion } from "framer-motion";
import { MINI_LESSON_CONTENT } from "../components/training/miniLessonContent";
import MiniLesson from "../components/training/MiniLesson";

// New VIEWS enum to manage the main application state
const VIEWS = {
  LOADING: "loading",
  INTRODUCTION: "introduction",
  TRAINING: "training",
  RESULTS: "results",
  MISTAKE_TRANSITION: "mistake_transition", // The new transition screen view
  FORCED_RETRY: "forced_retry", // A specific training mode for retrying mistakes
};

export default function Training() {
  const navigate = useNavigate();
  const [module, setModule] = useState("");
  const [currentView, setCurrentView] = useState(VIEWS.LOADING); // Primary view controller
  const [exercises, setExercises] = useState([]);
  const [mistakeExercises, setMistakeExercises] = useState([]); // State to hold exercises answered incorrectly for retry (will store only exercise objects)
  const [currentIndex, setCurrentIndex] = useState(0); // Current exercise index
  const [answers, setAnswers] = useState([]); // Simplified answer storage: { questionIndex, exercise, answer, isCorrect, hasSpeedBonus }
  const [mainSessionAnswers, setMainSessionAnswers] = useState([]); // Store original answers for tip generation
  const [userProgress, setUserProgress] = useState(null);
  const [sessionLevel, setSessionLevel] = useState(1);
  const [totalAnswersGiven, setTotalAnswersGiven] = useState(0);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [lastSessionStats, setLastSessionStats] = useState({ correct: 0, total: 0, xp: 0 }); // Added XP to preserved stats
  const [notifications, setNotifications] = useState([]);

  // Modals are controlled by separate boolean states, allowing them to overlay any currentView
  const [showIntroduction, setShowIntroduction] = useState(false); // Controls introduction modal visibility
  const [currentIntroType, setCurrentIntroType] = useState(null); // 'bach', 'jimi', 'duke', 'freddie' for introduction content
  const [introLevel, setIntroLevel] = useState(1); // Level associated with the current introduction
  const [levelUpInfo, setLevelUpInfo] = useState({}); // Information for the LevelUpCelebration component (initialized to empty object)
  const [showMotivation, setShowMotivation] = useState(false); // Controls motivation boost modal visibility
  // New States for Mini Lesson System
  const [showMiniLesson, setShowMiniLesson] = useState(false);
  const [miniLessonInfo, setMiniLessonInfo] = useState(null);
  const [isSaving, setIsSaving] = useState(false); // New state to track saving process

  // Notification removal function, memoized for useEffect dependency
  const removeNotification = useCallback((notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  }, []);

  // --- FUNCTION DEFINITIONS ---
  // Moved all major functions here to fix initialization errors and improve organization.

  // Loads user progress from the backend or initializes it if not found
  const loadUserProgress = async () => {
    try {
      const user = await User.me();
      const progressList = await UserProgress.filter({ created_by: user.email });
      if (progressList.length > 0) {
        setUserProgress(progressList[0]);
      } else {
        // Create new progress entry if none exists
        const newProgress = await UserProgress.create({
          total_xp: 0,
          current_streak: 0,
          ear_training_level: 1,
          rhythm_training_level: 1,
          sight_reading_level: 1,
          musical_geography_level: 1,
          practice_hour_history: [],
          module_history: [],
          low_accuracy_streak: 0,
          high_accuracy_ear_sessions: 0,
          correct_rhythm_exercises: 0,
          total_arena_wins: 0,
          last_win_awarded_week: null,
          last_practice_date: null, // Ensure this field exists for streak logic
          streak_last_updated_date: null, // New field for daily streak update
          daily_xp: 0, // NEW: Initialize daily_xp
        });
        setUserProgress(newProgress);
      }
    } catch (error) {
      console.error("Error loading user progress:", error);
      // Fallback for local development or if UserProgress service is down
      // Provides a default state to prevent app crash
      setUserProgress({
        total_xp: 0,
        current_streak: 0,
        ear_training_level: 1,
        rhythm_training_level: 1,
        sight_reading_level: 1,
        musical_geography_level: 1,
        practice_hour_history: [],
        module_history: [],
        low_accuracy_streak: 0,
        high_accuracy_ear_sessions: 0,
        correct_rhythm_exercises: 0,
        total_arena_wins: 0,
        last_win_awarded_week: null,
        last_practice_date: null, // Ensure this field exists for streak logic
        streak_last_updated_date: null, // New field for daily streak update
        daily_xp: 0, // NEW: Initialize daily_xp
      });
    }
  };

  // Starts a new training session with fresh exercises
  const startTraining = useCallback((moduleType) => {
    try {
      const exerciseCount = moduleType === 'combined' ? 10 : 7;
      let level = 1;
      if (userProgress) {
        // Get the appropriate level for the module
        if (moduleType === 'rhythm_training') level = userProgress.rhythm_training_level;
        if (moduleType === 'sight_reading') level = userProgress.sight_reading_level;
        if (moduleType === 'ear_training') level = userProgress.ear_training_level;
        if (moduleType === 'musical_geography') level = userProgress.musical_geography_level;
        if (moduleType === 'combined') level = Math.min(userProgress.ear_training_level, userProgress.rhythm_training_level, userProgress.sight_reading_level, userProgress.musical_geography_level || 1);
      }
      setSessionLevel(level); // Store the session's starting level

      // Generate exercises
      const newExercises = generateExercises(moduleType, exerciseCount, level);
      
      // FIXED: Conditionally shuffle options. Rhythm training relies on a fixed A,B,C order.
      const processedExercises = newExercises.map(exercise => {
        // ONLY shuffle if it's NOT a rhythm exercise
        if (exercise.type !== 'rhythm_recognition' && exercise.options && Array.isArray(exercise.options)) {
          const originalCorrectAnswer = exercise.correct_answer;
          const shuffledOptions = [...exercise.options].sort(() => Math.random() - 0.5);
          return { ...exercise, options: shuffledOptions, correct_answer: originalCorrectAnswer };
        }
        // For rhythm exercises, return them as-is without shuffling options.
        return exercise;
      });

      setExercises(processedExercises);
      setCurrentIndex(0);
      setAnswers([]); // Ensure this is always an array
      setMainSessionAnswers([]); // Reset main session answers for a new session
      setMistakeExercises([]); // Ensure this is always an array
      setTotalAnswersGiven(0);
      setConsecutiveCorrect(0);
      setShowMotivation(false); // Ensure motivation modal is hidden
      setCurrentView(VIEWS.TRAINING); // Set the main view to TRAINING
    } catch (error) {
      console.error("Error starting new session:", error);
      // Set safe defaults
      setExercises([]);
      setAnswers([]);
      setMainSessionAnswers([]);
      setMistakeExercises([]);
    }
  }, [userProgress]); // userProgress is a dependency because session level depends on it

  // Only show intros at the start of new level groups, with Mini Lesson option
  const checkForLevelRangeIntroduction = (moduleType, level) => {
    // Only show introductions at the beginning of level groups
    let introLevels = [1, 6, 11, 16];
    if (moduleType === 'sight_reading' || moduleType === 'musical_geography') {
      introLevels = [1, 6, 11, 16, 21, 26]; // Additional levels for 30-level modules
    }

    // If the level is above the maximum defined for this module type's intros, return false.
    if (level > (introLevels[introLevels.length - 1] || 0)) return false; // Added check for empty introLevels array

    if (!introLevels.includes(level)) return false;

    const key = `intro_seen_${moduleType}_level_${level}`;
    if (localStorage.getItem(key)) return false; // Don't show if already seen

    // Determine level group string
    let levelGroup;
    if (level >= 1 && level <= 5) levelGroup = '1-5';
    else if (level >= 6 && level <= 10) levelGroup = '6-10';
    else if (level >= 11 && level <= 15) levelGroup = '11-15';
    else if (level >= 16 && level <= 20) levelGroup = '16-20';
    else if (level >= 21 && level <= 25) levelGroup = '21-25';
    else if (level >= 26 && level <= 30) levelGroup = '26-30';
    else return false; // Level not within any defined group

    // Check if mini lesson content exists
    const hasContent = MINI_LESSON_CONTENT[moduleType]?.[levelGroup];

    if (hasContent) {
      setMiniLessonInfo({ moduleType, levelGroup });
      setIntroLevel(level);
      setShowIntroduction(true); // Show the introduction modal
      setCurrentView(VIEWS.INTRODUCTION); // Set the main view state to INTRODUCTION

      // Assign character for the introduction based on module type
      if (moduleType === 'ear_training') setCurrentIntroType('jimi');
      else if (moduleType === 'rhythm_training') setCurrentIntroType('duke');
      else if (moduleType === 'sight_reading') setCurrentIntroType('bach');
      else if (moduleType === 'musical_geography') setCurrentIntroType('freddie');

      localStorage.setItem(key, 'true'); // Mark introduction as seen
      return true;
    }

    return false; // No introduction triggered (either already seen or no content for this level)
  };

  // NEW HANDLERS FOR MINI LESSON FLOW
  const handleStartMiniLesson = () => {
    setShowIntroduction(false);
    setShowMiniLesson(true);
  };

  const handleContinueFromMiniLesson = () => {
    setShowMiniLesson(false);
    startTraining(module);
  };

  const handleSkipMiniLesson = () => {
    setShowMiniLesson(false);
    startTraining(module);
  };
  // END NEW HANDLERS

  // --- useEffect HOOKS ---

  // Initial load effect: get module from URL and load user progress
  useEffect(() => {
    const init = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const moduleParam = urlParams.get('module');
        if (moduleParam) {
          setModule(moduleParam);
        }
        await loadUserProgress();
        // The next useEffect will handle transitioning from LOADING to INTRODUCTION/TRAINING
      } catch (error) {
        console.error("Error in Training component initialization:", error);
      }
    };
    init();
  }, []);

  // Effect for handling global notifications with auto-hide for "5 in a Row"
  useEffect(() => {
    const handleNewNotification = (event) => {
      try {
        const notification = event.detail;
        const id = Date.now() + Math.random();
        const newNotification = { ...notification, id };

        setNotifications(prev => [...prev, newNotification]);

        // Auto-hide general notifications after their specified duration or 5 seconds
        const duration = notification.duration || 5000;
        setTimeout(() => {
          removeNotification(id);
        }, duration);
      } catch (error) {
        console.error("Error handling notification:", error);
      }
    };

    window.addEventListener('add-notification', handleNewNotification);
    return () => {
      window.removeEventListener('add-notification', handleNewNotification);
    };
  }, [removeNotification]);

  // Effect for managing initial session start or introduction display
  useEffect(() => {
    // Only proceed if module and userProgress are loaded and the view is currently LOADING
    if (!module || !userProgress || currentView !== VIEWS.LOADING) {
      return;
    }

    let currentModuleLevel = 1;
    // Determine the current level for the selected module
    if (module === 'ear_training') currentModuleLevel = userProgress.ear_training_level;
    else if (module === 'rhythm_training') currentModuleLevel = userProgress.rhythm_training_level;
    else if (module === 'sight_reading') currentModuleLevel = userProgress.sight_reading_level;
    else if (module === 'musical_geography') currentModuleLevel = userProgress.musical_geography_level;
    else if (module === 'combined') currentModuleLevel = Math.min(userProgress.ear_training_level, userProgress.rhythm_training_level, userProgress.sight_reading_level, userProgress.musical_geography_level || 1);

    // Check if an introduction needs to be shown ONLY for new level groups (1, 6, 11, 16)
    const introTriggered = checkForLevelRangeIntroduction(module, currentModuleLevel);

    if (!introTriggered) {
      // If no introduction is needed, start training immediately
      startTraining(module);
    }
  }, [module, userProgress, currentView, startTraining]);

  // Memoized access to the current exercise
  const currentExercise = useMemo(() => {
    if (!Array.isArray(exercises) || exercises.length === 0 || currentIndex < 0 || currentIndex >= exercises.length) {
      return null;
    }
    return exercises[currentIndex];
  }, [exercises, currentIndex]);

  // Generate a personalized tip for the current retry exercise
  const currentTip = useMemo(() => {
    if (currentView === VIEWS.FORCED_RETRY && currentExercise && mainSessionAnswers.length > 0) {
      // Better matching logic for finding the original answer
      const originalAnswer = mainSessionAnswers.find(ans => {
        if (!ans || !ans.exercise) return false;

        // Match by question and correct answer
        return ans.exercise.question === currentExercise.question &&
               ans.exercise.correct_answer === currentExercise.correct_answer &&
               !ans.isCorrect; // Only generate tips for incorrect answers
      });

      if (originalAnswer) {
        // Pass the user's incorrect answer to generateTip
        return generateTip(currentExercise, originalAnswer.answer);
      }
    }
    return null;
  }, [currentView, currentExercise, mainSessionAnswers]);


  // Handles a user's answer to an exercise question
  const handleAnswer = async (selectedAnswer, hasSpeedBonus = false) => {
    // Only process answers if in a training view
    if (currentView !== VIEWS.TRAINING && currentView !== VIEWS.FORCED_RETRY) return;

    // Add safety check for currentExercise
    if (!currentExercise) {
      console.error("No current exercise found when attempting to answer.");
      completeSession([]); // Pass an empty array to avoid being stuck
      return;
    }

    const isCorrect = selectedAnswer === currentExercise.correct_answer;

    // Create a detailed answer object
    const newAnswer = {
      questionIndex: currentIndex,
      exercise: currentExercise, // Full exercise object for later review/tip generation
      answer: selectedAnswer,
      isCorrect,
      hasSpeedBonus: hasSpeedBonus || false
    };

    // Eagerly update answers state
    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);
    setTotalAnswersGiven(prev => prev + 1);

    // Update consecutive correct counter and trigger motivation boost if applicable
    if (isCorrect) {
      const newConsecutiveCorrect = consecutiveCorrect + 1;
      setConsecutiveCorrect(newConsecutiveCorrect);
      if (newConsecutiveCorrect > 0 && newConsecutiveCorrect % 5 === 0) {
        // Add notification with a self-destruct timer
        const notificationId = Date.now();
        setNotifications(prev => [...prev, {
          id: notificationId,
          type: 'achievement',
          message: `${newConsecutiveCorrect} in a Row! 🔥`,
        }]);
        setTimeout(() => {
          removeNotification(notificationId);
        }, 3000); // Notification will auto-hide after 3 seconds

        setShowMotivation(true);
      }
    } else {
      setConsecutiveCorrect(0); // Reset on incorrect answer
    }

    // Move to the next question or complete the session after a short delay
    if (currentIndex < exercises.length - 1) {
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 1000); // FASTER TRANSITION
    } else {
      setTimeout(() => {
        // Pass the new, complete answers array directly to completeSession
        completeSession(newAnswers); // End of session, trigger completion logic
      }, 1000); // FASTER TRANSITION
    }
  };

  // Handler for when the level up celebration modal is closed/continued
  const handleLevelUpContinue = () => {
    try {
      setCurrentView(VIEWS.RESULTS); // Transition to session results
    } catch (error) {
      console.error("Error handling level up continue:", error);
      setCurrentView(VIEWS.RESULTS); // Fallback to results on error
    }
  };

  // Completes the current session, calculates XP, updates progress, and determines next steps
  const completeSession = async (finalAnswers) => {
    setIsSaving(true);
    try {
      // Safety checks for answers array
      const answersArray = Array.isArray(finalAnswers) ? finalAnswers : answers;
      const correctAnswersCount = answersArray.filter(a => a && a.isCorrect).length;
      const totalQuestions = answersArray.length;
      
      // This block will only run ONCE per full lesson, before any retry sessions.
      if (currentView !== VIEWS.FORCED_RETRY) {
        const accuracy = totalQuestions > 0 ? (correctAnswersCount / totalQuestions) * 100 : 0;
        
        // Calculate XP earned
        const speedBonusCount = answersArray.filter(a => a && a.hasSpeedBonus).length;
        const speedBonusXP = speedBonusCount;
        let baseXP = 0;
        let perfectBonus = 0;
        const numMistakesInCurrentSession = totalQuestions - correctAnswersCount;

        if (module === 'combined') {
            baseXP = numMistakesInCurrentSession === 0 ? 25 : (numMistakesInCurrentSession <= 5 ? 20 : 15);
            perfectBonus = numMistakesInCurrentSession === 0 ? 5 : 0;
        } else if (module === 'musical_geography') {
            // FIXED: Increased Musical Geography base XP to 25
            baseXP = numMistakesInCurrentSession === 0 ? 25 : (numMistakesInCurrentSession <= 3 ? 20 : 15);
            perfectBonus = numMistakesInCurrentSession === 0 ? 5 : 0;
        } else {
            baseXP = numMistakesInCurrentSession === 0 ? 20 : (numMistakesInCurrentSession <= 4 ? 15 : 10);
            perfectBonus = numMistakesInCurrentSession === 0 ? 5 : 0;
        }
        const xpEarned = baseXP + perfectBonus + speedBonusXP;
        
        // Store the final stats from the MAIN session to be displayed later.
        setLastSessionStats({ correct: correctAnswersCount, total: totalQuestions, xp: xpEarned });

        // --- Save Session, Update User Progress, AND UPDATE ARENA ---
        try {
            const user = await User.me();
            const sessionData = { module_type: module, total_questions: totalQuestions, correct_answers: correctAnswersCount, xp_earned: xpEarned };
            await Session.create(sessionData);

            if (userProgress && userProgress.id) {
                const today = new Date();
                const todayUTCStr = today.toISOString().split('T')[0]; // YYYY-MM-DD format in UTC
                let progressUpdate = {
                    total_xp: (userProgress.total_xp || 0) + xpEarned,
                    daily_xp: (userProgress.daily_xp || 0) + xpEarned, // Accumulate daily XP
                    last_practice_date: todayUTCStr,
                };

                // --- Daily Streak Logic based on 30XP Goal ---
                const previousDailyXP = userProgress.daily_xp || 0;
                const newDailyXP = progressUpdate.daily_xp;
                const dailyGoal = 30;

                // Check if the daily goal was just met in this session
                if (previousDailyXP < dailyGoal && newDailyXP >= dailyGoal) {
                    const lastStreakUpdate = userProgress.streak_last_updated_date;
                    if (lastStreakUpdate !== todayUTCStr) { // If streak not already updated for today
                       const yesterday = new Date(today);
                       yesterday.setDate(yesterday.getDate() - 1);
                       const yesterdayUTCStr = yesterday.toISOString().split('T')[0];

                       if (lastStreakUpdate === yesterdayUTCStr) {
                           progressUpdate.current_streak = (userProgress.current_streak || 0) + 1;
                       } else {
                           progressUpdate.current_streak = 1; // Reset or start new streak
                       }
                       progressUpdate.streak_last_updated_date = todayUTCStr; // Mark streak as updated for today
                    }
                }

                // Level up logic
                const levelUpCheck = shouldLevelUp(sessionLevel, accuracy, module);
                if (levelUpCheck.shouldLevelUp) {
                  progressUpdate[`${module}_level`] = levelUpCheck.newLevel;
                  setLevelUpInfo({ oldLevel: sessionLevel, newLevel: levelUpCheck.newLevel, module: module });
                }

                await UserProgress.update(userProgress.id, progressUpdate);
                const updatedProgress = { ...userProgress, ...progressUpdate };
                setUserProgress(updatedProgress);

                // Update Weekly Arena
                const weekIdentifier = `${getYear(new Date())}-W${getISOWeek(new Date())}`;
                const arenaEntries = await WeeklyArena.filter({ created_by: user.email, week_identifier: weekIdentifier });

                if (arenaEntries.length > 0) {
                  // Update existing arena entry
                  const arenaEntry = arenaEntries[0];
                  await WeeklyArena.update(arenaEntry.id, {
                    weekly_xp: (arenaEntry.weekly_xp || 0) + xpEarned,
                    user_full_name: user.full_name,
                    current_streak: updatedProgress.current_streak,
                    total_arena_wins: updatedProgress.total_arena_wins,
                  });
                } else {
                  // Create new arena entry
                  await WeeklyArena.create({
                    weekly_xp: xpEarned,
                    week_identifier: weekIdentifier,
                    user_full_name: user.full_name,
                    current_streak: updatedProgress.current_streak,
                    total_arena_wins: updatedProgress.total_arena_wins,
                  });
                }

                // Check and award basic badges after progress is updated
                // Pass the most up-to-date user progress information
                await checkAndAwardBasicBadges(user, updatedProgress, sessionData);
            }
        } catch (error) {
            console.error("Error saving session or updating progress:", error.response ? error.response.data : error.message);
        }

        // Identify incorrect exercises for potential retry
        const mistakes = answersArray.filter(a => a && !a.isCorrect);
        // Store only exercise objects for retry. The mainSessionAnswers will be used for tips.
        const newMistakeExercises = mistakes.map(m => m.exercise).filter(ex => ex);
        setMistakeExercises(newMistakeExercises); // Store mistakes for retry session
        setMainSessionAnswers(answersArray); // Save the original answers for tip generation

        // If there are mistakes AND this was the primary training session, show the mandatory transition screen.
        if (newMistakeExercises.length > 0) {
          setCurrentView(VIEWS.MISTAKE_TRANSITION);
          return;
        }
      }

      // If no mistakes or after a retry session, proceed to the final results screen.
      setCurrentView(VIEWS.RESULTS);

    } catch (error) {
      console.error("Error completing session:", error);
      setCurrentView(VIEWS.RESULTS); // Fallback to results view even on unexpected errors
    } finally {
      // Fix: Ensure isSaving is set to false after all operations (success or failure)
      setIsSaving(false); 
    }
  };

  // Initiates a new training session specifically for previously incorrect exercises
  const startMistakeRetry = () => {
    // Shuffle mistake exercises (which are now exercise objects)
    const shuffledMistakes = [...mistakeExercises].sort(() => Math.random() - 0.5);

    // Set the exercises state to these shuffled exercise objects.
    setExercises(shuffledMistakes);

    setCurrentIndex(0);
    setAnswers([]); // Reset answers for the retry session
    setTotalAnswersGiven(0);
    setConsecutiveCorrect(0); // Reset consecutive correct for the retry session
    setShowMotivation(false); // Hide motivation modal
    setCurrentView(VIEWS.FORCED_RETRY); // Set view to the specific FORCED_RETRY training mode
  };

  // Handler for "Next Level" button in SessionResults
  const handleNextLevel = () => {
    // Resets state and re-triggers the initial load effect to potentially start a new session at the updated level
    setCurrentView(VIEWS.LOADING);
    setModule(module); // Re-setting module ensures useEffect dependencies are met
    setAnswers([]);
    setMainSessionAnswers([]);
    setMistakeExercises([]);
  };

  // Handler for "Try Again" button in SessionResults
  const handleTryAgain = () => {
    // Reset all state and restart the current session
    setCurrentView(VIEWS.LOADING);
    setExercises([]);
    setCurrentIndex(0);
    setAnswers([]);
    setMainSessionAnswers([]);
    setMistakeExercises([]);
    setTotalAnswersGiven(0);
    setConsecutiveCorrect(0);
    setShowMotivation(false);

    // Restart training with current module and session level
    setTimeout(() => {
      startTraining(module);
    }, 100);
  };


  // Provides display information (title, color) for the current module
  const getModuleInfo = () => {
    const moduleMap = {
      ear_training: { title: "Ear Training", color: "from-blue-500 to-cyan-400" },
      rhythm_training: { title: "Rhythm Training", color: "from-green-500 to-emerald-400" },
      sight_reading: { title: "Sight Reading", color: "from-purple-500 to-pink-400" },
      musical_geography: { title: "Musical Geography", color: "from-amber-500 to-yellow-400" },
      combined: { title: "Combined Practice", color: "from-orange-500 to-red-400" }
    };
    return moduleMap[module] || { title: "Training", color: "from-gray-500 to-gray-400" };
  };

  // Centralized rendering function based on currentView
  const renderContent = () => {
    switch (currentView) {
      case VIEWS.LOADING:
        return (
          <div className="min-h-[50vh] flex items-center justify-center">
            <div className="text-center text-gray-800 flex flex-col items-center">
              <Loader2 className="h-10 w-10 animate-spin text-gray-600 mb-4" />
              <p>Loading session...</p>
            </div>
          </div>
        );
      case VIEWS.INTRODUCTION:
        // The actual introduction component is rendered as an overlay, this is a placeholder for the main content area
        return (
          <div className="min-h-[50vh] flex items-center justify-center">
            <p className="text-gray-600">Loading introduction...</p>
          </div>
        );
      case VIEWS.RESULTS:
        return (
          <SessionResults
            module={module}
            score={{ correct: lastSessionStats.correct, total: lastSessionStats.total }}
            xpEarned={lastSessionStats.xp}
            level={sessionLevel} // Pass the actual session level
            onTryAgain={handleTryAgain} // Use the corrected handler
            onHome={() => navigate(createPageUrl("Home"))}
            onArena={() => navigate(createPageUrl("Arena"))}
            onNextLevel={handleNextLevel}
            isMaxLevel={sessionLevel >= (module === 'sight_reading' || module === 'musical_geography' ? 30 : 20)}
            speedBonusXP={Array.isArray(answers) ? answers.filter(a => a && a.hasSpeedBonus).length : 0}
            isSaving={isSaving} // Pass saving state to results page
          />
        );
      case VIEWS.MISTAKE_TRANSITION:
        return (
            <MistakeIntro
                onContinue={startMistakeRetry}
                mistakesCount={mistakeExercises.length}
            />
        );
      default:
        // TRAINING and FORCED_RETRY views are rendered outside this function in the main return
        return (
          <div className="min-h-[50vh] flex items-center justify-center">
            <p className="text-gray-600">Unknown view state or content rendered directly.</p>
          </div>
        );
    }
  };

  // Pre-calculate moduleInfo and progressPercentage for use in main JSX
  const moduleInfo = getModuleInfo();
  const progressPercentage = exercises.length > 0 ? (currentIndex / exercises.length) * 100 : 0;

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-sky-100 via-rose-100 to-amber-100">
      {/* Global Notification Stack */}
      <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 space-y-2">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: -20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.8 }}
              className={`px-6 py-3 rounded-full shadow-lg font-bold flex items-center gap-2 relative ${
                notification.type === 'achievement'
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
                  : 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
              }`}
            >
              <span className="text-2xl">🔥</span>
              <span>{notification.message}</span>
              <button
                onClick={() => removeNotification(notification.id)}
                className="ml-2 text-white hover:text-gray-200 text-xl font-bold leading-none w-6 h-6 flex items-center justify-center"
                aria-label="Close notification"
              >
                &times;
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Modal Overlays (rendered on top of main content) */}
      <AnimatePresence>
        {showMotivation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-md w-full"
            >
              {/* Close button for motivation modal */}
              <button
                onClick={() => setShowMotivation(false)}
                className="absolute top-2 right-2 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 shadow-lg text-xl font-bold leading-none"
                aria-label="Close"
              >
                &times;
              </button>
              <MotivationBoost
                module={module}
                onContinue={() => setShowMotivation(false)}
              />
            </motion.div>
          </motion.div>
        )}

        {/* Introduction Modal with Mini Lesson Option */}
        {showIntroduction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl"
            >
              <div className="mb-6">
                {currentIntroType === 'jimi' && <JimiIntroduction level={introLevel} />}
                {currentIntroType === 'duke' && <DukeIntroduction level={introLevel} />}
                {currentIntroType === 'bach' && <BachIntroduction level={introLevel} />}
                {currentIntroType === 'freddie' && <FreddieIntroduction />}
              </div>

              <div className="space-y-4">
                <Button
                  onClick={handleStartMiniLesson}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-full shadow-lg hover:scale-105 transition-transform"
                >
                  📘 Learn First
                </Button>

                <Button
                  onClick={() => {
                    setShowIntroduction(false);
                    startTraining(module);
                  }}
                  variant="outline"
                  className="w-full clay-button font-bold py-3 rounded-full"
                >
                  ✅ Continue to Level {introLevel}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Mini Lesson Modal */}
        {showMiniLesson && miniLessonInfo && (
          <MiniLesson
            moduleType={miniLessonInfo.moduleType}
            levelGroup={miniLessonInfo.levelGroup}
            onContinue={handleContinueFromMiniLesson}
            onClose={handleSkipMiniLesson}
            isStandalone={false}
          />
        )}
      </AnimatePresence>

      {/* Main content area, renders different views based on currentView state */}
      <div className="container mx-auto px-4 py-8 max-w-2xl relative">
        <AnimatePresence mode="wait">
          {/* AnimatePresence for smooth transitions between different views */}
          <motion.div
            key={currentView} // Key change triggers exit/enter animations
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Render views handled by renderContent */}
            {(currentView === VIEWS.LOADING ||
             currentView === VIEWS.INTRODUCTION ||
             currentView === VIEWS.RESULTS ||
             currentView === VIEWS.MISTAKE_TRANSITION) && renderContent()}

            {/* Exercise Question Component (for TRAINING and FORCED_RETRY views) */}
            {(currentView === VIEWS.TRAINING || currentView === VIEWS.FORCED_RETRY) && (
              <div className="min-h-[50vh] flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <Link to={createPageUrl("Home")}>
                    <Button variant="ghost" size="icon" className="text-gray-700 hover:bg-black/5 rounded-full">
                      <ArrowLeft className="w-5 h-5" />
                    </Button>
                  </Link>
                  <div className="text-center">
                    <h1 className="text-base sm:text-lg font-bold text-gray-800">{moduleInfo.title}</h1>
                    <p className="text-gray-600 text-xs sm:text-sm">
                      {currentView === VIEWS.FORCED_RETRY ? 'Retry Wrong Answers' : 'Training Session'}
                    </p>
                  </div>
                  <div className="w-10"></div> {/* Spacer for alignment */}
                </div>
                <div className="mb-4">
                  <Progress value={progressPercentage} className="h-2 bg-white/20" />
                </div>
                {/* The tip is now handled exclusively within ExerciseQuestion. */}
                {currentExercise && (
                  <AnimatePresence mode="wait">
                    <motion.div key={currentIndex} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }}>
                      <ExerciseQuestion
                        exercise={currentExercise}
                        onAnswer={handleAnswer}
                        moduleColor={moduleInfo.color}
                        consecutiveCorrect={currentView === VIEWS.FORCED_RETRY ? 0 : consecutiveCorrect}
                        tip={currentTip}
                        isRetrySession={currentView === VIEWS.FORCED_RETRY}
                      />
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}