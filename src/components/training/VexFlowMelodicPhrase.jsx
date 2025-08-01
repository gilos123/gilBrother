import React, { useEffect, useRef, useState } from 'react';

export default function VexFlowMelodicPhrase({ phrase, baseNote }) {
  const containerRef = useRef(null);
  const [vexFlowLoaded, setVexFlowLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.Vex) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/vexflow@4.2.0/build/cjs/vexflow.js';
      script.onload = () => setVexFlowLoaded(true);
      script.onerror = () => console.error('Failed to load VexFlow');
      document.head.appendChild(script);
    } else if (window.Vex) {
      setVexFlowLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current || !phrase || !vexFlowLoaded || !window.Vex) return;

    containerRef.current.innerHTML = '';

    try {
      const VF = window.Vex.Flow;
      const containerWidth = containerRef.current.offsetWidth;
      
      if (containerWidth < 300) return;

      const renderer = new VF.Renderer(containerRef.current, VF.Renderer.Backends.SVG);
      renderer.resize(containerWidth, 150);
      const context = renderer.getContext();
      
      const staveWidth = containerWidth * 0.9;
      const stave = new VF.Stave(10, 10, staveWidth);
      stave.addClef('treble');
      stave.setContext(context).draw();

      // **Design Change**: Validate phrase array
      if (!Array.isArray(phrase) || phrase.length === 0) {
        console.warn('Invalid phrase for VexFlow rendering:', phrase);
        return;
      }

      // **Design Change**: Create VexFlow notes with better validation
      const vexNotes = [];
      let totalDuration = 0;
      
      phrase.forEach((noteData, index) => {
        if (!noteData || typeof noteData !== 'object') {
          console.warn(`Invalid note data at index ${index}:`, noteData);
          return;
        }

        const noteName = noteData.note;
        const duration = noteData.duration || 1;
        
        // Convert duration to VexFlow notation
        let vexDuration = 'q';
        if (duration === 1) vexDuration = 'q';
        else if (duration === 0.5) vexDuration = '8';
        else if (duration === 2) vexDuration = 'h';
        else if (duration === 0.25) vexDuration = '16';
        
        if (!noteName || typeof noteName !== 'string') {
          console.warn(`Invalid note name at index ${index}:`, noteName);
          return;
        }

        const noteMatch = noteName.match(/([A-G][#b]?)(\d)/);
        let vexFlowKey = 'c/4';
        if (noteMatch) {
          const [, pitch, oct] = noteMatch;
          vexFlowKey = `${pitch.toLowerCase()}/${oct}`;
        }

        const staveNote = new VF.StaveNote({
          keys: [vexFlowKey],
          duration: vexDuration,
          clef: 'treble'
        });

        // Add accidentals if needed
        if (noteName.includes('#')) {
          staveNote.addModifier(new VF.Accidental('#'));
        } else if (noteName.includes('b')) {
          staveNote.addModifier(new VF.Accidental('b'));
        }

        vexNotes.push(staveNote);
        totalDuration += duration;
      });

      // **Design Change**: Ensure we have notes to render
      if (vexNotes.length === 0) {
        console.warn('No valid notes to render in melodic phrase');
        if (containerRef.current) {
          containerRef.current.innerHTML = '<div class="text-center p-4 text-gray-500">No notes to display</div>';
        }
        return;
      }

      // **Design Change**: Calculate proper voice beats
      // Use the actual total duration, with a minimum of 1 beat
      const voiceBeats = Math.max(1, Math.ceil(totalDuration));
      
      console.log('Melodic phrase - Total duration:', totalDuration, 'Voice beats:', voiceBeats);
      
      const voice = new VF.Voice({ 
        num_beats: voiceBeats, 
        beat_value: 4 
      });
      
      voice.addTickables(vexNotes);

      new VF.Formatter().joinVoices([voice]).format([voice], staveWidth - 20);
      voice.draw(context, stave);

      // Add beaming for consecutive eighth notes
      const eighthNotes = [];
      vexNotes.forEach((note, index) => {
        if (phrase[index] && phrase[index].duration === 0.5) {
          eighthNotes.push(note);
        } else {
          if (eighthNotes.length > 1) {
            const beam = new VF.Beam(eighthNotes);
            beam.setContext(context).draw();
          }
          eighthNotes.length = 0;
        }
      });
      
      // Handle remaining eighth notes
      if (eighthNotes.length > 1) {
        const beam = new VF.Beam(eighthNotes);
        beam.setContext(context).draw();
      }

    } catch (error) {
      console.error('VexFlow melodic phrase rendering error:', error);
      if (containerRef.current) {
        containerRef.current.innerHTML = `<div class="text-center p-4 text-red-500">Error rendering notation: ${error.message}</div>`;
      }
    }
  }, [phrase, baseNote, vexFlowLoaded]);

  return <div ref={containerRef} className="w-full h-full" />;
}