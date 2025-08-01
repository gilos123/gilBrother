import React from 'react';
import ArethaMascot from '../shared/ArethaMascot';

const ArethaCelebration = ({ message }) => {
  return (
    <div className="flex justify-center my-6">
      <ArethaMascot
        message={message}
        size="large"
        position="center"
        variant="singing"
      />
    </div>
  );
};

export default ArethaCelebration;