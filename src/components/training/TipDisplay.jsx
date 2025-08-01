import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';

export default function TipDisplay({ title = "Pro Tip!", tip }) {
  if (!tip) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring', bounce: 0.3 }}
      className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded-r-lg mb-6 flex items-start gap-3"
    >
      <Lightbulb className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
      <div>
        <h4 className="font-bold">{title}</h4>
        <p className="text-sm">{tip}</p>
      </div>
    </motion.div>
  );
}