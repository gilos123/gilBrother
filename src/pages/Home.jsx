
import React, { useState, useEffect } from "react";
import { UserProgress } from "@/api/entities";
import { User } from "@/api/entities";
import { Session } from "@/api/entities";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Headphones,
  Music2, // Used for Rhythm Training
  FileMusic,
  Shuffle,
  Trophy,
  Flame,
  Star,
  Play,
  Target,
  Award,
  Sunrise,
  Clock,
  AlertTriangle,
  BookOpen,
  Settings as SettingsIcon,
  Info, // Added Info icon
  Music // Added Music icon for Drumline
} from "lucide-react";
import BachWelcome from "../components/shared/BachWelcome";
import JimiWelcome from "../components/shared/JimiWelcome";
import DukeWelcome from "../components/shared/DukeWelcome";
import FreddieWelcome from "../components/shared/FreddieWelcome";
import ArethaWelcome from "../components/shared/FreddieWelcome";

const welcomeComponents = [BachWelcome, JimiWelcome, DukeWelcome, FreddieWelcome, ArethaWelcome];

export default function Home() {
  const [userProgress, setUserProgress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const [WelcomeComponent, setWelcomeComponent] = useState(null);
  const [timeWarning, setTimeWarning] = useState(null);

  useEffect(() => {
    const RandomWelcome = welcomeComponents[Math.floor(Math.random() * welcomeComponents.length)];
    setWelcomeComponent(() => RandomWelcome);
    
    loadUserProgress();
  }, [location]);

  const loadUserProgress = async () => {
    try {
      const user = await User.me();
      let progressList = await UserProgress.filter({ created_by: user.email });
      let progress;

      if (progressList.length > 0) {
        progress = progressList[0];
      } else {
        // If no progress exists, create it.
        progress = await UserProgress.create({
          total_xp: 0,
          daily_xp: 0, // Initialize daily XP for new users
          current_streak: 0,
          ear_training_level: 1,
          rhythm_training_level: 1,
          sight_reading_level: 1
        });
      }
      
      const today = new Date();
      // Get current date in YYYY-MM-DD format (UTC) for consistent comparison with last_practice_date
      const todayUTCStr = today.toISOString().split('T')[0];
      let needsUpdate = false;
      
      // --- Streak Reset Logic ---
      if (progress.last_practice_date) {
        // Ensure both dates are treated as UTC for consistent comparison
        const lastPracticeDateUTC = new Date(progress.last_practice_date + 'T00:00:00.000Z');
        const todayDateUTC = new Date(todayUTCStr + 'T00:00:00.000Z');

        const diffTime = todayDateUTC.getTime() - lastPracticeDateUTC.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        // If more than 1 full day has passed since last practice (e.g., practiced Monday, current is Wednesday or later)
        if (diffDays > 1) {
          progress.current_streak = 0;
          needsUpdate = true;
        }
      }

      // --- Daily XP Reset Logic ---
      // If the last practice was on a different day, reset daily_xp
      if (progress.last_practice_date !== todayUTCStr) {
        progress.daily_xp = 0;
        needsUpdate = true;
      }
      
      // Update progress record if any reset was needed
      if (needsUpdate) {
        await UserProgress.update(progress.id, { 
          current_streak: progress.current_streak,
          daily_xp: progress.daily_xp
          // last_practice_date is updated when XP is earned, not on load
        });
      }
      
      setUserProgress(progress);
      
      // Set time warning ONLY if daily goal is not met
      const dailyXPValue = progress.daily_xp || 0; // Use the value from the updated progress object
      if (dailyXPValue < 30) {
        const hour = today.getHours(); // Use local hour for time-of-day warnings
        
        if (hour < 12) {
          setTimeWarning({
            message: "Great time for your daily lesson! 🌅",
            icon: Sunrise,
            color: "text-green-600",
            bgColor: "bg-green-50"
          });
        } else if (hour >= 16 && hour < 20) {
          setTimeWarning({
            message: "It's already getting late, do your lesson now! ⏰",
            icon: Clock,
            color: "text-orange-600",
            bgColor: "bg-orange-50"
          });
        } else if (hour >= 20) {
          setTimeWarning({
            message: "IT'S TOO LATE - DO YOUR LESSON NOW! 🚨",
            icon: AlertTriangle,
            color: "text-red-600",
            bgColor: "bg-red-50"
          });
        } else {
          setTimeWarning(null); // No warning needed for other hours
        }
      } else {
        setTimeWarning(null); // Daily goal already met, no warning
      }

    } catch (error) {
      console.error("Error loading user progress:", error);
      // Fallback in case of error
      setUserProgress({
        total_xp: 0,
        daily_xp: 0,
        current_streak: 0,
        ear_training_level: 1,
        rhythm_training_level: 1,
        sight_reading_level: 1
      });
      setTimeWarning(null); // Clear warning on error
    }
    setIsLoading(false);
  };

  const modules = [
    {
      id: "combined",
      title: "Combined Practice",
      subtitle: "Mix of all modules",
      icon: Shuffle,
      color: "orange-500",
      level: Math.min(userProgress?.ear_training_level || 1, userProgress?.rhythm_training_level || 1, userProgress?.sight_reading_level || 1),
      exercises: 10,
      special: true
    },
    {
      id: "ear_training",
      isMenu: true, // FIXED: Changed to a menu
      title: "Ear Training",
      subtitle: "Identify intervals, chords & melodies", // FIXED: Updated subtitle
      icon: Headphones,
      color: "blue-500",
      level: null, // Menus don't have levels
      exercises: null // Menus don't have exercises
    },
    {
      id: "rhythm_training",
      isMenu: true,
      title: "Rhythm Training",
      subtitle: "Feel the beat patterns",
      icon: Music2,
      color: "green-500",
      level: null,
      exercises: null
    },
    {
      id: "sight_reading",
      isMenu: true,
      title: "Sight Reading",
      subtitle: "Read notation & intervals",
      icon: FileMusic,
      color: "purple-500",
      level: null,
      exercises: null
    }
  ];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-200 rounded-2xl"></div>
          <div className="grid gap-4">
            {[1, 2, 3, 4, 5].map(i => ( // Added one more for the new module
              <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Time-based Warning - Only shows if daily goal NOT met */}
      {timeWarning && (
        <div className={`${timeWarning.bgColor} border-l-4 border-${timeWarning.color.split('-')[1]}-500 p-4 rounded-r-lg`}>
          <div className="flex items-center">
            <timeWarning.icon className={`w-6 h-6 ${timeWarning.color} mr-3`} />
            <p className={`font-semibold ${timeWarning.color}`}>
              {timeWarning.message}
            </p>
          </div>
        </div>
      )}

      {/* Randomized Welcome Mascot */}
      {WelcomeComponent && <WelcomeComponent />}

      {/* Welcome & Stats Section */}
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Ready to Practice?
          </h1>
          <p className="text-gray-600 text-lg">
            Build your musical skills with just a few minutes daily
          </p>
        </div>

        {/* XP and Streak Display */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-2xl mx-auto">
          <div className="clay-card p-4 text-center bg-white/60">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-teal-500" />
              <span className="font-semibold text-gray-800">Total XP</span>
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {userProgress?.total_xp || 0}
            </div>
          </div>

          <div className="clay-card p-4 text-center bg-white/60">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-amber-500" />
              <span className="font-semibold text-gray-800">Streak</span>
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {userProgress?.current_streak || 0}
            </div>
          </div>
          
          <div className="clay-card p-4 text-center bg-white/60">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sunrise className="w-5 h-5 text-rose-500" />
              <span className="font-semibold text-gray-800">Daily XP</span>
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {userProgress?.daily_xp || 0}
            </div>
          </div>

          <div className="clay-card p-4 text-center bg-white/60">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Target className="w-5 h-5 text-green-500" />
              <span className="font-semibold text-gray-800">Daily Goal</span>
            </div>
            <div className="text-lg font-bold text-gray-800">
              {Math.min(userProgress?.daily_xp || 0, 30)}/30 XP
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${Math.min(((userProgress?.daily_xp || 0) / 30) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Training Modules */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800 text-center mb-6">
          Choose Your Training
        </h2>
        
        <div className="grid gap-4">
          {modules.map((module) => {
            const IconComponent = module.icon;
            const moduleColorClass = `border-${module.color}`;
            // Extract the base color name (e.g., 'blue' from 'blue-500')
            const baseColor = module.color.split('-')[0];
            const iconBgGradient = `from-${baseColor}-400 to-${baseColor}-600`;
            const shadowColor = `shadow-${baseColor}-500/30`;
            
            // Determine the correct link based on the module type
            let linkPath;
            if (module.isMenu) {
              if (module.id === 'sight_reading') {
                linkPath = 'SightReadingMenu';
              } else if (module.id === 'rhythm_training') {
                linkPath = 'RhythmTrainingMenu';
              } else if (module.id === 'ear_training') { // FIXED: Added Ear Training Menu link
                linkPath = 'EarTrainingMenu';
              } else if (module.id === 'drumline_training') { // Added Drumline
                linkPath = 'DrumlineMenu';
              }
            } else {
              linkPath = `Training?module=${module.id}`;
            }
            const linkUrl = createPageUrl(linkPath);

            return (
              <Link 
                key={module.id}
                to={linkUrl}
                className="block group"
              >
                <div className={`clay-card hover:scale-[1.03] transition-all duration-300 bg-white/50 border-l-4 ${moduleColorClass} ${module.special ? 'ring-2 ring-yellow-400/80' : ''}`}>
                  <div className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 bg-gradient-to-br ${iconBgGradient} shadow-lg ${shadowColor}`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-gray-800">
                            {module.title}
                          </h3>
                          {module.special && (
                            <div className="clay-button px-2 py-1 bg-gradient-to-r from-yellow-100 to-orange-100 flex items-center">
                              <Star className="w-3 h-3 mr-1 text-yellow-700" />
                              <span className="text-xs text-yellow-700 font-bold">Special</span>
                            </div>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-2">
                          {module.subtitle}
                        </p>
                        
                        {/* Only show level/exercises for non-menu modules */}
                        {module.level !== null && module.exercises !== null && (
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1 text-gray-500">
                              <Target className="w-4 h-4" />
                              Level {module.level}
                            </div>
                            <div className="flex items-center gap-1 text-gray-500">
                              <Award className="w-4 h-4" />
                              {module.exercises} exercises
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="w-12 h-12 flex items-center justify-center">
                        <Play className="w-5 h-5 text-gray-700 ml-0.5" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Links to Mini Lessons, Settings, and About */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto py-4">
        <Link to={createPageUrl("MiniLessons")} className="inline-block">
          <div className="clay-card p-4 bg-white/50 hover:bg-white/70 transition-all duration-300 rounded-xl h-full">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white">
                <BookOpen className="w-6 h-6"/>
              </div>
              <div className="text-left">
                <h3 className="font-bold text-gray-800">Mini Lessons</h3>
                <p className="text-sm text-gray-600">Revisit unlocked lessons</p>
              </div>
            </div>
          </div>
        </Link>
        <Link to={createPageUrl("Settings")} className="inline-block">
          <div className="clay-card p-4 bg-white/50 hover:bg-white/70 transition-all duration-300 rounded-xl h-full">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white">
                <SettingsIcon className="w-6 h-6"/>
              </div>
              <div className="text-left">
                <h3 className="font-bold text-gray-800">Settings</h3>
                <p className="text-sm text-gray-600">Language & more</p>
              </div>
            </div>
          </div>
        </Link>
        <Link to={createPageUrl("About")} className="inline-block">
          <div className="clay-card p-4 bg-white/50 hover:bg-white/70 transition-all duration-300 rounded-xl h-full">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center text-white">
                <Info className="w-6 h-6"/>
              </div>
              <div className="text-left">
                <h3 className="font-bold text-gray-800">About</h3>
                <p className="text-sm text-gray-600">Learn about the app</p>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Motivational Footer */}
      <div className="text-center py-8">
        <p className="text-gray-500 text-sm">
          💡 Just 5-10 minutes of daily practice can significantly improve your musical skills!
        </p>
      </div>
    </div>
  );
}
