
import React, { useState, useEffect } from "react";
import BachMascot from "./BachMascot";

export default function BachWelcome() {
  const [currentMessage, setCurrentMessage] = useState("");
  
  const welcomeMessages = [
    "Welcome back, my musical friend!",
    "Ready to compose some beautiful practice?",
    "Even I had to practice my scales — but I made a few good compositions along the way!",
    "One note at a time... like building a beautiful counterpoint.",
    "Every master was once a beginner. Keep going!",
    "The fugue wasn't built in a day!"
  ];

  useEffect(() => {
    const randomMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
    setCurrentMessage(randomMessage);
  }, []);

  return (
    <div className="flex justify-center mb-6">
      <BachMascot 
        message={currentMessage}
        size="large"
        position="left"
      />
    </div>
  );
}
