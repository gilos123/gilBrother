import React, { useState, useEffect } from "react";
import JimiMascot from "./JimiMascot";

export default function JimiWelcome() {
  const [currentMessage, setCurrentMessage] = useState("");
  
  const welcomeMessages = [
    "Hey there, ready to train your ears? Let's tune in!",
    "Your ears are your secret weapon — let’s sharpen them!",
    "Every great solo starts with great listening. You got this!",
    "The more you hear, the more you can play. Let's do it!",
    "Even I had to train my ears. Trust your instincts!"
  ];

  useEffect(() => {
    const randomMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
    setCurrentMessage(randomMessage);
  }, []);

  return (
    <div className="flex justify-center mb-6">
      <JimiMascot 
        message={currentMessage}
        size="large"
        position="left"
        variant="dynamic"
      />
    </div>
  );
}