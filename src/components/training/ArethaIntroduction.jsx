import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ArethaMascot from '../shared/ArethaMascot';

const introSlides = [
  {
    title: "Step Up to the Stage!",
    content: "Welcome to Drumline Memory. I'm Aretha, and I'm here to test your rhythm. It's all about respect for the beat. Listen closely, remember the pattern, and show me what you've got.",
    mascotVariant: "waving"
  },
  {
    title: "How It Works",
    content: "A rhythm sequence will play for you, measure by measure. After each new measure is added, you'll see three options. Your job is to select the card that contains the newest rhythm you just heard.",
    mascotVariant: "singing"
  },
  {
    title: "Think, Baby, Think!",
    content: "The sequence gets longer each round. Stay focused! If you choose correctly, the sequence grows. Make a mistake, and the game is over. Ready to find out what it means to me?",
    mascotVariant: "waving"
  }
];

export default function ArethaIntroduction({ onComplete }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < introSlides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  // FIXED: Ensure onComplete is called correctly
  const handleStartLesson = () => {
    if (onComplete && typeof onComplete === 'function') {
      onComplete();
    }
  };

  const slide = introSlides[currentSlide];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <motion.div
        key={currentSlide}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white/95 backdrop-blur-lg clay-card w-full max-w-md mx-auto rounded-3xl p-6 sm:p-8 text-center flex flex-col justify-between min-h-[70vh] sm:min-h-[500px]"
      >
        <div className="flex-grow flex flex-col items-center justify-center">
          <ArethaMascot message={null} size="large" variant={slide.mascotVariant} />
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-6"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">{slide.title}</h2>
              <p className="text-gray-700 leading-relaxed">{slide.content}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        
        <div className="mt-8">
            <div className="flex justify-center items-center gap-2 mb-6">
                {introSlides.map((_, index) => (
                    <div
                        key={index}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                            index === currentSlide ? 'bg-purple-500 scale-125' : 'bg-gray-300'
                        }`}
                    />
                ))}
            </div>

            <div className="flex items-center justify-between">
              <Button onClick={handlePrev} variant="ghost" disabled={currentSlide === 0} className="text-gray-700">
                <ChevronLeft className="w-5 h-5 mr-1" /> Prev
              </Button>
              {currentSlide === introSlides.length - 1 ? (
                <Button
                  onClick={handleStartLesson}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold shadow-lg px-6 py-3"
                >
                  Start the Lesson!
                </Button>
              ) : (
                <Button onClick={handleNext} variant="outline" className="clay-button text-gray-800">
                  Next <ChevronRight className="w-5 h-5 ml-1" />
                </Button>
              )}
            </div>
        </div>
      </motion.div>
    </div>
  );
}