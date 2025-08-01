import React from 'react';

const FREDDIE_IMAGES = {
  main: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/0a314f46d_20250705_1617_FreddieMercuryMascot_simple_compose_01jzdbpq29eyxt9639yhete96y-Edited.png",
  coaching: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/cd2658398_20250705_1624_PlayfulMusicIcon_remix_01jzdc269aejd9mn3ypd11aqs1.png",
  singing: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/231295458_20250705_1620_CartoonSingerMascot_remix_01jzdbv3ajfwbvvyek8dn6qk2g.png"
};

export default function FreddieMascot({ message, size = "medium", position = "left", variant = "main" }) {
  const sizeClasses = {
    small: "w-24 h-24",
    medium: "w-32 h-32",
    large: "w-48 h-48",
  };

  const imageSrc = FREDDIE_IMAGES[variant] || FREDDIE_IMAGES.main;
  
  const mascot = (
    <div className={`flex flex-col items-center gap-2 ${sizeClasses[size]}`}>
      <img 
        src={imageSrc}
        alt="Freddie Mercury Mascot" 
        className="object-contain w-full h-full drop-shadow-lg"
      />
    </div>
  );

  return (
    <div className={`flex items-center gap-4 ${position === 'right' ? 'flex-row-reverse' : 'flex-row'}`}>
      {mascot}
      {message && (
        <div className="clay-card bg-white/70 px-6 py-3 max-w-xs">
          <p className="text-center font-semibold text-gray-700 italic">"{message}"</p>
        </div>
      )}
    </div>
  );
}