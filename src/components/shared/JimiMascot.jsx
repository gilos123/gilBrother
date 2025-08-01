
import React from "react";
import { motion } from "framer-motion";

export default function JimiMascot({ 
  message, 
  size = "medium", 
  position = "left",
  showSpeechBubble = true,
  className = "",
  variant = "calm" // "calm" or "dynamic"
}) {
  const sizeClasses = {
    small: "w-20 h-20",
    medium: "w-32 h-32",
    large: "w-40 h-40",
    xlarge: "w-48 h-48",
    giant: "w-56 h-56"
  };

  const jimiImages = {
    calm: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/c2c1fc949_20250617_1308_JimiAppMascot_simple_compose_01jxynpw3me5eb2mc26bpxjqrc.png",
    dynamic: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/b59969daf_20250617_1310_PlayfulGuitarMascot_remix_01jxynt7ckfbmr3bkmdrgteack.png"
  };

  const JimiImage = () => (
    <motion.div
      animate={variant === "dynamic" ? { 
        rotate: [0, -3, 3, -3, 0],
        scale: [1, 1.05, 1, 1.05, 1],
        y: [0, -5, 0, -5, 0]
      } : {
        rotate: [0, -1, 1, -1, 0],
        scale: [1, 1.02, 1, 1.02, 1]
      }}
      transition={{ 
        duration: variant === "dynamic" ? 2 : 3,
        repeat: Infinity,
        repeatType: "reverse"
      }}
      className={`${sizeClasses[size]} ${className}`}
    >
      <img 
        src={jimiImages[variant]}
        alt="Jimi Hendrix Mascot"
        className="w-full h-full object-contain"
      />
    </motion.div>
  );

  if (!showSpeechBubble) {
    return <JimiImage />;
  }

  return (
    <div className={`flex items-center gap-4 ${position === 'right' ? 'flex-row-reverse' : ''}`}>
      <JimiImage />
      
      {message && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className={`max-w-sm ${position === 'right' ? 'mr-4' : 'ml-4'}`}
        >
          {/* Speech bubble */}
          <div className="relative clay-card bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-2xl shadow-lg border border-purple-200">
            <p className="text-base text-gray-800 font-medium leading-relaxed">
              "{message}"
            </p>
            
            {/* Speech bubble tail */}
            <div 
              className={`absolute top-1/2 transform -translate-y-1/2 w-0 h-0 
                ${position === 'right' 
                  ? 'right-full border-l-0 border-r-4 border-r-purple-50 border-t-4 border-b-4 border-t-transparent border-b-transparent'
                  : 'left-full border-r-0 border-l-4 border-l-purple-50 border-t-4 border-b-4 border-t-transparent border-b-transparent'
                }`}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}
