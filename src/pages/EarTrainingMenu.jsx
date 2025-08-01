
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Headphones, Music, Target, Award, Lock, KeyRound, Play } from 'lucide-react';
import { User } from '@/api/entities';
import { UserProgress } from '@/api/entities';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card'; // Added Card and CardContent import

export default function EarTrainingMenu() {
  const [userProgress, setUserProgress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLockModal, setShowLockModal] = useState(false);
  const [isLocked, setIsLocked] = useState(true);
  const [inputCode, setInputCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadUserProgress();
    const unlocked = sessionStorage.getItem('ear_training_in_action_unlocked');
    if (unlocked === 'true') {
      setIsLocked(false);
    }
  }, []);

  const loadUserProgress = async () => {
    try {
      const user = await User.me();
      let progressList = await UserProgress.filter({ created_by: user.email });
      let progress;

      if (progressList.length > 0) {
        progress = progressList[0];
      } else {
        progress = await UserProgress.create({
          total_xp: 0,
          ear_training_level: 1,
          rhythm_training_level: 1,
          sight_reading_level: 1
        });
      }
      
      setUserProgress(progress);
    } catch (error) {
      console.error("Error loading user progress:", error);
      setUserProgress({
        ear_training_level: 1
      });
    }
    setIsLoading(false);
  };

  const handleUnlockAttempt = () => {
    if (inputCode === '8461') {
      setIsLocked(false);
      sessionStorage.setItem('ear_training_in_action_unlocked', 'true');
      setShowLockModal(false);
      navigate(createPageUrl('EarTrainingInAction'));
    } else {
      setErrorMessage('Incorrect code. Please try again.');
      setInputCode('');
    }
  };
  
  const handleModuleClick = () => {
    if (isLocked) {
      setShowLockModal(true);
    } else {
      navigate(createPageUrl('EarTrainingInAction'));
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-200 rounded-2xl"></div>
          <div className="grid gap-4">
            {[1, 2].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link to={createPageUrl("Home")}>
          <Button variant="ghost" size="icon" className="clay-button">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Ear Training</h1>
          <p className="text-gray-600">Choose your practice mode.</p>
        </div>
      </div>

      <div className="space-y-4">
        <Link to={createPageUrl("Training?module=ear_training")} className="block group">
          <Card className="clay-card hover:scale-[1.02] transition-all duration-300">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-400 to-indigo-500 text-white">
                <Headphones className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800">Interval & Chord Identification</h3>
                <p className="text-gray-600 text-sm mb-2">The classic ear training mode. Identify intervals and chords by ear.</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <p className="flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    Level {userProgress?.ear_training_level || 1}
                  </p>
                  <p className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    7 exercises
                  </p>
                </div>
              </div>
              <Play className="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors" />
            </CardContent>
          </Card>
        </Link>

        {/* FIXED: Added developer lock functionality */}
        <div onClick={handleModuleClick} className="block group cursor-pointer">
          <div className="clay-card p-6 transition-all duration-300 hover:scale-[1.02] bg-white/50 border-l-4 border-purple-500">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg flex items-center justify-center bg-gradient-to-br from-purple-400 to-pink-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Music className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800">Ear Training: In Action!</h3>
                <p className="text-gray-600 text-sm">A new challenge! Listen to melodic phrases and identify the notes.</p>
              </div>
              {isLocked && (
                <div className="flex items-center gap-2 text-sm bg-gray-200 text-gray-600 px-3 py-1 rounded-full">
                  <Lock className="w-3 h-3" />
                  <span>Developer Lock</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Developer Lock Modal */}
      <Dialog open={showLockModal} onOpenChange={setShowLockModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Developer Access</DialogTitle>
            <DialogDescription>
              This module is currently locked. Please enter the developer access code.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="password"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="Enter secret code"
                className="pl-10 text-center text-lg tracking-widest"
              />
            </div>
            {errorMessage && (
              <p className="text-red-500 text-sm text-center">{errorMessage}</p>
            )}
            <Button onClick={handleUnlockAttempt} className="w-full">
              Unlock
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
