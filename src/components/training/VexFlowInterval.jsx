import React, { useEffect, useRef, useState } from 'react';

export default function VexFlowInterval({ notes, clef = 'treble', isOption = false }) {
  const containerRef = useRef(null);
  const [vexFlowLoaded, setVexFlowLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.Vex) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/vexflow@4.2.0/build/cjs/vexflow.js';
      script.async = true;
      script.onload = () => setVexFlowLoaded(true);
      document.head.appendChild(script);
    } else if (window.Vex) {
      setVexFlowLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (vexFlowLoaded && containerRef.current) {
      const VF = window.Vex.Flow;
      containerRef.current.innerHTML = ''; // Clear previous render

      const renderer = new VF.Renderer(containerRef.current, VF.Renderer.Backends.SVG);
      
      const staveHeight = isOption ? 100 : 150;
      renderer.resize(containerRef.current.offsetWidth, staveHeight);
      
      const context = renderer.getContext();
      const staveWidth = containerRef.current.offsetWidth * 0.9;
      const staveX = (containerRef.current.offsetWidth - staveWidth) / 2;
      const stave = new VF.Stave(staveX, 0, staveWidth);

      stave.addClef(clef);
      stave.setContext(context).draw();

      const vexNotes = notes.map(note => {
        const staveNote = new VF.StaveNote({
          keys: [`${note.pitch.toLowerCase()}/${note.octave}`],
          duration: 'h', // half note for better visual spacing
          clef: clef,
        });
        if (note.pitch.includes('#')) {
          staveNote.addModifier(new VF.Accidental('#'));
        } else if (note.pitch.includes('b')) {
          staveNote.addModifier(new VF.Accidental('b'));
        }
        return staveNote;
      });
      
      const voice = new VF.Voice({ num_beats: notes.length, beat_value: 2 });
      voice.addTickables(vexNotes);
      
      new VF.Formatter().joinVoices([voice]).format([voice], staveWidth - 40);
      
      voice.draw(context, stave);
    }
  }, [notes, clef, vexFlowLoaded, isOption, containerRef.current?.offsetWidth]);

  return <div ref={containerRef} className="w-full h-auto" />;
}