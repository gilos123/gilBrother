import React, { useState, useEffect } from "react";
import ArethaMascot from "./ArethaMascot";

export default function ArethaWelcome() {
  const [currentMessage, setCurrentMessage] = useState("");
  
  const welcomeMessages = [
    "You got soul? Let's prove it with some practice!",
    "Time to give your musical memory some R-E-S-P-E-C-T!",
    "The groove is waiting for you, sugar. Let's get to it.",
    "A little practice goes a long way. Let's make some magic."
  ];

  useEffect(() => {
    const randomMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
    setCurrentMessage(randomMessage);
  }, []);

  return (
    <div className="flex justify-center mb-6">
      <ArethaMascot 
        message={currentMessage}
        size="large"
        position="left"
        variant="thinking"
      />
    </div>
  );
}