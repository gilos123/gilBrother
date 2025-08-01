
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function MusicalStaff({ rhythmPattern, tempo = 90 }) {
    const renderNotesAndBeams = () => {
        const leftBarline = 20;
        const rightBarline = 280;
        const noteAreaStart = leftBarline + 15;
        const noteAreaEnd = rightBarline - 15;
        const noteAreaWidth = noteAreaEnd - noteAreaStart;
        const beatWidth = noteAreaWidth / 4;
        const staffY = 30; // Center Y for the single staff line
        const noteFontSize = "48px"; // Font size for musical notes (Bravura)

        const elements = [];

        // Group consecutive eighth notes for beaming (excluding triplets)
        const eighthNoteGroups = [];
        let currentGroup = [];
        
        rhythmPattern.forEach((note, index) => {
            if (note.type === 'note' && note.duration === 0.5 && !note.triplet) {
                if (currentGroup.length === 0 || 
                    (currentGroup.length > 0 && note.beat === currentGroup[currentGroup.length - 1].beat + 0.5)) {
                    currentGroup.push({ ...note, originalIndex: index });
                } else {
                    if (currentGroup.length > 1) {
                        eighthNoteGroups.push([...currentGroup]);
                    }
                    currentGroup = [{ ...note, originalIndex: index }];
                }
            } else {
                if (currentGroup.length > 1) {
                        eighthNoteGroups.push([...currentGroup]);
                }
                currentGroup = [];
            }
        });
        
        if (currentGroup.length > 1) {
            eighthNoteGroups.push([...currentGroup]);
        }

        // Group triplets
        const tripletGroups = [];
        const tripletMap = new Map();
        
        rhythmPattern.forEach((note, index) => {
            if (note.triplet) {
                const groupId = note.tripletGroup || 0;
                if (!tripletMap.has(groupId)) {
                    tripletMap.set(groupId, []);
                }
                tripletMap.get(groupId).push({ ...note, originalIndex: index });
            }
        });
        
        tripletMap.forEach(group => {
            if (group.length === 3) {
                tripletGroups.push(group);
            }
        });

        const beamedEighthNotes = new Set();
        eighthNoteGroups.forEach(group => {
            group.forEach(note => {
                beamedEighthNotes.add(note.originalIndex);
            });
        });

        const tripletNotes = new Set();
        tripletGroups.forEach(group => {
            group.forEach(note => {
                tripletNotes.add(note.originalIndex);
            });
        });

        // Render all individual notes and rests
        rhythmPattern.forEach((note, index) => {
            const xPosition = noteAreaStart + (note.beat * beatWidth);
            
            // Skip if this note is part of a beam group or triplet group
            if (beamedEighthNotes.has(index) || tripletNotes.has(index)) {
                return;
            }

            if (note.type === 'note') {
                const noteChars = {
                    4: '\uE0A2', // Whole Note (Bravura: U+E0A2)
                    2: '\uE0A3', // Half Note (Bravura: U+E0A3)
                    1: '\uE0A4', // Quarter Note (Bravura: U+E0A4)
                    0.5: '\uE1D5' // Eighth Note with flag (Bravura: U+E1D5)
                };
                
                elements.push(
                    <text
                        key={`note-${index}`}
                        x={xPosition}
                        y={staffY}
                        fontSize={noteFontSize}
                        fontFamily="Bravura"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="black"
                    >
                        {noteChars[note.duration]}
                    </text>
                );
            } else if (note.type === 'rest') {
                // Use Bravura font with SMuFL Unicode characters for professional rendering
                const restChars = {
                    4: '\uE4E3', // Whole Rest (Bravura: U+E4E3)
                    2: '\uE4E4', // Half Rest (Bravura: U+E4E4)
                    1: '\uE4E5', // Quarter Rest (Bravura: U+E4E5)
                    0.5: '\uE4E6' // Eighth Rest (Bravura: U+E4E6)
                };
                
                elements.push(
                    <text
                        key={`rest-${index}`}
                        x={xPosition}
                        y={note.duration === 4 ? 22 : 30} // Whole rest sits lower
                        fontSize="38px" // Keep specific font size for rests for visual balance
                        fontFamily="Bravura"
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill="black"
                    >
                        {restChars[note.duration]}
                    </text>
                );
            }
        });

        // Render beamed eighth notes
        eighthNoteGroups.forEach((group, groupIndex) => {
            if (group.length >= 2) {
                const stemHeight = 25;
                
                group.forEach((note, noteIndex) => {
                    const xPosition = noteAreaStart + (note.beat * beatWidth);
                    
                    // Draw notehead using Bravura font (quarter note head for beamed eighths)
                    elements.push(
                         <text
                            key={`beamed-head-${groupIndex}-${noteIndex}`}
                            x={xPosition}
                            y={staffY}
                            fontSize={noteFontSize}
                            fontFamily="Bravura"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="black"
                        >
                            {'\uE0A4'} {/* Quarter Note Head */}
                        </text>
                    );
                    
                    // Draw stem manually
                    elements.push(
                        <line 
                            key={`beamed-stem-${groupIndex}-${noteIndex}`} 
                            x1={xPosition + 4.5} y1={staffY} 
                            x2={xPosition + 4.5} y2={staffY - stemHeight} 
                            stroke="black" 
                            strokeWidth="1.5" 
                        />
                    );
                });

                // Draw the connecting beam
                const firstNoteX = noteAreaStart + (group[0].beat * beatWidth) + 4.5;
                const lastNoteX = noteAreaStart + (group[group.length - 1].beat * beatWidth) + 4.5;
                const beamY = staffY - stemHeight;
                
                elements.push(
                    <rect 
                        key={`beam-${groupIndex}`} 
                        x={firstNoteX} 
                        y={beamY - 2} 
                        width={lastNoteX - firstNoteX} 
                        height="4" 
                        fill="black" 
                    />
                );
            }
        });

        // Render triplet groups with proper notation
        tripletGroups.forEach((group, groupIndex) => {
            const stemHeight = 25;
            
            // Draw each triplet note
            group.forEach((note, noteIndex) => {
                const xPosition = noteAreaStart + (note.beat * beatWidth);
                
                // Draw notehead using Bravura font (quarter note head for triplet notes)
                elements.push(
                    <text
                        key={`triplet-head-${groupIndex}-${noteIndex}`}
                        x={xPosition}
                        y={staffY}
                        fontSize={noteFontSize}
                        fontFamily="Bravura"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="black"
                    >
                        {'\uE0A4'} {/* Quarter Note Head */}
                    </text>
                );
                
                // Draw stem manually
                elements.push(
                    <line 
                        key={`triplet-stem-${groupIndex}-${noteIndex}`} 
                        x1={xPosition + 4.5} y1={staffY} 
                        x2={xPosition + 4.5} y2={staffY - stemHeight} 
                        stroke="black" 
                        strokeWidth="1.5" 
                    />
                );
            });

            // Draw beam connecting all three triplet notes
            const firstNoteX = noteAreaStart + (group[0].beat * beatWidth) + 4.5;
            const lastNoteX = noteAreaStart + (group[group.length - 1].beat * beatWidth) + 4.5;
            const beamY = staffY - stemHeight;
            
            elements.push(
                <rect 
                    key={`triplet-beam-${groupIndex}`} 
                    x={firstNoteX} 
                    y={beamY - 2} 
                    width={lastNoteX - firstNoteX} 
                    height="4" 
                    fill="black" 
                />
            );

            // Add triplet bracket and numeral above the beam
            const centerX = (firstNoteX + lastNoteX) / 2;
            const bracketY = staffY - 35;
            
            // Triplet bracket
            elements.push(
                <line 
                    key={`triplet-bracket-line-${groupIndex}`} 
                    x1={firstNoteX - 5} y1={bracketY} 
                    x2={lastNoteX + 5} y2={bracketY} 
                    stroke="black" 
                    strokeWidth="1"
                />
            );
            elements.push(
                <line 
                    key={`triplet-bracket-left-${groupIndex}`} 
                    x1={firstNoteX - 5} y1={bracketY} 
                    x2={firstNoteX - 5} y2={bracketY + 3} 
                    stroke="black" 
                    strokeWidth="1"
                />
            );
            elements.push(
                <line 
                    key={`triplet-bracket-right-${groupIndex}`} 
                    x1={lastNoteX + 5} y1={bracketY} 
                    x2={lastNoteX + 5} y2={bracketY + 3} 
                    stroke="black" 
                    strokeWidth="1"
                />
            );
            
            // Triplet numeral "3"
            elements.push(
                <text
                    key={`triplet-number-${groupIndex}`}
                    x={centerX}
                    y={bracketY - 2}
                    fontSize="12px"
                    fontFamily="Times New Roman, serif" // Standard font for the numeral '3'
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="black"
                    fontWeight="bold"
                >
                    3
                </text>
            );
        });

        return elements;
    };

    return (
        <Card className="clay-card bg-white/80 w-full">
            <CardContent className="p-3 sm:p-4">
                <div className="text-center mb-3">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800">Which rhythm matches?</h3>
                </div>
                
                <div className="w-full flex justify-center">
                    <svg viewBox="0 0 300 60" width="100%" height="60px" className="overflow-visible bravura-font">
                        {/* Left barline */}
                        <line x1="20" y1="10" x2="20" y2="50" stroke="black" strokeWidth="2" />
                        {/* Main staff line */}
                        <line x1="20" y1="30" x2="280" y2="30" stroke="black" strokeWidth="1" />
                        {/* Right barline */}
                        <line x1="280" y1="10" x2="280" y2="50" stroke="black" strokeWidth="2" />
                        
                        {/* Render notes and rests */}
                        {renderNotesAndBeams()}
                    </svg>
                </div>
                
                <div className="text-center mt-3 text-xs sm:text-sm text-gray-600 font-semibold">
                    ♩ = {tempo} BPM
                </div>
            </CardContent>
        </Card>
    );
}
