import React from 'react';
import DukeMascot from '../shared/DukeMascot';

export default function DukeIntroduction({ onStart }) {
  const handleStart = () => {
    try {
      if (typeof onStart === 'function') {
        onStart();
      }
    } catch (error) {
      console.error('Error in DukeIntroduction onStart:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-8">
      <DukeMascot
        message="Time to feel the rhythm!"
        size="large"
        variant="dynamic"
      />
      
      <div className="clay-card p-6 max-w-2xl text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">"Finding Your Groove"</h2>
        <p className="text-gray-700 text-lg">
          Rhythm is the heartbeat of music. Let's start with simple patterns and build up your rhythmic vocabulary step by step.
        </p>
        <div className="space-y-2 text-left">
          <h3 className="font-semibold text-gray-800">In this section, you will learn:</h3>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>Quarter and Half note patterns</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>Basic rhythm recognition</span>
          </div>
        </div>
      </div>

      <button
        onClick={handleStart}
        className="clay-button bg-gradient-to-r from-green-500 to-emerald-400 text-white font-bold text-xl py-4 px-10 rounded-full shadow-lg hover:scale-105 transition-transform"
      >
        Let's Swing!
      </button>
    </div>
  );
}