import React from 'react';
import JimiMascot from '../shared/JimiMascot';

export default function JimiIntroduction({ onStart }) {
  const handleStart = () => {
    try {
      if (typeof onStart === 'function') {
        onStart();
      }
    } catch (error) {
      console.error('Error in JimiIntroduction onStart:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-8">
      <JimiMascot
        message="Ready to train those ears?"
        size="large"
        variant="dynamic"
      />
      
      <div className="clay-card p-6 max-w-2xl text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">"Expanding Your Palette!"</h2>
        <p className="text-gray-700 text-lg">
          You've got a good ear! Now let's add more color to your sound. We'll explore new intervals and chord flavors.
        </p>
        <div className="space-y-2 text-left">
          <h3 className="font-semibold text-gray-800">In this section, you will learn:</h3>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>More intervals (3rds, 6ths, Octave)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>Diminished and Augmented chords</span>
          </div>
        </div>
      </div>

      <button
        onClick={handleStart}
        className="clay-button bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-xl py-4 px-10 rounded-full shadow-lg hover:scale-105 transition-transform"
      >
        Let's Jam!
      </button>
    </div>
  );
}