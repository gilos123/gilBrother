import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Star, Crown, Music } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LevelUpCelebration({ module, newLevel, onContinue }) {
  const handleContinue = () => {
    try {
      if (typeof onContinue === 'function') {
        onContinue();
      }
    } catch (error) {
      console.error('Error in LevelUpCelebration onContinue:', error);
    }
  };

  const getLevelMessage = (level) => {
    if (level <= 5) return "Building your foundation! 🎵";
    if (level <= 10) return "Getting stronger! 💪";
    if (level <= 15) return "You're becoming skilled! ⭐";
    if (level <= 20) return "Expert level achieved! 👑";
    if (level <= 25) return "Master musician! 🎖️";
    return "Legendary status! 🏆";
  };

  return (
    <Card className="clay-card bg-white/90 backdrop-blur-sm">
      <CardContent className="p-8 text-center space-y-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center"
        >
          <Trophy className="w-14 h-14 text-white" />
        </motion.div>
        
        <div className="space-y-3">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-gray-800"
          >
            Level {newLevel} Unlocked! 🎉
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-700 text-lg"
          >
            {getLevelMessage(newLevel)}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-gray-600"
          >
            Ready for new challenges in {module.replace('_', ' ')}?
          </motion.p>
        </div>

        {/* FIXED: Ensure button works properly */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <Button
            onClick={handleContinue}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-lg py-3 px-8 rounded-full shadow-lg hover:scale-105 transition-transform"
          >
            Continue to Level {newLevel}
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
}