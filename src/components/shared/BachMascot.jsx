
import React from "react";
import { motion } from "framer-motion";

export default function BachMascot({ 
  message, 
  size = "medium", 
  position = "left",
  showSpeechBubble = true,
  className = ""
}) {
  const sizeClasses = {
    small: "w-20 h-20",
    medium: "w-32 h-32",
    large: "w-40 h-40",
    xlarge: "w-48 h-48",
    giant: "w-56 h-56"
  };

  const BachImage = () => (
    <motion.div
      animate={{ 
        rotate: [0, -2, 2, -2, 0],
        scale: [1, 1.02, 1, 1.02, 1]
      }}
      transition={{ 
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse"
      }}
      className={`${sizeClasses[size]} ${className}`}
    >
      <img 
        src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/e659e5e9d_20250617_1253_BachAppMascot_simple_compose_01jxymvvayfpwbmeckx665tga4.png"
        alt="Bach Mascot"
        className="w-full h-full object-contain"
      />
    </motion.div>
  );

  if (!showSpeechBubble) {
    return <BachImage />;
  }

  return (
    <div className={`flex items-center gap-4 ${position === 'right' ? 'flex-row-reverse' : ''}`}>
      <BachImage />
      
      {message && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className={`max-w-sm ${position === 'right' ? 'mr-4' : 'ml-4'}`}
        >
          {/* Speech bubble */}
          <div className="relative clay-card bg-white/90 p-4 rounded-2xl shadow-lg">
            <p className="text-base text-gray-800 font-medium leading-relaxed">
              "{message}"
            </p>
            
            {/* Speech bubble tail */}
            <div 
              className={`absolute top-1/2 transform -translate-y-1/2 w-0 h-0 
                ${position === 'right' 
                  ? 'right-full border-l-0 border-r-4 border-r-white/90 border-t-4 border-b-4 border-t-transparent border-b-transparent'
                  : 'left-full border-r-0 border-l-4 border-l-white/90 border-t-4 border-b-4 border-t-transparent border-b-transparent'
                }`}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}

