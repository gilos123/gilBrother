import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Star, Music, Zap } from "lucide-react";

export default function JimiHendrixMotivation({ onContinue }) {
  const [currentQuote, setCurrentQuote] = useState("");
  
  const motivationalQuotes = [
    "You're crushing it, keep going! 🎸",
    "Feel the rhythm in your soul! ✨",
    "Purple haze of musical genius! 🌟",
    "Are you experienced? You're getting there! 🔥",
    "Music is my religion - and you're a believer! 🎵",
    "The power of soul flows through your fingers! ⚡",
    "All along the watchtower of rhythm mastery! 🏰",
    "Hey Joe, where you going with that talent? 🎯"
  ];

  useEffect(() => {
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    setCurrentQuote(randomQuote);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      exit={{ opacity: 0, scale: 0.5, rotate: 10 }}
      transition={{ 
        duration: 0.8, 
        type: "spring", 
        bounce: 0.4 
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
    >
      <div className="clay-card max-w-lg mx-4 bg-gradient-to-br from-orange-100 via-red-100 to-pink-200">
        <CardContent className="p-8 text-center">
          {/* Animated Jimi Hendrix Figure */}
          <motion.div
            animate={{ 
              rotate: [0, -3, 3, -3, 0],
              scale: [1, 1.02, 1, 1.02, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="mb-6"
          >
            {/* Jimi Hendrix Character */}
            <div className="relative w-40 h-48 mx-auto clay-card bg-gradient-to-b from-amber-100 to-amber-200">
              {/* Head */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-16 h-20 bg-amber-600 rounded-full clay-card">
                {/* Hair */}
                <div className="absolute -top-2 -left-2 w-20 h-16 bg-gray-800 rounded-full clay-card"></div>
                {/* Bandana */}
                <div className="absolute top-1 left-0 w-16 h-6 bg-red-500 rounded-full clay-card opacity-80"></div>
                {/* Eyes */}
                <div className="absolute top-6 left-3 w-2 h-2 bg-black rounded-full"></div>
                <div className="absolute top-6 right-3 w-2 h-2 bg-black rounded-full"></div>
                {/* Nose */}
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-1 h-2 bg-amber-700 rounded-full"></div>
                {/* Mustache */}
                <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gray-800 rounded-full"></div>
              </div>
              
              {/* Body */}
              <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-12 h-16 bg-purple-600 rounded-lg clay-card">
                {/* Guitar strap */}
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-1 h-12 bg-brown-600 rounded-full"></div>
              </div>
              
              {/* Arms */}
              <div className="absolute top-24 left-2 w-3 h-12 bg-amber-600 rounded-full clay-card transform rotate-12"></div>
              <div className="absolute top-24 right-2 w-3 h-12 bg-amber-600 rounded-full clay-card transform -rotate-12"></div>
              
              {/* Guitar */}
              <motion.div
                animate={{ rotate: [0, 2, -2, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute top-28 right-0 w-8 h-16 bg-orange-600 rounded-lg clay-card"
              >
                {/* Guitar strings */}
                <div className="absolute top-2 left-1 w-6 h-0.5 bg-gray-300 rounded-full"></div>
                <div className="absolute top-4 left-1 w-6 h-0.5 bg-gray-300 rounded-full"></div>
                <div className="absolute top-6 left-1 w-6 h-0.5 bg-gray-300 rounded-full"></div>
              </motion.div>
              
              {/* Legs */}
              <div className="absolute bottom-2 left-4 w-3 h-8 bg-blue-800 rounded-full clay-card"></div>
              <div className="absolute bottom-2 right-4 w-3 h-8 bg-blue-800 rounded-full clay-card"></div>
            </div>
            
            {/* Floating music notes around Jimi */}
            <div className="relative">
              <motion.div
                animate={{ 
                  y: [-10, -20, -10],
                  x: [-5, 5, -5],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="absolute -top-12 -left-8 text-3xl"
              >
                🎵
              </motion.div>
              
              <motion.div
                animate={{ 
                  y: [-15, -25, -15],
                  x: [5, -5, 5],
                  rotate: [0, -10, 10, 0]
                }}
                transition={{ 
                  duration: 2.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: 0.5
                }}
                className="absolute -top-8 -right-10 text-2xl"
              >
                🎶
              </motion.div>
            </div>
          </motion.div>

          {/* Jimi's Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold text-gray-800">
              Jimi Says:
            </h2>
            
            <div className="clay-card p-6 bg-white/50">
              <p className="text-xl font-semibold text-gray-800 leading-relaxed">
                "{currentQuote}"
              </p>
            </div>
            
            {/* Sparkle effects */}
            <div className="flex justify-center gap-4 text-purple-600">
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Star className="w-6 h-6" />
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.3, 1], rotate: [0, -180, -360] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <Zap className="w-6 h-6" />
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 180] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              >
                <Music className="w-6 h-6" />
              </motion.div>
            </div>
          </motion.div>

          {/* Continue Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onContinue}
            className="clay-button mt-6 px-8 py-4 text-gray-800 font-bold text-lg"
          >
            Rock On! 🤘
          </motion.button>
        </CardContent>
      </div>
    </motion.div>
  );
}