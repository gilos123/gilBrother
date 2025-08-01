import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DukeMascot from "../shared/DukeMascot";

export default function DukeEncouragement({ accuracy, showBriefly = false, onComplete }) {
  const [encouragementMessage, setEncouragementMessage] = useState("");
  
  const getEncouragementMessage = () => {
    if (accuracy === 100) {
      return [
        "Perfect timing! You've got that swing locked in! 🎵",
        "It don't mean a thing if it ain't got that swing - and you've got it!",
        "Smooth as silk! The beat is your best friend now!"
      ];
    } else if (accuracy >= 80) {
      return [
        "Stay cool, stay steady — the beat is your best friend!",
        "Everybody has rhythm — you just woke yours up!",
        "Timing is everything, and you're locking in beautifully!"
      ];
    } else if (accuracy >= 60) {
      return [
        "Swing is not about counting — it's about feeling. You're getting there!",
        "Relax. You're the bandleader now! Keep that groove going.",
        "The rhythm is calling — listen and feel it in your soul!"
      ];
    } else {
      return [
        "Stay cool! Even the best musicians had to find their groove.",
        "Don't worry about the beat — let the beat worry about you!",
        "Keep swinging! The rhythm will come naturally with practice."
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
        <DukeMascot 
          message={encouragementMessage}
          size="large"
          position="left"
          variant={accuracy >= 80 ? "drums" : "calm"}
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
              🥁
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