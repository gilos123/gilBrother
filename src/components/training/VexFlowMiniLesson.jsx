
import React, { useEffect, useRef, useState } from 'react';

// Helper function to format note strings like "C#4" into VexFlow's "c#/4" format
const formatVexflowKey = (note) => {
  if (!note || note.length < 2) return 'c/4';
  return `${note.slice(0, -1).toLowerCase()}/${note.slice(-1)}`;
};

export default function VexFlowMiniLesson({ visual }) {
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
    if (!containerRef.current || !visual || !vexFlowLoaded || !window.Vex) {
      return;
    }

    try {
      const VF = window.Vex.Flow;
      containerRef.current.innerHTML = '';

      const renderer = new VF.Renderer(containerRef.current, VF.Renderer.Backends.SVG);
      const notationWidth = 500;
      renderer.resize(notationWidth, 200);
      const context = renderer.getContext();

      // COMPLETELY NEW APPROACH: Create separate simple displays for each type
      if (visual.type === 'intervals') {
        renderIntervalsSeparately(VF, context, visual.intervals, notationWidth);
      } else if (visual.type === 'chords') {
        renderChordsSeparately(VF, context, visual.chords, notationWidth);
      } else if (visual.type === 'staff_basics') {
        renderNotesSeparately(VF, context, visual.notes, notationWidth);
      } else if (visual.type === 'accidentals') {
        renderNotesSeparately(VF, context, visual.notes, notationWidth);
      } else if (visual.type === 'geography_intervals') {
        renderIntervalsSeparately(VF, context, visual.intervals, notationWidth);
      } else if (visual.type === 'interval_counting') {
        renderIntervalsSeparately(VF, context, visual.examples, notationWidth);
      } else if (visual.type === 'rhythm_basics') {
        renderRhythmSeparately(VF, context, visual.pattern, notationWidth);
      }
    } catch (error) {
      console.error('VexFlow mini lesson rendering error:', error);
      if (containerRef.current) {
        containerRef.current.innerHTML = '<div class="text-center p-6 text-red-600">Failed to render notation.</div>';
      }
    }
  }, [visual, vexFlowLoaded]);

  // NEW: Render each interval as a separate harmonic interval (chord)
  const renderIntervalsSeparately = (VF, context, intervals, width) => {
    const staveWidth = width - 40;
    const stave = new VF.Stave(20, 40, staveWidth);
    stave.addClef('treble');
    stave.setContext(context).draw();

    // FIXED: Only show first 2 intervals, render as harmonic intervals (chords)
    const limitedIntervals = intervals.slice(0, 2);
    const chordNotes = [];

    limitedIntervals.forEach(interval => {
      try {
        // Create harmonic interval (both notes played together as a chord)
        const chordNote = new VF.StaveNote({
          keys: [formatVexflowKey(interval.from), formatVexflowKey(interval.to)],
          duration: 'h' // Half note
        });

        // Add accidentals
        if (interval.from.includes('#')) chordNote.addModifier(new VF.Accidental('#'), 0);
        if (interval.from.includes('b')) chordNote.addModifier(new VF.Accidental('b'), 0);
        if (interval.to.includes('#')) chordNote.addModifier(new VF.Accidental('#'), 1);
        if (interval.to.includes('b')) chordNote.addModifier(new VF.Accidental('b'), 1);

        chordNotes.push(chordNote);
      } catch (err) {
        console.error('Error creating interval chord:', err);
      }
    });

    if (chordNotes.length > 0) {
      try {
        // FIXED: Create voice with exact number of beats needed
        const totalBeats = chordNotes.length * 2; // 2 beats per half note
        const voice = new VF.Voice({ num_beats: totalBeats, beat_value: 4 });
        voice.addTickables(chordNotes);
        
        const formatter = new VF.Formatter();
        formatter.joinVoices([voice]).format([voice], staveWidth - 80);
        voice.draw(context, stave);
      } catch (voiceError) {
        console.error('Voice rendering error:', voiceError);
        // Fallback: render without voice
        chordNotes.forEach((note, index) => {
          try {
            note.setStave(stave);
            note.setContext(context);
            note.draw();
          } catch (noteError) {
            console.error('Note rendering error:', noteError);
          }
        });
      }
    }

    // Add labels
    limitedIntervals.forEach((interval, index) => {
      const x_position = 60 + (index * 150);
      context.fillText(interval.label, x_position, 180);
    });
  };

  // NEW: Render chords more safely
  const renderChordsSeparately = (VF, context, chords, width) => {
    const staveWidth = width - 40;
    const stave = new VF.Stave(20, 40, staveWidth);
    stave.addClef('treble');
    stave.setContext(context).draw();

    const limitedChords = chords.slice(0, 2);
    const chordNotes = [];

    limitedChords.forEach(chordData => {
      try {
        const keys = chordData.notes.map(formatVexflowKey);
        const chordNote = new VF.StaveNote({ 
          keys, 
          duration: 'h' // Half note
        });
        
        chordData.notes.forEach((noteName, i) => {
          if (noteName.includes('#')) chordNote.addModifier(new VF.Accidental('#'), i);
          if (noteName.includes('b')) chordNote.addModifier(new VF.Accidental('b'), i);
        });
        
        chordNotes.push(chordNote);
      } catch (err) {
        console.error('Error creating chord:', err);
      }
    });

    if (chordNotes.length > 0) {
      try {
        const totalBeats = chordNotes.length * 2; // 2 beats per half note
        const voice = new VF.Voice({ num_beats: totalBeats, beat_value: 4 });
        voice.addTickables(chordNotes);
        
        const formatter = new VF.Formatter();
        formatter.joinVoices([voice]).format([voice], staveWidth - 80);
        voice.draw(context, stave);
      } catch (voiceError) {
        console.error('Chord voice error:', voiceError);
      }
    }

    limitedChords.forEach((chord, index) => {
      const x_position = 60 + (index * 150);
      context.fillText(chord.label, x_position, 180);
    });
  };

  // FIXED: A robust renderer for individual notes that avoids timing errors
  const renderNotesSeparately = (VF, context, notesList, width) => {
    const staveWidth = width - 40;
    const stave = new VF.Stave(20, 40, staveWidth);

    // Limit to 4 notes to keep it clean
    const limitedNotes = notesList.slice(0, 4);

    // Create a dynamic time signature based on the number of notes
    stave.addClef('treble').addTimeSignature(`${limitedNotes.length}/4`);
    stave.setContext(context).draw();

    const vexNotes = [];
    limitedNotes.forEach(noteData => {
      try {
        const note = new VF.StaveNote({
          keys: [formatVexflowKey(noteData.note || noteData.label)],
          duration: 'q' // Quarter note
        });

        if (noteData.note && noteData.note.includes('#')) {
          note.addModifier(new VF.Accidental('#'), 0);
        }
        if (noteData.note && noteData.note.includes('b')) {
          note.addModifier(new VF.Accidental('b'), 0);
        }
        vexNotes.push(note);
      } catch (err) {
        console.error('Error creating note:', err);
      }
    });

    if (vexNotes.length > 0) {
      try {
        // Create a voice that perfectly matches the number of notes
        const voice = new VF.Voice({ num_beats: vexNotes.length, beat_value: 4 });
        voice.addTickables(vexNotes);
        
        const formatter = new VF.Formatter();
        formatter.joinVoices([voice]).format([voice], staveWidth - 80);
        voice.draw(context, stave);

        // Add labels
        limitedNotes.forEach((noteData, index) => {
          if (vexNotes[index]) {
            const x_position = vexNotes[index].getAbsoluteX();
            context.fillText(noteData.label, x_position, 170);
          }
        });
      } catch (voiceError) {
        console.error('Notes voice error:', voiceError);
      }
    }
  };

  // FIXED: A robust renderer for rhythm patterns with better spacing
  const renderRhythmSeparately = (VF, context, pattern, width) => {
    const staveWidth = width - 40;
    const stave = new VF.Stave(20, 40, staveWidth);

    // Calculate total beats to create a perfectly sized measure
    const totalBeats = pattern.reduce((sum, item) => sum + item.duration, 0);

    stave.addClef('percussion').addTimeSignature(`${totalBeats}/4`);
    stave.setContext(context).draw();

    const vexNotes = [];
    pattern.forEach(item => {
      let vexDuration;
      if (item.duration === 4) vexDuration = 'w';
      else if (item.duration === 2) vexDuration = 'h';
      else if (item.duration === 1) vexDuration = 'q';
      else if (item.duration === 0.5) vexDuration = '8';
      else return;

      const isRest = item.type === 'rest';
      const note = new VF.StaveNote({
        keys: [isRest ? 'b/4' : 'g/4'],
        duration: isRest ? `${vexDuration}r` : vexDuration,
        clef: 'percussion'
      });
      vexNotes.push(note);
    });

    if (vexNotes.length > 0) {
      try {
        // Create a voice that perfectly matches the total duration
        const voice = new VF.Voice({ num_beats: totalBeats, beat_value: 4 });
        voice.addTickables(vexNotes);
        
        new VF.Formatter().joinVoices([voice]).format([voice], staveWidth - 80);
        voice.draw(context, stave);

        // FIXED: Add labels with better spacing - closer together
        pattern.forEach((item, index) => {
          if (vexNotes[index]) {
            const x_position = vexNotes[index].getAbsoluteX();
            context.fillText(item.name, x_position - 10, 170); // Moved 10px left for better alignment
          }
        });
      } catch (voiceError) {
        console.error('Rhythm voice error:', voiceError);
      }
    }
  };

  return (
    <div className="clay-card bg-white/90 p-2 rounded-2xl">
      <div className="overflow-x-auto">
        <div 
          ref={containerRef}
          className="w-full"
          style={{ minHeight: '180px', minWidth: '500px' }}
        />
      </div>
    </div>
  );
}
