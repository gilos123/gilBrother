
export const INTERVALS = {
  'Perfect Unison': 0,
  'Minor Second': 1,
  'Major Second': 2,
  'Minor Third': 3,
  'Major Third': 4,
  'Perfect Fourth': 5,
  'Tritone': 6,
  'Perfect Fifth': 7,
  'Minor Sixth': 8,
  'Major Sixth': 9,
  'Minor Seventh': 10,
  'Major Seventh': 11,
  'Perfect Octave': 12
};

export const CHORDS = {
  'Major Triad': [0, 4, 7],
  'Minor Triad': [0, 3, 7],
  'Diminished Triad': [0, 3, 6],
  'Augmented Triad': [0, 4, 8],
  'Major 7th': [0, 4, 7, 11],
  'Minor 7th': [0, 3, 7, 10],
  'Dominant 7th': [0, 4, 7, 10]
};

// **Design Change**: Updated note frequency mapping for melodic phrases
// Added comprehensive frequency table for all notes used in the game
const NOTE_FREQUENCIES = {
  'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'D#3': 155.56,
  'E3': 164.81, 'F3': 174.61, 'F#3': 184.99, 'G3': 195.99,
  'G#3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'B3': 246.94,
  'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13,
  'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00,
  'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88,
  'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25,
  'E5': 659.25, 'F5': 698.46, 'F#5': 739.99, 'G5': 783.99,
  'G#5': 830.61, 'A5': 880.00, 'A#5': 932.33, 'B5': 987.77,
  'C6': 1046.50
};

export class AudioSynthesizer {
  constructor() {
    this.audioContext = null;
    this.gainNode = null; // Master gain node for general sounds/rhythm
    this.metronomeGainNode = null; // Master gain node for metronome clicks
    this.scheduledNotes = []; // For more precise scheduling and stopping of rhythm/metronome notes
    this.nextNoteTime = 0; // For scheduling
    this.lookahead = 25.0; // How frequently to call the scheduling function (in milliseconds)
    this.scheduleAheadTime = 0.1; // How far ahead to schedule audio (in seconds)
    this.isPlaying = false; // State for rhythm player
  }

  async initAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
      
      // Create main gain node
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      this.gainNode.gain.value = 0.3;
      
