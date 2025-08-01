
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, Music, Lock, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import ArethaMascot from '../components/shared/ArethaMascot';

export default function DrumlineMemoryMenu() {
  const navigate = useNavigate();

  // Design Change: Unlocked all levels for the user.
  const levels = [
    { id: 1, title: "Level 1 - Basic Beats", description: "Master 2/4 time signatures.", unlocked: true },
    { id: 2, title: "Level 2 - Four on the Floor", description: "Explore 4/4 time with more complexity.", unlocked: true },
    { id: 3, title: "Level 3 - Triple Feel", description: "Get groovy with 3/4 time signatures.", unlocked: true },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <Link to={createPageUrl("Home")}>
          <Button variant="ghost" size="icon" className="clay-button">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Drumline Memory</h1>
          <p className="text-gray-600">Listen, remember, and repeat the growing rhythm.</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {levels.map((level) => {
          return (
            <Card
              key={level.id}
              onClick={() => navigate(createPageUrl(`DrumlineMemory?level=${level.id}`))}
              className="clay-card hover:scale-[1.03] cursor-pointer transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h2 className="text-xl font-bold">{level.title}</h2>
                    <p className="text-gray-600 text-sm">{level.description}</p>
                  </div>
                  {/* Icons for completion/locked status removed as all levels are unlocked */}
                </div>
                {/* "Start Playing!" section, now using Play icon */}
                <div className="flex items-center gap-2 text-sm text-gray-700 mt-4">
                  <Play className="w-4 h-4" />
                  <span>Start Playing!</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      {/* Adding ArethaMascot to the bottom of the container */}
      <div className="mt-8 flex justify-center">
        <ArethaMascot className="h-40 w-auto" />
      </div>
    </div>
  );
}
