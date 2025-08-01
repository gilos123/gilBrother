
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { generateExercises } from "../components/training/ExerciseGenerator";
import ExerciseQuestion from "../components/training/ExerciseQuestion";
import VexFlowStaff from "../components/training/VexFlowStaff";
import VexFlowSightReading from "../components/training/VexFlowSightReading";
import VexFlowInterval from "../components/training/VexFlowInterval"; // Added VexFlowInterval import
import { ArrowLeft, RefreshCw, Lock, KeyRound } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function LevelTester() {
  const [isLocked, setIsLocked] = useState(true);
  const [inputCode, setInputCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  const [selectedModule, setSelectedModule] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [exercises, setExercises] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const modules = [
    { id: "ear_training", name: "Ear Training" },
    { id: "rhythm_training", name: "Rhythm Training" },
    { id: "drumline_memory", name: "Drumline Memory" },
    { id: "sight_reading", name: "Sight Reading" },
    { id: "musical_geography", name: "Musical Geography" },
    { id: "ear_training_melodic", name: "Ear Training: In Action!" }, // **Design Change**: Added melodic ear training
    { id: "combined", name: "Combined Practice" }
  ];

  // Updated levels based on module
  const getLevelsForModule = (moduleId) => {
    if (moduleId === 'sight_reading' || moduleId === 'musical_geography') {
      return Array.from({ length: 30 }, (_, i) => i + 1);
    } else if (moduleId === 'drumline_memory') {
      return [1, 2, 3]; // Only 3 levels for Drumline Memory
    } else if (moduleId === 'ear_training_melodic') {
      return [1, 2, 3, 4]; // 4 levels for melodic ear training
    }
    return Array.from({ length: 20 }, (_, i) => i + 1);
  };

  const levels = selectedModule ? getLevelsForModule(selectedModule) : [];

  const handleCodeSubmit = (e) => {
    e.preventDefault();
    if (inputCode === "8461") {
      setIsLocked(false);
      setErrorMessage("");
    } else {
      setErrorMessage("Incorrect code. Please try again.");
      setInputCode("");
    }
  };
  
  const handleGenerate = () => {
    if (!selectedModule || !selectedLevel) return;
    
    const newExercises = generateExercises(selectedModule, 5, parseInt(selectedLevel));
    setExercises(newExercises);
    setCurrentIndex(0);
  };

  const handleAnswer = (answer) => {
    console.log(`Level ${selectedLevel} ${selectedModule}: Answer ${answer} for question:`, exercises[currentIndex]);
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (isLocked) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md h-screen flex flex-col justify-center items-center">
        <div className="w-full text-center">
          <Lock className="w-16 h-16 text-gray-400 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Restricted</h1>
          <p className="text-gray-600 mb-6">Only developers can access this area. What is the secret code?</p>
          
          <form onSubmit={handleCodeSubmit} className="space-y-4">
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="password"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="Enter secret code"
                className="pl-10 text-center text-lg tracking-widest"
              />
            </div>
            <Button type="submit" className="w-full">
              Unlock
            </Button>
          </form>
          
          {errorMessage && (
            <p className="text-red-500 mt-4">{errorMessage}</p>
          )}

          <Link to={createPageUrl("Home")} className="block mt-8">
            <Button variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link to={createPageUrl("Home")}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">Level Tester</h1>
      </div>

      {/* Controls */}
      <Card className="clay-card mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Module</label>
              <Select value={selectedModule} onValueChange={setSelectedModule}>
                <SelectTrigger>
                  <SelectValue placeholder="Select module" />
                </SelectTrigger>
                <SelectContent>
                  {modules.map(module => (
                    <SelectItem key={module.id} value={module.id}>
                      {module.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map(level => (
                    <SelectItem key={level} value={level.toString()}>
                      Level {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleGenerate} disabled={!selectedModule || !selectedLevel}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Generate Test
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Exercise Display */}
      {exercises.length > 0 && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {selectedModule.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} - Level {selectedLevel}
            </h2>
            <p className="text-gray-600">
              Question {currentIndex + 1} of {exercises.length}
            </p>
          </div>

          {/* Rhythm Staff Display */}
          {exercises[currentIndex].type === 'rhythm_recognition' && (
            <VexFlowStaff 
              rhythmPattern={exercises[currentIndex].rhythmPattern} 
              tempo={90}
            />
          )}

          {/* **Design Change**: Enhanced Drumline Memory Display for Testing */}
          {/* Shows all three rhythm options with clear labeling for comparison */}
          {exercises[currentIndex].type === 'drumline_memory' && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4">Drumline Memory Pattern Options</h3>
                <p className="text-gray-600 mb-4">Compare the rhythm notations:</p>
              </div>
              
              {/* **Design Change**: Display all rhythm options for testing */}
              {/* Shows correct pattern and both distractors side by side */}
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-bold text-center mb-2">Correct Pattern (What user hears)</h4>
                  <VexFlowStaff 
                    rhythmPattern={exercises[currentIndex].rhythmPattern} 
                    tempo={90}
                    timeSignature={exercises[currentIndex].timeSignature || [4, 4]}
                  />
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-center mb-2">All Answer Options</h4>
                  <div className="space-y-3">
                    {exercises[currentIndex].options && exercises[currentIndex].options.map((option, idx) => (
                      <div key={idx} className="border p-2 rounded">
                        <p className="text-sm font-medium mb-1">Option {['A', 'B', 'C'][idx]} {option.id === 'correct' ? '(Correct)' : ''}</p>
                        <VexFlowStaff 
                          rhythmPattern={option.pattern} 
                          tempo={90}
                          timeSignature={exercises[currentIndex].timeSignature || [4, 4]}
                          compact={true}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sight Reading Staff Display */}
          {exercises[currentIndex].type === 'note_identification' && (
            <VexFlowSightReading note={exercises[currentIndex].note} />
          )}

          {/* Musical Geography Staff Display */}
          {(exercises[currentIndex].type === 'musical_geography_identification' || exercises[currentIndex].type === 'musical_geography_generation') && (
            <VexFlowInterval
              notes={exercises[currentIndex].notes}
              clef="treble"
            />
          )}

          {/* Exercise Question */}
          <ExerciseQuestion
            exercise={exercises[currentIndex]}
            onAnswer={handleAnswer}
            moduleColor="from-blue-500 to-cyan-400"
          />

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button 
              onClick={handlePrevious} 
              disabled={currentIndex === 0}
              variant="outline"
            >
              Previous
            </Button>
            
            <div className="text-sm text-gray-600">
              Level Range: {selectedLevel <= 5 ? '1-5 (Basic)' : 
                          selectedLevel <= 10 ? '6-10 (Intermediate)' : 
                          selectedLevel <= 15 ? '11-15 (Advanced)' : 
                          selectedLevel <= 20 ? '16-20 (Expert)' : 
                          selectedLevel <= 25 ? '21-25 (Master)' :
                          '26-30 (Grandmaster)'}
            </div>
            
            <Button 
              onClick={handleNext} 
              disabled={currentIndex === exercises.length - 1}
              variant="outline"
            >
              Next
            </Button>
          </div>

          {/* Exercise Details for Testing */}
          <Card className="clay-card bg-gray-50">
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Exercise Details:</h3>
              <pre className="text-xs text-gray-600 overflow-auto">
                {JSON.stringify(exercises[currentIndex], null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
