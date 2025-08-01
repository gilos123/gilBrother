import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Target, ArrowRight } from 'lucide-react';

export default function MistakeIntro({ onContinue, mistakesCount }) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl flex flex-col items-center justify-center min-h-[70vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="w-full text-center"
      >
        <Card className="clay-card bg-white/80 backdrop-blur-md">
          <CardContent className="p-8 md:p-12 space-y-6">
            <div className="bounce-in">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-yellow-100 to-orange-200 flex items-center justify-center clay-card">
                <Target className="w-12 h-12 text-yellow-600" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                Mistake Practice Ahead!
              </h1>
              <p className="text-gray-600 text-lg">
                You got {mistakesCount} question{mistakesCount > 1 ? 's' : ''} wrong. Let's try them again — with tips to help you succeed!
              </p>
            </div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Button
                onClick={onContinue}
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-lg py-6 px-10 shadow-lg hover:scale-105 transition-transform"
              >
                Start Fixing Mistakes <ArrowRight className="w-5 h-5 ml-3" />
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}