      // Significantly increase metronome volume
      this.metronomeGainNode = this.audioContext.createGain();
      this.metronomeGainNode.connect(this.audioContext.destination);
      this.metronomeGainNode.gain.value = 0.6; // Increased from 0.4 to 0.6
    }
  }

  stop() {
    if (this.audioContext) {
      this.scheduledNotes.forEach(({ source }) => {
        try {
          if (source && typeof source.stop === 'function') { // Ensure source is valid and has stop method
            source.stop();
          }
        } catch (e) {
          // Ignore errors from already stopped sources
        }
      });
      this.scheduledNotes = [];
      this.isPlaying = false;
    }
  }

  // ROBUST: Restored proper snare sound for rhythm
  // FIXED: Added sources to scheduledNotes for proper cleanup/stopping
  playSnareSound(time) {
    if (!this.audioContext) return;

    // Component 1: The Noise (The "snap" of the stick)
    const noise = this.audioContext.createBufferSource();
    const bufferSize = this.audioContext.sampleRate;
    const buffer = this.audioContext.createBuffer(1, bufferSize, bufferSize);
    const output = buffer.getChannelData(0);

    // Fill buffer with white noise
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    noise.buffer = buffer;

    // Filter the noise to make it sound sharp
    const bandpass = this.audioContext.createBiquadFilter();
    bandpass.type = 'highpass';
    bandpass.frequency.value = 1000;

    // Noise envelope for a very short, sharp sound
    const noiseGain = this.audioContext.createGain();
    noiseGain.gain.setValueAtTime(1, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.05);
    noise.connect(bandpass).connect(noiseGain).connect(this.audioContext.destination);

    // Component 2: The Tone (The "body" of the drum hit)
    const osc = this.audioContext.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, time); // The drum's fundamental tone

    const oscGain = this.audioContext.createGain();
    oscGain.gain.setValueAtTime(0.8, time);
    oscGain.gain.exponentialRampToValueAtTime(0.01, time + 0.08);
    osc.connect(oscGain).connect(this.audioContext.destination);

    // Start and stop everything to keep it short
    osc.start(time);
    noise.start(time);
    osc.stop(time + 0.2);
    noise.stop(time + 0.2);

    // Add sources to scheduledNotes for potential future stopping by stop() method
    // Even though they self-terminate, this ensures consistent cleanup if stop() is called early
    this.scheduledNotes.push({ source: noise, time: time + 0.2 });
    this.scheduledNotes.push({ source: osc, time: time + 0.2 });
  }

  async playInterval(baseFrequency, semitones, level = 1) {
    try {
      // Levels 1-5 play sequentially, 6 and up play harmonically
      if (level <= 5) {
        return await this.playIntervalSequentially(baseFrequency, semitones);
      } else {
        return await this.playIntervalHarmonically(baseFrequency, semitones);
      }
    } catch (error) {
      console.error("Error playing interval:", error);
      return 1000; // Return default duration
    }
  }

  async playIntervalSequentially(baseFrequency, semitones) {
    try {
      await this.initAudioContext();
      this.stop();

      const frequency1 = baseFrequency;
      const frequency2 = baseFrequency * Math.pow(2, semitones / 12);
      const noteDuration = 0.8;
      const pauseDuration = 0.2;

      // Play first note
      await this.playTone(frequency1, noteDuration);
      // Brief pause
      await new Promise(resolve => setTimeout(resolve, pauseDuration * 1000));
      // Play second note
      await this.playTone(frequency2, noteDuration);

      return (noteDuration * 2 + pauseDuration) * 1000;
    } catch (error) {
      console.error("Error playing interval sequentially:", error);
      return 2000; // Return default duration
    }
  }

  async playIntervalHarmonically(baseFrequency, semitones) {
    try {
      await this.initAudioContext();
      this.stop();
      const duration = 1.5;

      const frequencies = [
        baseFrequency,
        baseFrequency * Math.pow(2, semitones / 12)
      ];

      this.playMultipleTones(frequencies, duration);
      return duration * 1000;
    } catch (error) {
      console.error("Error playing interval harmonically:", error);
      return 1500; // Return default duration
    }
  }

  async playChord(baseFrequency, offsets, inversion = 'root') {
    try {
      await this.initAudioContext();
      this.stop();

      // Handle special chord types for mini lessons
      if (offsets === 'diminished') {
        offsets = [0, 3, 6]; // Diminished triad
      } else if (offsets === 'augmented') {
        offsets = [0, 4, 8]; // Augmented triad
      } else if (offsets === 'major') {
        offsets = [0, 4, 7]; // Major triad
      } else if (offsets === 'minor') {
        offsets = [0, 3, 7]; // Minor triad
      }

      // FIXED: Implement chord inversions
      let finalOffsets = [...offsets];
      if (inversion === 'first' && finalOffsets.length >= 3) {
        // Move the root note up an octave
        finalOffsets.push(finalOffsets.shift() + 12);
      } else if (inversion === 'second' && finalOffsets.length >= 3) {
        // Move root and third up an octave
        finalOffsets.push(finalOffsets.shift() + 12);
        finalOffsets.push(finalOffsets.shift() + 12);
      }
      finalOffsets.sort((a, b) => a - b);


      const frequencies = finalOffsets.map(offset =>
        baseFrequency * Math.pow(2, offset / 12)
      );

      const duration = 2.0;
      this.playMultipleTones(frequencies, duration);
      return duration * 1000;
    } catch (error) {
      console.error("Error playing chord:", error);
      return 2000;
    }
  }

  playMultipleTones(frequencies, duration) {
    try {
      if (!this.audioContext) return;

      const currentTime = this.audioContext.currentTime;

      frequencies.forEach((freq) => {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.frequency.setValueAtTime(freq, currentTime);
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0, currentTime);
        gainNode.gain.linearRampToValueAtTime(0.15, currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination); // Connects directly to destination

        oscillator.start(currentTime);
        oscillator.stop(currentTime + duration);
      });
    } catch (error) {
      console.error("Error playing multiple tones:", error);
    }
  }

  async playTone(frequency, duration) {
    try {
      await this.initAudioContext();
      if (!this.audioContext) return;

      return new Promise((resolve) => {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        oscillator.type = 'sine';

        const currentTime = this.audioContext.currentTime;

        gainNode.gain.setValueAtTime(0, currentTime);
        gainNode.gain.linearRampToValueAtTime(0.2, currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination); // Connects directly to destination

        oscillator.start(currentTime);
        oscillator.stop(currentTime + duration);

        oscillator.onended = () => resolve();
      });
    } catch (error) {
      console.error("Error playing tone:", error);
      return Promise.resolve();
    }
  }

  // COMPLETELY REWRITTEN: Fixed rhythm pattern playback with correct triplet timing
  async playRhythmPattern(pattern, bpm = 120, withMetronome = false) {
    try {
      await this.initAudioContext();
      
      const beatDuration = 60 / bpm; // Duration of one quarter note beat
      const totalDuration = 4 * beatDuration * 1000; // Total pattern duration in ms
      
      this.isPlaying = true;
      this.nextNoteTime = this.audioContext.currentTime;
      
      // FIXED: Sort pattern by beat time first
      const sortedPattern = [...pattern].sort((a, b) => a.beat - b.beat);
      
      console.log('Playing rhythm pattern:', sortedPattern.map(item => ({
        type: item.type,
        beat: item.beat,
        duration: item.duration,
        triplet: item.triplet || false
      })));
      
      // Schedule metronome if requested - LOUDER
      if (withMetronome) {
        for (let beat = 0; beat < 4; beat++) {
          const noteTime = this.nextNoteTime + (beat * beatDuration);
          this.scheduleMetronomeClick(noteTime, beat === 0);
        }
      }
      
      // FIXED: Schedule rhythm notes with precise beat timing
      sortedPattern.forEach(item => {
        if (item.type === 'note') {
          // Convert beat position to actual time
          const noteTime = this.nextNoteTime + (item.beat * beatDuration);
          
          console.log(`Scheduling ${item.triplet ? 'triplet' : 'regular'} note at beat ${item.beat} (time: ${noteTime - this.nextNoteTime}s)`);
          
          // Play the snare sound at the calculated time
          this.playSnareSound(noteTime);
        }
      });
      
      return totalDuration;
    } catch (error) {
      console.error('Error in playRhythmPattern:', error);
      this.isPlaying = false;
      return 2000;
    }
  }

  scheduleMetronomeClick(time, isDownbeat = false) {
    if (!this.audioContext || !this.metronomeGainNode) return;

    const oscillator = this.audioContext.createOscillator();
    const clickGain = this.audioContext.createGain();
    
    oscillator.connect(clickGain);
    clickGain.connect(this.metronomeGainNode);
    
    oscillator.frequency.setValueAtTime(isDownbeat ? 1200 : 800, time); // Higher pitch for downbeat
    oscillator.type = 'sine';
    
    clickGain.gain.setValueAtTime(0, time);
    clickGain.gain.linearRampToValueAtTime(0.8, time + 0.01); // Much louder click
    clickGain.gain.exponentialRampToValueAtTime(0.01, time + 0.08);
    
    oscillator.start(time);
    oscillator.stop(time + 0.08);
    
    this.scheduledNotes.push({ source: oscillator, time });
  }

  // FIXED: Added the missing playMetronomeClick method
  async playMetronomeClick() {
    if (!this.audioContext) await this.initAudioContext();
    if (!this.audioContext || !this.metronomeGainNode) return; // Ensure metronomeGainNode is initialized

    const clickTime = this.audioContext.currentTime;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1000, clickTime); // High pitch for a "click"
    gain.gain.setValueAtTime(1, clickTime);
    gain.gain.exponentialRampToValueAtTime(0.001, clickTime + 0.05);

    osc.connect(gain);
    gain.connect(this.metronomeGainNode); // Connect to metronomeGainNode as per existing methods

    osc.start(clickTime);
    osc.stop(clickTime + 0.05);
  }
  
  // **Design Change**: Completely rewritten melodic phrase playback
  // Fixed timing issues and audio context problems that caused single-note playback
  async playMelodicPhrase(phrase) {
    try {
      // Ensure audio context is properly initialized
      await this.initAudioContext();
      
      if (!this.audioContext || !phrase || !Array.isArray(phrase) || phrase.length === 0) {
        console.warn('Invalid phrase or audio context for melodic playback');
        return;
      }

      // Stop any existing audio without destroying context
      this.stop();
      
      console.log('Starting melodic phrase playback:', phrase);

      const startTime = this.audioContext.currentTime + 0.1;
      const beatDuration = 0.6; // 100 BPM
      let currentTime = startTime;

      // **Design Change**: Sequential note scheduling with proper timing
      // Each note is scheduled with precise timing to ensure full phrase playback
      for (let i = 0; i < phrase.length; i++) {
        const noteData = phrase[i];
        
        if (!noteData || typeof noteData !== 'object') {
          console.warn('Invalid note data at index', i, ':', noteData);
          continue;
        }

        const noteName = noteData.note;
        const duration = noteData.duration || 1;

        if (!noteName || typeof noteName !== 'string') {
          console.warn('Invalid note name at index', i, ':', noteName);
          continue;
        }

        // Get frequency for the note
        const frequency = NOTE_FREQUENCIES[noteName];
        if (!frequency || !isFinite(frequency)) {
          console.warn(`No frequency found for note: ${noteName}`);
          continue;
        }

        console.log(`Scheduling note ${i + 1}/${phrase.length}: ${noteName} at ${frequency}Hz for ${duration} beats at time ${currentTime.toFixed(3)}`);

        // **Design Change**: Create and schedule individual note with validated parameters
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.frequency.setValueAtTime(frequency, currentTime);
        oscillator.type = 'sine';
        
        const noteDurationInSeconds = duration * beatDuration;
        const noteEndTime = currentTime + noteDurationInSeconds;

        // **Design Change**: Proper envelope with validated timing
        if (isFinite(currentTime) && isFinite(noteEndTime) && noteEndTime > currentTime) {
          gainNode.gain.setValueAtTime(0, currentTime);
          gainNode.gain.linearRampToValueAtTime(0.2, currentTime + 0.05);
          gainNode.gain.exponentialRampToValueAtTime(0.001, noteEndTime - 0.05);
        } else {
          console.warn('Invalid timing for note:', { currentTime, noteEndTime });
          continue;
        }

        // Connect and schedule
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.start(currentTime);
        oscillator.stop(noteEndTime);

        // Track for cleanup
        this.scheduledNotes.push({ source: oscillator, time: noteEndTime });
        
        // **Design Change**: Move to next note timing with small gap
        currentTime = noteEndTime + 0.05;
      }
      
      console.log('All notes scheduled successfully');
      
      // **Design Change**: Return promise that resolves when phrase completes
      const totalDuration = (currentTime - startTime) * 1000;
      return new Promise(resolve => {
        setTimeout(() => {
          console.log('Melodic phrase playback completed');
          resolve();
        }, Math.max(totalDuration, 100));
      });

    } catch (error) {
      console.error("Error in playMelodicPhrase:", error);
      throw error;
    }
  }

  // **Design Change**: Added method to close the audio context on cleanup
  // This prevents memory leaks and ensures the audio context is properly disposed of.
  async closeAudioContext() {
    if (this.audioContext && this.audioContext.state !== 'closed') {
      try {
        await this.audioContext.close();
        this.audioContext = null;
        console.log('AudioContext closed successfully.');
      } catch (e) {
        console.error('Error closing AudioContext:', e);
      }
    }
  }
}
