import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { User } from '@/api/entities';
import { UserProgress } from '@/api/entities';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Lock, Map, Music, Loader2, Target, Award } from 'lucide-react';

export default function SightReadingMenu() {
  const [userProgress, setUserProgress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const user = await User.me();
        const progress = await UserProgress.filter({ created_by: user.email });
        setUserProgress(progress[0]);
      } catch (error) {
        console.error("Failed to load user progress", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProgress();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
      </div>
    );
  }

  const sightReadingLevel = userProgress?.sight_reading_level || 1;
  const musicalGeographyLevel = userProgress?.musical_geography_level || 1;
  const geographyUnlocked = sightReadingLevel >= 6;

  const ModuleCard = ({ to, title, description, icon: Icon, level, exercises, unlocked, isNew }) => (
    <Link to={unlocked ? to : '#'} className={`block group ${!unlocked ? 'cursor-not-allowed' : ''}`}>
      <Card className={`clay-card h-full transition-all duration-300 relative ${unlocked ? 'hover:scale-105 hover:shadow-xl' : 'opacity-60 bg-gray-100'}`}>
        {isNew && (
          <div className="absolute -top-2 -right-2 transform rotate-12 z-10">
            <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              NEW
            </div>
          </div>
        )}
        <CardContent className="p-6 text-center space-y-4">
          <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white transition-transform duration-300 ${unlocked ? 'group-hover:scale-110' : ''}`}>
            {unlocked ? <Icon className="w-10 h-10" /> : <Lock className="w-10 h-10" />}
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
            <p className="text-gray-600 text-sm">{description}</p>
          </div>
          
          {/* FIXED: Show level and exercise info for each module */}
          {unlocked && (
            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-gray-500">
                <Target className="w-4 h-4" />
                Level {level}
              </div>
              <div className="flex items-center gap-1 text-gray-500">
                <Award className="w-4 h-4" />
                {exercises} exercises
              </div>
            </div>
          )}
          
          {!unlocked && (
            <p className="text-xs font-semibold text-purple-700">
              Reach Level 6 in Note Guesser to unlock
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800">Sight Reading</h1>
        <p className="text-lg text-gray-600 mt-2">Choose your training method to master musical notation.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <ModuleCard 
          to={createPageUrl("Training?module=sight_reading")}
          title="Note Guesser"
          description="Quickly identify individual notes on the staff to build your reading speed."
          icon={Music}
          level={sightReadingLevel}
          exercises={7}
          unlocked={true}
        />
        <ModuleCard 
          to={createPageUrl("Training?module=musical_geography")}
          title="Musical Geography"
          description="Master interval relationships on the staff. Identify and build intervals between notes visually."
          icon={Map}
          level={musicalGeographyLevel}
          exercises={7}
          unlocked={geographyUnlocked}
          isNew={true}
        />
      </div>
    </div>
  );
}