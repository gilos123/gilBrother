
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { UserProgress } from "@/api/entities";
import { User } from "@/api/entities";
import { ArrowLeft, Play, Star, Trophy, Headphones, Lock } from "lucide-react"; // Added Lock import
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function EarTrainingInAction() {
  const [userProgress, setUserProgress] = useState(null);
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
        setUserProgress({
          ear_training_level: 1,
          ear_training_in_action_level: 1
        });
      }
    } catch (error) {
      console.error("Error loading user progress:", error);
      setUserProgress({
        ear_training_level: 1,
        ear_training_in_action_level: 1
      });
    }
    setIsLoading(false);
  };

  const levels = [
    {
      id: 1,
      title: "Note Identification",
      description: "Hear two notes and identify the second one.",
      xp: 2, // **Design Change**: Fixed XP display to show 2 XP
      icon: "🎵",
      unlocked: true
    },
    {
      id: 2,
      title: "Simple Phrases",
      description: "Guess the last note of a three-note phrase.",
      xp: 3, // **Design Change**: Fixed XP display to show 3 XP
      icon: "🎶",
      unlocked: userProgress?.ear_training_level >= 1
    },
    {
      id: 3,
      title: "Intermediate Phrases",
      description: "Guess the last note of a four-note phrase.",
      xp: 5, // **Design Change**: Fixed XP display to show 5 XP
      icon: "🎼",
      unlocked: userProgress?.ear_training_level >= 2
    },
    {
      id: 4,
      title: "The Remix",
      description: "A mix of simple and intermediate phrases.",
      xp: 6, // **Design Change**: Fixed XP display to show 6 XP
      icon: "🎭",
      unlocked: userProgress?.ear_training_level >= 3
    }
  ];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-200 rounded-2xl"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4 sm:p-8">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to={createPageUrl("EarTrainingMenu")}>
            <Button variant="ghost" size="icon" className="clay-button">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Ear Training: In Action!
            </h1>
            <p className="text-gray-600">
              Listen to melodic phrases and identify the final note
            </p>
          </div>
        </div>

        {/* Level Cards */}
        <div className="space-y-4">
          {levels.map((level) => (
            <Card
              key={level.id}
              className={`clay-card transition-all duration-300 ${
                level.unlocked
                  ? 'hover:scale-[1.02] cursor-pointer'
                  : 'opacity-50 cursor-not-allowed'
              } ${level.unlocked ? 'bg-white/70' : 'bg-gray-100/50'}`}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl ${
                    level.unlocked
                      ? 'bg-gradient-to-br from-purple-400 to-pink-500 text-white'
                      : 'bg-gray-300 text-gray-500'
                  }`}>
                    <Headphones className="w-8 h-8" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold text-gray-800">
                        Level {level.id}: {level.title}
                      </h3>
                      {!level.unlocked && <Lock className="w-4 h-4 text-gray-400" />}
                      {level.id === 4 && (
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                          <Star className="w-3 h-3 mr-1" />
                          Challenge
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      {level.description}
                    </p>
                    {level.unlocked && ( // Conditionally render XP for unlocked levels
                      <div className="flex items-center gap-1 text-sm text-yellow-600 font-semibold">
                        <Star className="w-4 h-4" />
                        {level.xp} XP on each correct question
                      </div>
                    )}
                  </div>

                  {level.unlocked ? (
                    <Link to={createPageUrl(`EarTrainingInActionLevel?level=${level.id}`)}>
                      <Button size="lg" className="bg-purple-500 hover:bg-purple-600 text-white">
                        <Play className="w-5 h-5 mr-2" />
                        Start
                      </Button>
                    </Link>
                  ) : (
                    <div className="w-12 h-12 flex items-center justify-center">
                      <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Instructions */}
        <Card className="clay-card mt-8 bg-blue-50/70">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-blue-800 mb-3">How to Play</h3>
            <ul className="space-y-2 text-blue-700">
              <li className="flex items-start gap-2">
                <span className="font-bold">1.</span>
                <span>Listen to the melodic phrase by clicking "Play Phrase"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">2.</span>
                <span>Identify the final note of the phrase</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">3.</span>
                <span>Choose from the four note options</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">4.</span>
                <span>Complete all questions to earn XP!</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
