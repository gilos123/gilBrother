import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { UserProgress } from '@/api/entities';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lock, BookOpen, Play } from 'lucide-react';
import { MINI_LESSON_CONTENT } from '../components/training/miniLessonContent';
import MiniLesson from '../components/training/MiniLesson';

const MODULE_INFO = {
  ear_training: {
    name: 'Ear Training',
    color: 'from-blue-500 to-cyan-400',
    icon: '👂'
  },
  rhythm_training: {
    name: 'Rhythm Training', 
    color: 'from-green-500 to-emerald-400',
    icon: '🥁'
  },
  sight_reading: {
    name: 'Sight Reading',
    color: 'from-purple-500 to-pink-400',
    icon: '🎼'
  },
  musical_geography: {
    name: 'Musical Geography',
    color: 'from-orange-500 to-red-400', 
    icon: '🎯'
  }
};

export default function MiniLessons() {
  const [userProgress, setUserProgress] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserProgress();
  }, []);

  const loadUserProgress = async () => {
    try {
      const user = await User.me();
      const progressList = await UserProgress.filter({ created_by: user.email });
      
      if (progressList.length > 0) {
        setUserProgress(progressList[0]);
      } else {
        // Default progress for new users
        setUserProgress({
          ear_training_level: 1,
          rhythm_training_level: 1,
          sight_reading_level: 1,
          musical_geography_level: 1
        });
      }
    } catch (error) {
      console.error("Error loading user progress:", error);
      setUserProgress({
        ear_training_level: 1,
        rhythm_training_level: 1,
        sight_reading_level: 1,
        musical_geography_level: 1
      });
    }
    setIsLoading(false);
  };

  const getLevelGroups = (moduleType, currentLevel) => {
    const maxLevel = moduleType === 'sight_reading' || moduleType === 'musical_geography' ? 30 : 20;
    const groups = [];
    
    // Standard level groups
    const groupStarts = [1, 6, 11, 16];
    if (maxLevel === 30) {
      groupStarts.push(21, 26);
    }
    
    for (const start of groupStarts) {
      const end = Math.min(start + 4, maxLevel);
      const groupKey = `${start}-${end}`;
      const isUnlocked = currentLevel >= start;
      
      // Check if content exists
      const hasContent = MINI_LESSON_CONTENT[moduleType]?.[groupKey];
      
      if (hasContent) {
        groups.push({
          key: groupKey,
          start,
          end,
          isUnlocked,
          title: MINI_LESSON_CONTENT[moduleType][groupKey].title
        });
      }
    }
    
    return groups;
  };

  const openLesson = (moduleType, levelGroup) => {
    setSelectedLesson({ moduleType, levelGroup });
  };

  const closeLesson = () => {
    setSelectedLesson(null);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
          <BookOpen className="w-8 h-8 text-purple-600" />
          Mini Lessons
        </h1>
        <p className="text-gray-600">
          Learn the theory behind each level group with guided lessons from musical mentors
        </p>
      </div>

      {/* Module Grid */}
      <div className="space-y-8">
        {Object.entries(MODULE_INFO).map(([moduleType, moduleData]) => {
          const currentLevel = userProgress?.[`${moduleType}_level`] || 1;
          const levelGroups = getLevelGroups(moduleType, currentLevel);
          
          if (levelGroups.length === 0) return null;

          return (
            <div key={moduleType} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${moduleData.color} flex items-center justify-center text-white text-2xl`}>
                  {moduleData.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{moduleData.name}</h2>
                  <p className="text-sm text-gray-600">Current Level: {currentLevel}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {levelGroups.map((group) => (
                  <Card key={group.key} className={`clay-card transition-all duration-300 ${
                    group.isUnlocked 
                      ? 'hover:scale-105 cursor-pointer' 
                      : 'opacity-60 cursor-not-allowed'
                  }`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-gray-800 mb-1">
                            Levels {group.start}-{group.end}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {group.title}
                          </p>
                        </div>
                        {group.isUnlocked ? (
                          <Badge className="bg-green-100 text-green-800">
                            Unlocked
                          </Badge>
                        ) : (
                          <Lock className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      
                      <Button
                        onClick={() => openLesson(moduleType, group.key)}
                        disabled={!group.isUnlocked}
                        className={`w-full ${
                          group.isUnlocked
                            ? 'bg-gradient-to-r ' + moduleData.color + ' text-white hover:opacity-90'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        {group.isUnlocked ? 'Start Lesson' : 'Locked'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mini Lesson Modal */}
      {selectedLesson && (
        <MiniLesson
          moduleType={selectedLesson.moduleType}
          levelGroup={selectedLesson.levelGroup}
          onClose={closeLesson}
          isStandalone={true}
        />
      )}
    </div>
  );
}