import React from 'react';
import BachMascot from '../shared/BachMascot';

export default function BachIntroduction({ onStart }) {
  const handleStart = () => {
    try {
      if (typeof onStart === 'function') {
        onStart();
      }
    } catch (error) {
      console.error('Error in BachIntroduction onStart:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-8">
      <BachMascot
        message="Welcome to your musical journey!"
        size="large"
      />
      
      <div className="clay-card p-6 max-w-2xl text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">"Building Your Foundation"</h2>
        <p className="text-gray-700 text-lg">
          Every great musician starts with the fundamentals. We'll begin with basic intervals and simple chords to build your ear training foundation.
        </p>
        <div className="space-y-2 text-left">
          <h3 className="font-semibold text-gray-800">In this section, you will learn:</h3>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>Basic intervals (2nds, 4ths, 5ths)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>Major and Minor triads</span>
          </div>
        </div>
      </div>

      <button
        onClick={handleStart}
        className="clay-button bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold text-xl py-4 px-10 rounded-full shadow-lg hover:scale-105 transition-transform"
      >
        Begin Practice
      </button>
    </div>
  );
}