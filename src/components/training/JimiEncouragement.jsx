import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import JimiMascot from "../shared/JimiMascot";

export default function JimiEncouragement({ accuracy, showBriefly = false, onComplete }) {
  const [encouragementMessage, setEncouragementMessage] = useState("");
  
  const getEncouragementMessage = () => {
    if (accuracy === 100) {
      return [
        "Perfect! Your ears are on fire! 🔥",
        "Every great solo starts with great listening!",
        "Listen deeply - you nailed it!"
      ];
    } else if (accuracy >= 80) {
      return [
        "Your ears are your secret weapon - they're getting sharp!",
        "The more you hear, the more you can play!",
        "Even I had to train my ears. You're doing great!"
      ];
    } else if (accuracy >= 60) {
      return [
        "Mistakes? No problem - that's how your brain learns the sounds.",
        "Trust your instincts - they're getting stronger!",
        "Listen deeply - the answers are all there."
      ];
    } else {
      return [
        "Even I had to train my ears. Keep going!",
        "Your ears are learning - every sound counts!",
        "The rhythm is calling - listen and learn!"
      ];
    }
  };

  useEffect(() => {
    const messages = getEncouragementMessage();
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setEncouragementMessage(randomMessage);

    // If showing briefly, auto-complete after delay
    if (showBriefly && onComplete) {
      const timer = setTimeout(onComplete, 2000);
      return () => clearTimeout(timer);
    }
  }, [accuracy, showBriefly, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: 0.3, duration: 0.8 }}
      className="flex justify-center mb-6"
    >
      <div className="relative">
        <JimiMascot 
          message={encouragementMessage}
          size="large"
          position="left"
          variant={accuracy >= 80 ? "dynamic" : "calm"}
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
              🎸
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
              🎵
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
}