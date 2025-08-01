import React from 'react';

export default function SightReadingStaffSVG({ note }) {
  if (!note || typeof note.yOffset === 'undefined') {
    return <div className="h-48 flex items-center justify-center">Loading staff...</div>;
  }

  // Fixed Coordinate System Mapping
  const noteY = 40 - (note.yOffset * (10 / 24));

  const renderStaffLines = () => {
    return [...Array(5)].map((_, i) => (
      <line
        key={`staff-line-${i}`}
        x1="0" y1={i * 10}
        x2="80" y2={i * 10}
        stroke="black"
        strokeWidth="0.5"
      />
    ));
  };

  const renderGClef = () => {
    return (
      <text
        x="8"
        y="25"
        fontSize="35"
        fontFamily="Times New Roman, serif"
        fill="black"
        textAnchor="start"
        dominantBaseline="central"
      >
        𝄞
      </text>
    );
  };
  
  const renderNote = () => {
    const noteX = 55;
    const noteRx = 3.5;
    
    // Correct stem direction and attachment
    const stemDirection = noteY > 20 ? 1 : -1;
    const stemHeight = 28;
    const stemX = noteX + (stemDirection === 1 ? noteRx : -noteRx);
    const stemY1 = noteY;
    const stemY2 = noteY - (stemHeight * stemDirection);

    return (
      <g>
        {/* Note Head */}
        <ellipse cx={noteX} cy={noteY} rx={noteRx} ry="3" fill="black" />
        {/* Note Stem */}
        <line x1={stemX} y1={stemY1} x2={stemX} y2={stemY2} stroke="black" strokeWidth="0.8" />
      </g>
    );
  };

  const renderLedgerLines = () => {
    const noteX = 55;
    const ledgerLines = [];
    const ledgerWidth = 12; // Increased from 8 to 12 for better visibility

    // Ledger lines above the staff (y < 0) - for high notes
    if (noteY < 0) {
      for (let y = -10; y >= noteY; y -= 10) {
        ledgerLines.push(
          <line 
            key={`ledger-a-${y}`} 
            x1={noteX - ledgerWidth / 2} 
            y1={y} 
            x2={noteX + ledgerWidth / 2} 
            y2={y} 
            stroke="black" 
            strokeWidth="0.8"
          />
        );
      }
    }

    // Ledger lines below the staff (y > 40) - for low notes
    if (noteY > 40) {
      for (let y = 50; y <= noteY; y += 10) {
        ledgerLines.push(
          <line 
            key={`ledger-b-${y}`} 
            x1={noteX - ledgerWidth / 2} 
            y1={y} 
            x2={noteX + ledgerWidth / 2} 
            y2={y} 
            stroke="black" 
            strokeWidth="0.8"
          />
        );
      }
    }
    return ledgerLines;
  };

  return (
    <div className="w-full flex justify-center p-4">
      <div className="clay-card bg-white/90 p-4 rounded-2xl">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">What note is shown?</h3>
        </div>
        
        <svg viewBox="0 -20 80 80" width="100%" className="max-w-sm mx-auto">
          {renderStaffLines()}
          {renderGClef()}
          {renderLedgerLines()}
          {renderNote()}
        </svg>
      </div>
    </div>
  );
}