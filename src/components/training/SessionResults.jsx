import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Trophy, Home, RefreshCw, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function SessionResults({ 
  score, 
  xpEarned, 
  level, 
  module, 
  onNextLevel, 
  onTryAgain, 
  onHome, 
  onArena,
  isSaving // New prop to indicate saving is in progress
}) {
  const { correct, total } = score;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  
  const getXpBreakdown = () => {
    if (!xpEarned) return "0 base";
    const base = xpEarned > 20 ? (module === 'combined' ? 25 : 20) : (module === 'combined' ? 20 : 15);
    const perfectBonus = accuracy === 100 ? 5 : 0;
    const speedBonus = xpEarned - base - perfectBonus;
    
    let breakdown = `${base} base`;
    if (perfectBonus > 0) breakdown += ` + ${perfectBonus} perfect`;
    if (speedBonus > 0) breakdown += ` + ${speedBonus} bonus`;
    return breakdown;
  };
  
  const moduleName = module.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="text-center bounce-in max-w-lg mx-auto">
      <div className="mb-4">
        <div className="inline-block p-4 bg-yellow-100 rounded-full">
          <Trophy className="w-10 h-10 text-yellow-500 glowing-crown" />
        </div>
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Session Complete!</h1>
      <p className="text-gray-600 mb-8">Great work! Here are your results.</p>
      
      <Card className="clay-card mb-8">
        <CardContent className="p-6 grid grid-cols-3 divide-x divide-gray-200">
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm font-semibold text-gray-500 mb-2">SCORE</p>
            <p className="text-3xl font-bold text-yellow-600">{accuracy}%</p>
            <p className="text-xs text-gray-500">({correct}/{total})</p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm font-semibold text-gray-500 mb-2">TOTAL XP</p>
            <p className="text-3xl font-bold text-purple-600">+{xpEarned}</p>
            <p className="text-xs text-gray-500">{getXpBreakdown()}</p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm font-semibold text-gray-500 mb-2">LEVEL</p>
            <p className="text-3xl font-bold text-teal-600">{level}</p>
            <p className="text-xs text-gray-500">{moduleName}</p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {accuracy >= 70 && (
          <Button 
            onClick={onNextLevel}
            disabled={isSaving}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg text-lg py-6"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Award className="w-5 h-5 mr-2" />}
            {isSaving ? 'Saving...' : 'Next Level'}
          </Button>
        )}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            onClick={onTryAgain} 
            disabled={isSaving}
            variant="outline" 
            className="clay-button w-full text-lg py-6"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <RefreshCw className="w-5 h-5 mr-2" />}
            {isSaving ? 'Saving...' : 'Try Again'}
          </Button>
          <Button 
            onClick={onHome} 
            disabled={isSaving}
            variant="outline" 
            className="clay-button w-full text-lg py-6"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Home className="w-5 h-5 mr-2" />}
            {isSaving ? 'Saving...' : 'Home'}
          </Button>
        </div>
        <Link to={createPageUrl("Arena")} className="block">
          <Button 
            disabled={isSaving}
            variant="outline" 
            className="clay-button w-full text-lg py-6"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Trophy className="w-5 h-5 mr-2 text-yellow-600" />}
            {isSaving ? 'Saving...' : 'Go to Arena'}
          </Button>
        </Link>
      </div>
    </div>
  );
}