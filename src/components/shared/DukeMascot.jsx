
import React from "react";
import { motion } from "framer-motion";

export default function DukeMascot({ 
  message, 
  size = "medium", 
  position = "left",
  showSpeechBubble = true,
  className = "",
  variant = "calm" // "calm", "dynamic", or "drums"
}) {
  const sizeClasses = {
    small: "w-20 h-20",
    medium: "w-32 h-32",
    large: "w-40 h-40",
    xlarge: "w-48 h-48",
    giant: "w-56 h-56"
  };

  const dukeImages = {
    calm: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/721701910_20250617_1556_DukeEllingtonMascot_simple_compose_01jxyzbfbcfrzsdj456kwaj1ey.png",
    dynamic: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/0fbe00aa3_20250617_1558_SwingRhythmMascot_remix_01jxyzf1z9ejb8x7dt0jgrnt5t.png",
    drums: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/0463a7686_20250617_1606_FriendlyRhythmCoach_remix_01jxyzxc70egd9sh7t9wygcq90.png"
  };

  const DukeImage = () => (
    <motion.div
      animate={variant === "dynamic" ? { 
        rotate: [0, -2, 2, -2, 0],
        scale: [1, 1.03, 1, 1.03, 1],
        y: [0, -3, 0, -3, 0]
      } : variant === "drums" ? {
        rotate: [0, -1, 1, -1, 0],
        scale: [1, 1.05, 1, 1.05, 1]
      } : {
        rotate: [0, -1, 1, -1, 0],
        scale: [1, 1.02, 1, 1.02, 1]
      }}
      transition={{ 
        duration: variant === "dynamic" ? 2.5 : variant === "drums" ? 2 : 3,
        repeat: Infinity,
        repeatType: "reverse"
      }}
      className={`${sizeClasses[size]} ${className}`}
    >
      <img 
        src={dukeImages[variant]}
        alt="Duke Ellington Mascot"
        className="w-full h-full object-contain"
      />
    </motion.div>
  );

  if (!showSpeechBubble) {
    return <DukeImage />;
  }

  return (
    <div className={`flex items-center gap-4 ${position === 'right' ? 'flex-row-reverse' : ''}`}>
      <DukeImage />
      
      {message && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className={`max-w-sm ${position === 'right' ? 'mr-4' : 'ml-4'}`}
        >
          {/* Speech bubble */}
          <div className="relative clay-card bg-gradient-to-br from-red-50 to-orange-50 p-4 rounded-2xl shadow-lg border border-red-200">
            <p className="text-base text-gray-800 font-medium leading-relaxed">
              "{message}"
            </p>
            
            {/* Speech bubble tail */}
            <div 
              className={`absolute top-1/2 transform -translate-y-1/2 w-0 h-0 
                ${position === 'right' 
                  ? 'right-full border-l-0 border-r-4 border-r-red-50 border-t-4 border-b-4 border-t-transparent border-b-transparent'
                  : 'left-full border-r-0 border-l-4 border-l-red-50 border-t-4 border-b-4 border-t-transparent border-b-transparent'
                }`}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}
