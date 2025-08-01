import React, { useState, useEffect } from "react";
import DukeMascot from "./DukeMascot";

export default function DukeWelcome() {
  const [currentMessage, setCurrentMessage] = useState("");
  
  const welcomeMessages = [
    "Welcome! Ready to feel the beat and get into the groove?",
    "It don’t mean a thing if it ain’t got that swing! Let's practice.",
    "Stay cool, stay steady — the beat is your best friend.",
    "Everybody has rhythm — you just need to wake it up!",
    "Relax. You’re the bandleader now! Let's get started."
  ];

  useEffect(() => {
    const randomMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
    setCurrentMessage(randomMessage);
  }, []);

  return (
    <div className="flex justify-center mb-6">
      <DukeMascot 
        message={currentMessage}
        size="large"
        position="left"
        variant="dynamic"
      />
    </div>
  );
}