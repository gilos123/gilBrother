import React, { useState, useEffect } from 'react';
import ArethaMascot from '../shared/ArethaMascot';

const ArethaEncouragement = ({ gameState }) => {
  const [message, setMessage] = useState('');

  const sentenceBank = {
    playing: [
      "Listen close now, feel that beat.",
      "Here comes the rhythm... remember it!",
      "Pay attention, darling. The groove is talking."
    ],
    answering: [
      "You better think... before you tap!",
      "I feel what you’re trying - just don’t lose the groove.",
      "Respect the rhythm, baby!",
      "You got soul, now let’s get that memory too."
    ],
    incorrect: [
        "Ain’t no way you’re missing that beat again!",
        "That ain't it, honey. Shake it off and try again.",
        "A little off-key, but your heart's in it. Let's go again."
    ]
  };

  useEffect(() => {
    if (sentenceBank[gameState]) {
      const messages = sentenceBank[gameState];
      setMessage(messages[Math.floor(Math.random() * messages.length)]);
    }
  }, [gameState]);

  return (
    <div className="flex justify-center my-6">
      <ArethaMascot
        message={message}
        size="medium"
        position="right"
        variant="thinking"
      />
    </div>
  );
};

export default ArethaEncouragement;