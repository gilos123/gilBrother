import React from 'react';
import FreddieMascot from '../shared/FreddieMascot';

export default function FreddieIntroduction({ onStart }) {
  const handleStart = () => {
    try {
      if (typeof onStart === 'function') {
        onStart();
      }
    } catch (error) {
      console.error('Error in FreddieIntroduction onStart:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-8">
      <FreddieMascot
        message="Welcome to Musical Geography!"
        size="large"
        variant="main"
      />
      
      <div className="clay-card p-6 max-w-2xl text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">"Mapping the Staff"</h2>
        <p className="text-gray-700 text-lg">
          "We'll move through the staff, recognize intervals, and understand the space between notes. It's like mapping music — and darling, I'm your guide. Let's rock the staff!"
        </p>
        <div className="space-y-2 text-left">
          <h3 className="font-semibold text-gray-800">In this section, you will learn:</h3>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>Visual interval recognition</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>Building intervals on the staff</span>
          </div>
        </div>
      </div>

      <button
        onClick={handleStart}
        className="clay-button bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-xl py-4 px-10 rounded-full shadow-lg hover:scale-105 transition-transform"
      >
        Let's Begin!
      </button>
    </div>
  );
}