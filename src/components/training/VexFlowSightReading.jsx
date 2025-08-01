import React, { useEffect, useRef, useState } from 'react';

export default function VexFlowSightReading({ note }) {
  const containerRef = useRef(null);
  const [vexFlowLoaded, setVexFlowLoaded] = useState(false);
  const [containerWidth, setContainerWidth] = useState(300);

  // Effect to load VexFlow script
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

  // Effect to handle responsive resizing
  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      if (entries[0]) {
        const width = entries[0].contentRect.width;
        setContainerWidth(width > 100 ? width : 100);
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  // Effect to render the staff
  useEffect(() => {
    if (!containerRef.current || !note || !vexFlowLoaded || !window.Vex) return;

    containerRef.current.innerHTML = '';

    try {
      const VF = window.Vex.Flow;
      const renderer = new VF.Renderer(containerRef.current, VF.Renderer.Backends.SVG);
      const staveWidth = containerWidth * 0.9;
      renderer.resize(containerWidth, 150);

      const context = renderer.getContext();
      const stave = new VF.Stave(10, 10, staveWidth);
      stave.addClef('treble');
      stave.setContext(context).draw();

      const noteName = note.name || note.displayName;
      const noteMatch = noteName.match(/([A-G][#b]?)(\d)/);
      
      let vexFlowKey = 'c/4'; // Fallback
      if (noteMatch) {
        const [, pitch, oct] = noteMatch;
        vexFlowKey = `${pitch.toLowerCase()}/${oct}`;
      }

      const staveNote = new VF.StaveNote({
        keys: [vexFlowKey],
        duration: 'q',
        clef: 'treble'
      });

      if (noteName.includes('#')) {
        staveNote.addModifier(new VF.Accidental('#'));
      } else if (noteName.includes('b')) {
        staveNote.addModifier(new VF.Accidental('b'));
      }

      const voice = new VF.Voice({ num_beats: 1, beat_value: 4 });
      voice.addTickables([staveNote]);

      new VF.Formatter().joinVoices([voice]).format([voice], staveWidth - 20);
      voice.draw(context, stave);

    } catch (error) {
      console.error('VexFlow sight reading rendering error:', error);
      if (containerRef.current) {
        containerRef.current.innerHTML = '<div class="text-center p-10 text-red-600">Failed to render note.</div>';
      }
    }
  }, [note, vexFlowLoaded, containerWidth]);

  return (
    <div className="w-full flex justify-center p-4">
      <div className="clay-card bg-white/90 p-4 rounded-2xl w-full max-w-sm">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">What note is shown?</h3>
        </div>
        
        <div 
          ref={containerRef}
          className="vexflow-container flex justify-center"
          style={{ minHeight: '150px' }}
        />
      </div>
    </div>
  );
}