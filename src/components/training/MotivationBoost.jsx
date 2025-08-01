import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Target, Flame } from 'lucide-react';

const motivationalMessages = [
  {
    title: "Keep Going! 🎵",
    message: "Every great musician started exactly where you are now. You're building something amazing!",
    icon: Sparkles
  },
  {
    title: "You're Improving! 🎯",
    message: "Each exercise is making your musical ear sharper. Progress isn't always visible, but it's always happening.",
    icon: Target
  },
  {
    title: "Stay Focused! 🔥",
    message: "The most beautiful music comes from consistent practice. You're doing great!",
    icon: Flame
  }
];

export default function MotivationBoost({ module, onContinue }) {
  const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
  const IconComponent = randomMessage.icon;

  const handleContinue = () => {
    try {
      if (typeof onContinue === 'function') {
        onContinue();
      }
    } catch (error) {
      console.error('Error in MotivationBoost onContinue:', error);
    }
  };

  return (
    <Card className="clay-card bg-white/90 backdrop-blur-sm">
      <CardContent className="p-8 text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
          <IconComponent className="w-12 h-12 text-white" />
        </div>
        
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-gray-800">{randomMessage.title}</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            {randomMessage.message}
          </p>
        </div>

        {/* FIXED: Ensure button works properly */}
        <Button
          onClick={handleContinue}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg py-3 px-8 rounded-full shadow-lg hover:scale-105 transition-transform"
        >
          Continue Training
        </Button>
      </CardContent>
    </Card>
  );
}