import React, { useState, useEffect } from "react";
import FreddieMascot from "./FreddieMascot";

export default function FreddieWelcome() {
  const [currentMessage, setCurrentMessage] = useState("");
  
  const welcomeMessages = [
    "Ready to rock the staff, darling?",
    "We will... we will... train you!",
    "Don't stop me now! Let's get practicing.",
    "Let's make some music magic happen."
  ];

  useEffect(() => {
    const randomMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
    setCurrentMessage(randomMessage);
  }, []);

  return (
    <div className="flex justify-center mb-6">
      <FreddieMascot 
        message={currentMessage}
        size="large"
        position="left"
        variant="singing"
      />
    </div>
  );
}