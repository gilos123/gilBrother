
import React from 'react';

const ArethaMascot = ({ message, size = 'medium', position = 'left', variant = 'waving' }) => {
  const sizeClasses = {
    small: 'w-24 h-24',
    medium: 'w-32 h-32',
    large: 'w-48 h-48',
  };

  // FIXED: Ensured all variants map to a valid image, using the user-provided image as default.
  const imageSrc = {
    waving: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/a3815f296_1ee1ba74-b85e-48cf-87df-944f203ae729.png',
    thinking: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/c57d377a1_33774a9a-0e3b-45b8-bdcd-f20d17a6fc78.png',
    singing: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/9b5ce47c5_3bf93c13-662c-41c2-84bc-41d2fe67a93c.png',
    default: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/a3815f296_1ee1ba74-b85e-48cf-87df-944f203ae729.png',
    dynamic: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/a3815f296_1ee1ba74-b85e-48cf-87df-944f203ae729.png'
  };

  const positionClasses = position === 'left' ? 'flex-row' : 'flex-row-reverse';
  const textPosition = position === 'left' ? 'ml-4' : 'mr-4';

  return (
    <div className={`flex items-center ${positionClasses}`}>
      <div className={`${sizeClasses[size]} flex-shrink-0`}>
        <img
          src={imageSrc[variant] || imageSrc.default} // Fallback to default if variant is invalid
          alt="Aretha Franklin Mascot"
          className="w-full h-full object-contain"
        />
      </div>
      {message && (
        <div className={`relative bg-white/80 clay-card p-4 rounded-xl shadow-lg max-w-sm ${textPosition}`}>
          <p className="text-gray-800 text-center font-semibold">{message}</p>
          <div
            className={`absolute top-1/2 -mt-2 w-4 h-4 bg-white/80 transform rotate-45 ${
              position === 'left' ? '-left-2' : '-right-2'
            }`}
          ></div>
        </div>
      )}
    </div>
  );
};

export default ArethaMascot;
