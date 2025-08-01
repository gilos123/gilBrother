
import React, { useEffect, useRef } from 'react';

// Helper to convert numeric duration to VexFlow string
const durationToVex = (duration) => {
    if (Math.abs(duration - 4) < 0.01) return 'w';
    if (Math.abs(duration - 2) < 0.01) return 'h';
    if (Math.abs(duration - 1) < 0.01) return 'q';
    if (Math.abs(duration - 0.5) < 0.01) return '8';
    if (Math.abs(duration - 0.25) < 0.01) return '16';
    return '16'; // Fallback
};

export default function VexFlowStaff({ rhythmPattern, tempo = 90, timeSignature = [4, 4], compact = false }) {
  const containerRef = useRef(null);
  const [vexFlowLoaded, setVexFlowLoaded] = React.useState(false);

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
    // Add comprehensive validation for rhythmPattern
    if (!containerRef.current || !vexFlowLoaded || !window.Vex) {
      return;
    }

    // Validate rhythmPattern is a proper array
    if (!rhythmPattern || !Array.isArray(rhythmPattern) || rhythmPattern.length === 0) {
      console.warn('VexFlowStaff: rhythmPattern is not a valid array:', rhythmPattern);
      if (containerRef.current) {
        containerRef.current.innerHTML = '<div class="text-center p-4 text-gray-500">No rhythm pattern to display</div>';
      }
      return;
    }

    let renderer;

    const draw = () => {
      if (!containerRef.current) return;
      containerRef.current.innerHTML = '';
      
      try {
        const VF = window.Vex.Flow;
        const containerWidth = containerRef.current.offsetWidth;
        
        if (containerWidth < 200) return;

        renderer = new VF.Renderer(containerRef.current, VF.Renderer.Backends.SVG);
        // **Design Change**: Increased compact height to accommodate full staff lines
        // Height increased from 100px to 120px to prevent bottom cutting
        const height = compact ? 120 : 150;
        renderer.resize(containerWidth, height);
        const context = renderer.getContext();
        
        // **Design Change**: Adjusted padding and positioning
        // Increased top padding to ensure staff lines are fully visible
        const sidePadding = compact ? 10 : 40;
        const staveWidth = Math.max(containerWidth - (2 * sidePadding), 200);

        const [beatsPerMeasure, beatValue] = timeSignature;
        const timeSignatureStr = `${beatsPerMeasure}/${beatValue}`;

        // **Design Change**: Increased top margin to prevent top cutting
        // Changed from 10px to 20px to ensure full staff visibility
        const staveY = compact ? 20 : 20;
        const stave = new VF.Stave(sidePadding, staveY, staveWidth);
        stave.addClef('percussion').addTimeSignature(timeSignatureStr);
        stave.setContext(context).draw();

        // **Design Change**: Fixed voice beat calculation
        // Calculate the actual total duration of all notes in the pattern
        const actualTotalDuration = rhythmPattern.reduce((sum, item) => {
          return sum + (item.duration || 0);
        }, 0);
        
        console.log('Rhythm pattern:', rhythmPattern);
        console.log('Calculated total duration:', actualTotalDuration);
        console.log('Expected beats per measure:', beatsPerMeasure);

        // **Design Change**: Use the actual duration or the expected beats, whichever is greater
        // This ensures the voice has the correct number of beats
        const voiceBeats = Math.max(actualTotalDuration, beatsPerMeasure);
        
        // Create VexFlow notes from the pattern
        const notes = [];
        const sortedPattern = [...rhythmPattern].sort((a, b) => (a.beat || 0) - (b.beat || 0));

        sortedPattern.forEach((item) => {
          // Validate item before processing
          if (!item || typeof item !== 'object' || typeof item.duration !== 'number') {
            console.warn('VexFlowStaff: Invalid rhythm item skipped:', item);
            return;
          }

          const isRest = item.type === 'rest';
          const durationVex = durationToVex(item.duration);
          
          const vexNote = new VF.StaveNote({
            keys: isRest ? ['b/4'] : ['g/4'],
            duration: isRest ? durationVex + 'r' : durationVex,
            clef: 'percussion'
          });
          notes.push(vexNote);
        });

        // **Design Change**: Ensure we have at least one note
        if (notes.length === 0) {
          console.warn('No valid notes found in rhythm pattern');
          if (containerRef.current) {
            containerRef.current.innerHTML = '<div class="text-center p-4 text-red-500">Invalid rhythm pattern</div>';
          }
          return;
        }

        // **Design Change**: Pad with rests if the actual duration is less than expected
        const notesDuration = notes.reduce((sum, note) => {
          const duration = note.duration; // Get the VexFlow duration string
          // Convert VexFlow duration string back to numeric value
          if (duration === 'w' || duration === 'wr') return sum + 4;
          if (duration === 'h' || duration === 'hr') return sum + 2;
          if (duration === 'q' || duration === 'qr') return sum + 1;
          if (duration === '8' || duration === '8r') return sum + 0.5;
          if (duration === '16' || duration === '16r') return sum + 0.25;
          return sum + 0; // Should not happen with valid durations, but defensive
        }, 0);

        console.log('Notes duration:', notesDuration, 'Voice beats:', voiceBeats);

        // **Design Change**: Add rests to fill the voice if needed
        let remainingBeats = voiceBeats - notesDuration;
        const epsilon = 0.001; // For floating point comparisons
        while (remainingBeats > epsilon) { 
          if (remainingBeats >= 4) { // Add whole rests first
            notes.push(new VF.StaveNote({ keys: ['b/4'], duration: 'wr', clef: 'percussion' }));
            remainingBeats -= 4;
          } else if (remainingBeats >= 2) { // Then half rests
            notes.push(new VF.StaveNote({ keys: ['b/4'], duration: 'hr', clef: 'percussion' }));
            remainingBeats -= 2;
          } else if (remainingBeats >= 1) { // Then quarter rests
            notes.push(new VF.StaveNote({ keys: ['b/4'], duration: 'qr', clef: 'percussion' }));
            remainingBeats -= 1;
          } else if (remainingBeats >= 0.5) { // Then eighth rests
            notes.push(new VF.StaveNote({ keys: ['b/4'], duration: '8r', clef: 'percussion' }));
            remainingBeats -= 0.5;
          } else if (remainingBeats >= 0.25) { // Then sixteenth rests
            notes.push(new VF.StaveNote({ keys: ['b/4'], duration: '16r', clef: 'percussion' }));
            remainingBeats -= 0.25;
          } else { 
            break; // Avoid infinite loop with very small remainders
          }
        }

        // **Design Change**: Create voice with exact beat count
        console.log('Creating voice with', voiceBeats, 'beats and', notes.length, 'notes');
        
        const voice = new VF.Voice({
          num_beats: voiceBeats, 
          beat_value: beatValue
        });
        
        voice.addTickables(notes);

        new VF.Formatter().joinVoices([voice]).format([voice], staveWidth - 40);
        
        // **Design Change**: Improved eighth-note beaming logic
        // Automatically groups consecutive eighth notes into beams of two.
        // This handles cases like three 8ths correctly (one beam, one flagged).
        const beams = VF.Beam.generateBeams(notes, {
          groups: [new VF.Fraction(2, 8)] // Group by 2 eighth notes
        });
        
        voice.draw(context, stave);

        beams.forEach(beam => {
          beam.setContext(context).draw();
        });

      } catch (e) {
        console.error('VexFlow rendering error:', e);
        if (containerRef.current) {
          containerRef.current.innerHTML = `<div class="text-red-500 text-sm p-2 text-center">Error rendering notation: ${e.message}</div>`;
        }
      }
    };

    const resizeObserver = new ResizeObserver(draw);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    draw();

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
      renderer = null;
    };
  }, [rhythmPattern, vexFlowLoaded, timeSignature, compact]);

  return <div ref={containerRef} className="w-full h-full" />;
}
