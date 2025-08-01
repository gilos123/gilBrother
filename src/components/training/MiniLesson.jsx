
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, BookOpen, Play, Volume2 } from "lucide-react";
import { MINI_LESSON_CONTENT } from './miniLessonContent';
import VexFlowMiniLesson from './VexFlowMiniLesson';
import BachMascot from '../shared/BachMascot';
import JimiMascot from '../shared/JimiMascot';
import DukeMascot from '../shared/DukeMascot';
import FreddieMascot from '../shared/FreddieMascot';
import { AudioSynthesizer } from './AudioSynthesizer';

const MENTOR_COMPONENTS = {
  bach: BachMascot,
  jimi: JimiMascot,
  duke: DukeMascot,
  freddie: FreddieMascot
};

export default function MiniLesson({ 
  moduleType, 
  levelGroup, 
  onContinue, 
  onClose,
  isStandalone = false 
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const synthesizerRef = useRef(null);

  useEffect(() => {
    try {
      synthesizerRef.current = new AudioSynthesizer();
    } catch (error) {
      console.error("Error initializing audio for mini lesson:", error);
    }
    
    return () => {
      try {
        if (synthesizerRef.current && typeof synthesizerRef.current.stop === 'function') {
          synthesizerRef.current.stop();
        }
      } catch (error) {
        console.error("Error stopping audio:", error);
      }
    };
  }, []);

  const lessonContent = MINI_LESSON_CONTENT[moduleType]?.[levelGroup];
  
  if (!lessonContent) {
    return (
      <div className="text-center p-6">
        <p className="text-gray-600">Lesson content not found.</p>
        <Button onClick={onClose} className="mt-4">Close</Button>
      </div>
    );
  }

  const { title, mentor, mentorName, slides } = lessonContent;
  const currentSlideData = slides[currentSlide];
  const MentorComponent = MENTOR_COMPONENTS[mentor];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const playSlideAudio = async () => {
    if (!currentSlideData.audio || isPlayingAudio) return;
    
    try {
      setIsPlayingAudio(true);
      
      if (currentSlideData.audio.type === 'metronome') {
        const { bpm, beats } = currentSlideData.audio;
        const beatDuration = 60000 / bpm; // Duration of one beat in ms
        
        for (let i = 0; i < beats; i++) {
          if (synthesizerRef.current) {
            await synthesizerRef.current.playMetronomeClick();
          }
          if (i < beats - 1) {
            await new Promise(resolve => setTimeout(resolve, beatDuration));
          }
        }
      } else if (currentSlideData.audio.type === 'chord_comparison') {
        const { chords } = currentSlideData.audio;
        const baseFreq = 261.63; // C4
        
        for (let i = 0; i < chords.length; i++) {
          if (chords[i] === 'major') {
            await synthesizerRef.current.playChord(baseFreq, [0, 4, 7]); // Major triad
          } else if (chords[i] === 'minor') {
            await synthesizerRef.current.playChord(baseFreq, [0, 3, 7]); // Minor triad
          }
          
          if (i < chords.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1500));
          }
        }
      }
      
      setTimeout(() => setIsPlayingAudio(false), 500);
    } catch (error) {
      console.error("Error playing slide audio:", error);
      setIsPlayingAudio(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-5xl max-h-[95vh] overflow-y-auto"
      >
        <Card className="clay-card bg-white/95">
          <CardContent className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-2">
                <BookOpen className="w-6 h-6 text-purple-600" />
                <h1 className="text-3xl font-bold text-gray-800">Mini Lesson</h1>
              </div>
              <h2 className="text-2xl text-gray-700 mb-1">{title}</h2>
              <p className="text-sm text-gray-500">
                {moduleType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} • Level Group {levelGroup}
              </p>
            </div>

            {/* Mentor on first slide */}
            {currentSlide === 0 && MentorComponent && (
              <div className="flex justify-center mb-6">
                <MentorComponent
                  message={`Welcome to ${title}!`}
                  size="medium"
                  position="center"
                />
              </div>
            )}

            {/* Slide Content */}
            <div className="mb-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="clay-card bg-gradient-to-br from-blue-50 to-purple-50">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-3">
                        {currentSlideData.title}
                      </h3>
                      <div className="text-gray-700 leading-relaxed whitespace-pre-line text-base">
                        {currentSlideData.text}
                      </div>
                      
                      {/* Audio Button */}
                      {currentSlideData.audio && (
                        <div className="mt-6">
                          <Button
                            onClick={playSlideAudio}
                            disabled={isPlayingAudio}
                            className="bg-green-500 hover:bg-green-600 text-white"
                          >
                            {isPlayingAudio ? (
                              <Volume2 className="w-4 h-4 animate-pulse" />
                            ) : (
                              <Play className="w-4 h-4" />
                            )}
                            <span className="ml-2">
                              {isPlayingAudio ? 'Playing...' : 'Play Audio'}
                            </span>
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Visual Content */}
                  {currentSlideData.visual && (
                    <div className="mt-6">
                      <VexFlowMiniLesson visual={currentSlideData.visual} />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Progress Indicator */}
            <div className="flex justify-center mb-6">
              <div className="flex gap-2">
                {slides.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentSlide
                        ? 'bg-purple-500'
                        : index < currentSlide
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <Button
                onClick={handlePrevious}
                disabled={currentSlide === 0}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Slide {currentSlide + 1} of {slides.length}
                </p>
              </div>

              {currentSlide < slides.length - 1 ? (
                <Button
                  onClick={handleNext}
                  className="bg-purple-500 hover:bg-purple-600 text-white flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <div className="flex gap-2">
                  {!isStandalone && (
                    <Button
                      onClick={onContinue}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      Continue to Level
                    </Button>
                  )}
                  <Button
                    onClick={onClose}
                    variant="outline"
                  >
                    {isStandalone ? 'Close' : 'Skip to Level'}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
