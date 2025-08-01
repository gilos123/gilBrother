import React, { useState, useEffect } from "react";
import FreddieMascot from "../shared/FreddieMascot";

export default function FreddieEncouragement() {
  const [currentMessage, setCurrentMessage] = useState("");
  
  const encouragementMessages = [
    "You are the champions, right?",
    "The show must go… up a fifth!",
    "This is the real Rhapsody!",
    "You’re a Killer King.",
    "Don’t stop you now!",
    "Is this just fantasy? Nope - it’s a perfect fourth.",
    "Another note bites the dust.",
    "Mamaaa... just nailed a note.",
    "We will... we will... train you!",
    "I want to break free — from wrong intervals."
  ];

  useEffect(() => {
    const randomMessage = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
    setCurrentMessage(randomMessage);
  }, []);

  return (
    <div className="flex justify-center my-4">
      <FreddieMascot 
        message={currentMessage}
        size="medium"
        position="left"
        variant="coaching"
      />
    </div>
  );
}