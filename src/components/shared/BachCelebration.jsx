import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import BachMascot from "./BachMascot";

export default function BachCelebration({ accuracy, xpEarned }) {
  const [celebrationMessage, setCelebrationMessage] = useState("");
  
  const getCelebrationMessage = () => {
    if (accuracy === 100) {
      return [
        "Bravo! Perfect performance! Even I'm impressed!",
        "Magnificent! You've mastered this like a true virtuoso!",
        "Flawless execution! You're ready for the concert hall!"
      ];
    } else if (accuracy >= 80) {
      return [
        "Excellent work! You're improving faster than my Brandenburg Concertos!",
        "Wonderfully done! Keep this tempo and you'll be composing soon!",
        "Superb! Your musical skills are blooming beautifully!"
      ];
    } else if (accuracy >= 60) {
      return [
        "Good progress! Remember, accuracy first, speed will follow.",
        "Well done! Every practice session makes you stronger!",
        "Nice work! If you play a wrong note, just call it a new variation!"
      ];
    } else {
      return [
        "Don't worry! Even I had difficult practice days. Keep going!",
        "Remember, every master was once a beginner. You're on the right path!",
        "Practice makes perfect! Let's try again with renewed spirit!"
      ];
    }
  };

  useEffect(() => {
    const messages = getCelebrationMessage();
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setCelebrationMessage(randomMessage);
  }, [accuracy]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.8 }}
      className="flex justify-center mb-6"
    >
      <div className="relative">
        <BachMascot 
          message={celebrationMessage}
          size="large"
          position="left"
        />
        
        {/* Floating musical notes for celebration */}
        {accuracy >= 80 && (
          <div className="absolute -top-4 -right-4">
            <motion.div
              animate={{ 
                y: [-10, -20, -10],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="text-2xl"
            >
              🎵
            </motion.div>
            <motion.div
              animate={{ 
                y: [-15, -25, -15],
                rotate: [0, -10, 10, 0]
              }}
              transition={{ 
                duration: 2.5,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 0.5
              }}
              className="text-xl absolute top-2 -right-6"
            >
              🎶
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
}