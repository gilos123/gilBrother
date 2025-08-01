
// Updated difficulty system with 20 levels for each module (30 for sight reading)

// --- EAR TRAINING LEVELS (RESTRUCTUREED) ---
const EAR_TRAINING_LEVELS = {
  // Levels 1-5: Basic intervals only (2nds, 4ths, 5ths) + Major/Minor triads
  1: { intervals: ['Major Second', 'Minor Second', 'Perfect Fourth', 'Perfect Fifth'], chords: ['Major Triad', 'Minor Triad'] },
  2: { intervals: ['Major Second', 'Minor Second', 'Perfect Fourth', 'Perfect Fifth'], chords: ['Major Triad', 'Minor Triad'] },
  3: { intervals: ['Major Second', 'Minor Second', 'Perfect Fourth', 'Perfect Fifth'], chords: ['Major Triad', 'Minor Triad'] },
  4: { intervals: ['Major Second', 'Minor Second', 'Perfect Fourth', 'Perfect Fifth'], chords: ['Major Triad', 'Minor Triad'] },
  5: { intervals: ['Major Second', 'Minor Second', 'Perfect Fourth', 'Perfect Fifth'], chords: ['Major Triad', 'Minor Triad'] },
  
  // Levels 6-10: Add 3rds, 6ths, octave + Diminished/Augmented triads
  6: { intervals: ['Major Second', 'Minor Second', 'Major Third', 'Minor Third', 'Perfect Fourth', 'Perfect Fifth', 'Major Sixth', 'Minor Sixth', 'Perfect Octave'], chords: ['Major Triad', 'Minor Triad', 'Diminished Triad', 'Augmented Triad'] },
  7: { intervals: ['Major Second', 'Minor Second', 'Major Third', 'Minor Third', 'Perfect Fourth', 'Perfect Fifth', 'Major Sixth', 'Minor Sixth', 'Perfect Octave'], chords: ['Major Triad', 'Minor Triad', 'Diminished Triad', 'Augmented Triad'] },
  8: { intervals: ['Major Second', 'Minor Second', 'Major Third', 'Minor Third', 'Perfect Fourth', 'Perfect Fifth', 'Major Sixth', 'Minor Sixth', 'Perfect Octave'], chords: ['Major Triad', 'Minor Triad', 'Diminished Triad', 'Augmented Triad'] },
  9: { intervals: ['Major Second', 'Minor Second', 'Major Third', 'Minor Third', 'Perfect Fourth', 'Perfect Fifth', 'Major Sixth', 'Minor Sixth', 'Perfect Octave'], chords: ['Major Triad', 'Minor Triad', 'Diminished Triad', 'Augmented Triad'] },
  10: { intervals: ['Major Second', 'Minor Second', 'Major Third', 'Minor Third', 'Perfect Fourth', 'Perfect Fifth', 'Major Sixth', 'Minor Sixth', 'Perfect Octave'], chords: ['Major Triad', 'Minor Triad', 'Diminished Triad', 'Augmented Triad'] },
  
  // Levels 11-15: Add all intervals including tritone and 7thds + 7th chords
  11: { intervals: ['Perfect Unison', 'Minor Second', 'Major Second', 'Minor Third', 'Major Third', 'Perfect Fourth', 'Tritone', 'Perfect Fifth', 'Minor Sixth', 'Major Sixth', 'Minor Seventh', 'Major Seventh', 'Perfect Octave'], chords: ['Major Triad', 'Minor Triad', 'Diminished Triad', 'Augmented Triad', 'Major 7th', 'Minor 7th', 'Dominant 7th'] },
  12: { intervals: ['Perfect Unison', 'Minor Second', 'Major Second', 'Minor Third', 'Major Third', 'Perfect Fourth', 'Tritone', 'Perfect Fifth', 'Minor Sixth', 'Major Sixth', 'Minor Seventh', 'Major Seventh', 'Perfect Octave'], chords: ['Major Triad', 'Minor Triad', 'Diminished Triad', 'Augmented Triad', 'Major 7th', 'Minor 7th', 'Dominant 7th'] },
  13: { intervals: ['Perfect Unison', 'Minor Second', 'Major Second', 'Minor Third', 'Major Third', 'Perfect Fourth', 'Tritone', 'Perfect Fifth', 'Minor Sixth', 'Major Sixth', 'Minor Seventh', 'Major Seventh', 'Perfect Octave'], chords: ['Major Triad', 'Minor Triad', 'Diminished Triad', 'Augmented Triad', 'Major 7th', 'Minor 7th', 'Dominant 7th'] },
  14: { intervals: ['Perfect Unison', 'Minor Second', 'Major Second', 'Minor Third', 'Major Third', 'Perfect Fourth', 'Tritone', 'Perfect Fifth', 'Minor Sixth', 'Major Sixth', 'Minor Seventh', 'Major Seventh', 'Perfect Octave'], chords: ['Major Triad', 'Minor Triad', 'Diminished Triad', 'Augmented Triad', 'Major 7th', 'Minor 7th', 'Dominant 7th'] },
  15: { intervals: ['Perfect Unison', 'Minor Second', 'Major Second', 'Minor Third', 'Major Third', 'Perfect Fourth', 'Tritone', 'Perfect Fifth', 'Minor Sixth', 'Major Sixth', 'Minor Seventh', 'Major Seventh', 'Perfect Octave'], chords: ['Major Triad', 'Minor Triad', 'Diminished Triad', 'Augmented Triad', 'Major 7th', 'Minor 7th', 'Dominant 7th'] },
  
  // Levels 16-20: Master level with inversions and advanced chord voicings
  16: { intervals: ['Perfect Unison', 'Minor Second', 'Major Second', 'Minor Third', 'Major Third', 'Perfect Fourth', 'Tritone', 'Perfect Fifth', 'Minor Sixth', 'Major Sixth', 'Minor Seventh', 'Major Seventh', 'Perfect Octave'], chords: ['Major Triad', 'Minor Triad', 'Diminished Triad', 'Augmented Triad', 'Major 7th', 'Minor 7th', 'Dominant 7th'], inversions: true },
  17: { intervals: ['Perfect Unison', 'Minor Second', 'Major Second', 'Minor Third', 'Major Third', 'Perfect Fourth', 'Tritone', 'Perfect Fifth', 'Minor Sixth', 'Major Sixth', 'Minor Seventh', 'Major Seventh', 'Perfect Octave'], chords: ['Major Triad', 'Minor Triad', 'Diminished Triad', 'Augmented Triad', 'Major 7th', 'Minor 7th', 'Dominant 7th'], inversions: true },
  18: { intervals: ['Perfect Unison', 'Minor Second', 'Major Second', 'Minor Third', 'Major Third', 'Perfect Fourth', 'Tritone', 'Perfect Fifth', 'Minor Sixth', 'Major Sixth', 'Minor Seventh', 'Major Seventh', 'Perfect Octave'], chords: ['Major Triad', 'Minor Triad', 'Diminished Triad', 'Augmented Triad', 'Major 7th', 'Minor 7th', 'Dominant 7th'], inversions: true },
  19: { intervals: ['Perfect Unison', 'Minor Second', 'Major Second', 'Minor Third', 'Major Third', 'Perfect Fourth', 'Tritone', 'Perfect Fifth', 'Minor Sixth', 'Major Sixth', 'Minor Seventh', 'Major Seventh', 'Perfect Octave'], chords: ['Major Triad', 'Minor Triad', 'Diminished Triad', 'Augmented Triad', 'Major 7th', 'Minor 7th', 'Dominant 7th'], inversions: true },
  20: { intervals: ['Perfect Unison', 'Minor Second', 'Major Second', 'Minor Third', 'Major Third', 'Perfect Fourth', 'Tritone', 'Perfect Fifth', 'Minor Sixth', 'Major Sixth', 'Minor Seventh', 'Major Seventh', 'Perfect Octave'], chords: ['Major Triad', 'Minor Triad', 'Diminished Triad', 'Augmented Triad', 'Major 7th', 'Minor 7th', 'Dominant 7th'], inversions: true, bossLevel: true }
};

// --- SIGHT READING LEVELS - EXPANDED TO 30 LEVELS ---
const SIGHT_READING_LEVELS = {
  // Levels 1-5: C4-A4, 10s timer (Very Basic Range)
  1: { noteRange: 'very_basic', timer: 10, accidentals: false },
  2: { noteRange: 'very_basic', timer: 10, accidentals: false },
  3: { noteRange: 'very_basic', timer: 10, accidentals: false },
  4: { noteRange: 'very_basic', timer: 10, accidentals: false },
  5: { noteRange: 'very_basic', timer: 10, accidentals: false },
  
  // Levels 6-10: C4-G5, 10s timer (Expanded Basic Range)
  6: { noteRange: 'basic', timer: 10, accidentals: false },
  7: { noteRange: 'basic', timer: 10, accidentals: false },
  8: { noteRange: 'basic', timer: 10, accidentals: false },
  9: { noteRange: 'basic', timer: 10, accidentals: false },
  10: { noteRange: 'basic', timer: 10, accidentals: false },
  
  // Levels 11-15: C4-G5 with accidentals, 8s timer
  11: { noteRange: 'basic', timer: 8, accidentals: true },
  12: { noteRange: 'basic', timer: 8, accidentals: true },
  13: { noteRange: 'basic', timer: 8, accidentals: true },
  14: { noteRange: 'basic', timer: 8, accidentals: true },
  15: { noteRange: 'basic', timer: 8, accidentals: true },
  
  // Levels 16-20: Add ledger lines, 10s timer
  16: { noteRange: 'extended', timer: 10, accidentals: true },
  17: { noteRange: 'extended', timer: 10, accidentals: true },
  18: { noteRange: 'extended', timer: 10, accidentals: true },
  19: { noteRange: 'extended', timer: 10, accidentals: true },
  20: { noteRange: 'extended', timer: 10, accidentals: true },
  
  // Levels 21-24: Full range with enharmonics, 8s timer
  21: { noteRange: 'full', timer: 8, accidentals: true, enharmonic: true },
  22: { noteRange: 'full', timer: 8, accidentals: true, enharmonic: true },
  23: { noteRange: 'full', timer: 8, accidentals: true, enharmonic: true },
  24: { noteRange: 'full', timer: 8, accidentals: true, enharmonic: true },
  
  // Levels 25-28: Full range with enharmonics, 6s timer
  25: { noteRange: 'full', timer: 6, accidentals: true, enharmonic: true },
  26: { noteRange: 'full', timer: 6, accidentals: true, enharmonic: true },
  27: { noteRange: 'full', timer: 6, accidentals: true, enharmonic: true },
  28: { noteRange: 'full', timer: 6, accidentals: true, enharmonic: true },
  
  // Levels 29-30: Master level - Full range with enharmonics, 5s timer
  29: { noteRange: 'full', timer: 5, accidentals: true, enharmonic: true },
  30: { noteRange: 'full', timer: 5, accidentals: true, enharmonic: true, bossLevel: true }
};

// --- RHYTHM TRAINING LEVELS ---
const RHYTHM_TRAINING_LEVELS = {
  // Levels 1-5: Quarter and Half notes/rests
  1: { noteTypes: ['quarter', 'half'], complexity: 2 },
  2: { noteTypes: ['quarter', 'half'], complexity: 3 },
  3: { noteTypes: ['quarter', 'half'], complexity: 3 },
  4: { noteTypes: ['quarter', 'half'], complexity: 4 },
  5: { noteTypes: ['quarter', 'half'], complexity: 4 },
  
  // Levels 6-10: Add eighth notes/rests
  6: { noteTypes: ['quarter', 'half', 'eighth'], complexity: 4 },
  7: { noteTypes: ['quarter', 'half', 'eighth'], complexity: 5 },
  8: { noteTypes: ['quarter', 'half', 'eighth'], complexity: 5 },
  9: { noteTypes: ['quarter', 'half', 'eighth'], complexity: 6 },
  10: { noteTypes: ['quarter', 'half', 'eighth'], complexity: 6 },
  
  // Levels 11-15: Add syncopation
  11: { noteTypes: ['quarter', 'half', 'eighth'], complexity: 6, syncopation: true },
  12: { noteTypes: ['quarter', 'half', 'eighth'], complexity: 7, syncopation: true },
  13: { noteTypes: ['quarter', 'half', 'eighth'], complexity: 7, syncopation: true },
  14: { noteTypes: ['quarter', 'half', 'eighth'], complexity: 8, syncopation: true },
  15: { noteTypes: ['quarter', 'half', 'eighth'], complexity: 8, syncopation: true },
  
  // Levels 16-20: Add triplets
  16: { noteTypes: ['quarter', 'half', 'eighth', 'triplet'], complexity: 8, syncopation: true },
  17: { noteTypes: ['quarter', 'half', 'eighth', 'triplet'], complexity: 9, syncopation: true },
  18: { noteTypes: ['quarter', 'half', 'eighth', 'triplet'], complexity: 9, syncopation: true },
  19: { noteTypes: ['quarter', 'half', 'eighth', 'triplet'], complexity: 10, syncopation: true },
  20: { noteTypes: ['quarter', 'half', 'eighth', 'triplet'], complexity: 10, syncopation: true, bossLevel: true }
};

// Define a mapping from RHYTHM_TRAINING_LEVELS to the new structure needed by the rhythm pattern generator
const RHYTHM_PATTERN_CONFIGS = {};

for (let i = 1; i <= 20; i++) {
  const levelConfig = RHYTHM_TRAINING_LEVELS[i];
  const units = [];

  if (levelConfig.noteTypes.includes('quarter')) {
    units.push({ type: 'note', duration: 1, name: 'Quarter Note' });
    units.push({ type: 'rest', duration: 1, name: 'Quarter Rest' });
  }
  if (levelConfig.noteTypes.includes('half')) {
    units.push({ type: 'note', duration: 2, name: 'Half Note' });
    units.push({ type: 'rest', duration: 2, name: 'Half Rest' });
  }
  if (levelConfig.noteTypes.includes('eighth')) {
    units.push({ type: 'note', duration: 0.5, name: 'Eighth Note' });
    units.push({ type: 'rest', duration: 0.5, name: 'Eighth Rest' });
  }
  if (levelConfig.noteTypes.includes('triplet')) {
    // Represents a single eighth note within a triplet group.
    // The generation logic will handle grouping them.
    units.push({ type: 'note', duration: 1/3, name: 'Eighth Note Triplet' });
  }

  RHYTHM_PATTERN_CONFIGS[i] = {
    units: units,
    maxComplexity: levelConfig.complexity,
    syncopation: levelConfig.syncopation || false, // Keep syncopation info
  };
}


// Updated sight reading note ranges
const SIGHT_READING_NOTES = {
  very_basic: [ // C4-A4 (Levels 1-5)
    { name: 'C4', yOffset: -24, displayName: 'C4' },
    { name: 'D4', yOffset: -12, displayName: 'D4' },
    { name: 'E4', yOffset: 0, displayName: 'E4' },
    { name: 'F4', yOffset: 12, displayName: 'F4' },
    { name: 'G4', yOffset: 24, displayName: 'G4' },
    { name: 'A4', yOffset: 36, displayName: 'A4' }
  ],
  basic: [ // C4-G5 (Levels 6-15)
    { name: 'C4', yOffset: -24, displayName: 'C4' },
    { name: 'D4', yOffset: -12, displayName: 'D4' },
    { name: 'E4', yOffset: 0, displayName: 'E4' },
    { name: 'F4', yOffset: 12, displayName: 'F4' },
    { name: 'G4', yOffset: 24, displayName: 'G4' },
    { name: 'A4', yOffset: 36, displayName: 'A4' },
    { name: 'B4', yOffset: 48, displayName: 'B4' },
    { name: 'C5', yOffset: 60, displayName: 'C5' },
    { name: 'D5', yOffset: 72, displayName: 'D5' },
    { name: 'E5', yOffset: 84, displayName: 'E5' },
    { name: 'F5', yOffset: 96, displayName: 'F5' },
    { name: 'G5', yOffset: 108, displayName: 'G5' }
  ],
  extended: [ // Add A5-C6 (Levels 16-20)
    { name: 'C4', yOffset: -24, displayName: 'C4' },
    { name: 'D4', yOffset: -12, displayName: 'D4' },
    { name: 'E4', yOffset: 0, displayName: 'E4' },
    { name: 'F4', yOffset: 12, displayName: 'F4' },
    { name: 'G4', yOffset: 24, displayName: 'G4' },
    { name: 'A4', yOffset: 36, displayName: 'A4' },
    { name: 'B4', yOffset: 48, displayName: 'B4' },
    { name: 'C5', yOffset: 60, displayName: 'C5' },
    { name: 'D5', yOffset: 72, displayName: 'D5' },
    { name: 'E5', yOffset: 84, displayName: 'E5' },
    { name: 'F5', yOffset: 96, displayName: 'F5' },
    { name: 'G5', yOffset: 108, displayName: 'G5' },
    { name: 'A5', yOffset: 120, displayName: 'A5' },
    { name: 'B5', yOffset: 132, displayName: 'B5' },
    { name: 'C6', yOffset: 144, displayName: 'C6' }
  ],
  full: [ // Add enharmonic equivalents (Levels 21-30)
    { name: 'C4', yOffset: -24, displayName: 'C4' },
    { name: 'D4', yOffset: -12, displayName: 'D4' },
    { name: 'E4', yOffset: 0, displayName: 'E4' },
    { name: 'F4', yOffset: 12, displayName: 'F4' },
    { name: 'F#4', yOffset: 12, displayName: 'F#4' },
    { name: 'G4', yOffset: 24, displayName: 'G4' },
    { name: 'A4', yOffset: 36, displayName: 'A4' },
    { name: 'B4', yOffset: 48, displayName: 'B4' },
    { name: 'C5', yOffset: 60, displayName: 'C5' },
    { name: 'D5', yOffset: 72, displayName: 'D5' },
    { name: 'E5', yOffset: 84, displayName: 'E5' },
    { name: 'E#5', yOffset: 84, displayName: 'E#5' }, // Enharmonic
    { name: 'F5', yOffset: 96, displayName: 'F5' },
    { name: 'G5', yOffset: 108, displayName: 'G5' },
    { name: 'A5', yOffset: 120, displayName: 'A5' },
    { name: 'B5', yOffset: 132, displayName: 'B5' },
    { name: 'B#5', yOffset: 132, displayName: 'B#5' }, // Enharmonic
    { name: 'C6', yOffset: 144, displayName: 'C6' }
  ]
};

// FIXED: Language setting support with proper reload detection
const getLanguageSettings = () => {
  try {
    const settings = localStorage.getItem('practiceSettings');
    return settings ? JSON.parse(settings) : { language: 'english' };
  } catch (error) {
    return { language: 'english' };
  }
};

// Language translation maps - FIXED accidentals
const INTERVAL_TRANSLATIONS = {
  english: {
    'Perfect Unison': 'Perfect Unison',
    'Minor Second': 'Minor Second',
    'Major Second': 'Major Second',
    'Minor Third': 'Minor Third',
    'Major Third': 'Major Third',
    'Perfect Fourth': 'Perfect Fourth',
    'Tritone': 'Tritone',
    'Perfect Fifth': 'Perfect Fifth',
    'Minor Sixth': 'Minor Sixth',
    'Major Sixth': 'Major Sixth',
    'Minor Seventh': 'Minor Seventh',
    'Major Seventh': 'Major Seventh',
    'Perfect Octave': 'Perfect Octave'
  },
  latin: {
    'Perfect Unison': 'Prime',
    'Minor Second': 'Small Sekunda',
    'Major Second': 'Big Sekunda',
    'Minor Third': 'Small Terts',
    'Major Third': 'Big Terts',
    'Perfect Fourth': 'Kvarta',
    'Tritone': 'Tritonus',
    'Perfect Fifth': 'Kvinta',
    'Minor Sixth': 'Small Seksta',
    'Major Sixth': 'Big Seksta',
    'Minor Seventh': 'Small Septima',
    'Major Seventh': 'Big Septima',
    'Perfect Octave': 'Oktava'
  }
};

const NOTE_TRANSLATIONS = {
  english: {
    'C': 'C', 'D': 'D', 'E': 'E', 'F': 'F', 'G': 'G', 'A': 'A', 'B': 'B',
    'C#': 'C#', 'Db': 'Db', 'D#': 'D#', 'Eb': 'Eb', 'E#': 'E#', 'Fb': 'Fb',
    'F#': 'F#', 'Gb': 'Gb', 'G#': 'G#', 'Ab': 'Ab', 'A#': 'A#', 'Bb': 'Bb', 'B#': 'B#', 'Cb': 'Cb'
  },
  latin: {
    'C': 'Do', 'D': 'Re', 'E': 'Mi', 'F': 'Fa', 'G': 'Sol', 'A': 'La', 'B': 'Si',
    'C#': 'Do#', 'Db': 'Reb', 'D#': 'Re#', 'Eb': 'Mib', 'E#': 'Mi#', 'Fb': 'Fab',
    'F#': 'Fa#', 'Gb': 'Solb', 'G#': 'Sol#', 'Ab': 'Lab', 'A#': 'La#', 'Bb': 'Sib', 'B#': 'Si#', 'Cb': 'Dob'
  }
};

// FIXED: Helper function to translate interval names
const translateInterval = (intervalName) => {
  const settings = getLanguageSettings();
  return INTERVAL_TRANSLATIONS[settings.language][intervalName] || intervalName;
};

// FIXED: Helper function to translate note names (handling accidentals properly)
const translateNote = (noteName) => {
  const settings = getLanguageSettings();
  if (settings.language === 'english') return noteName;
  
  // Match note pattern: C4, F#5, Bb3, etc.
  const noteMatch = noteName.match(/([A-G][#b]?)(\d+)/);
  if (noteMatch) {
    const [, pitch, octave] = noteMatch;
    const translatedPitch = NOTE_TRANSLATIONS.latin[pitch] || pitch;
    return `${translatedPitch}${octave}`;
  }
  return noteName;
};

// COMPLETELY REWRITTEN: Fixed triplet generation with correct beat positioning
function createRhythmPatternForLevel(difficultyLevel = 1) {
  const config = RHYTHM_PATTERN_CONFIGS[difficultyLevel] || RHYTHM_PATTERN_CONFIGS[20];
  let pattern = [];
  let currentBeat = 0;
  let complexity = 0;
  const epsilon = 0.001; // For floating point comparisons
  const context_tags = new Set();
  
  // Build the pattern note by note
  while (currentBeat < 4 - epsilon && complexity < config.maxComplexity) {
    const remainingBeats = 4 - currentBeat;
    
    // Filter units that can fit in remaining space
    let possibleUnits = config.units.filter(unit => {
      if (Math.abs(unit.duration - (1/3)) < epsilon) {
        // Triplets need a full beat (duration 1 for the group) and must start on a beat boundary
        return remainingBeats >= 1 - epsilon && Math.abs(currentBeat % 1) < epsilon;
      }
      return unit.duration <= remainingBeats + epsilon;
    });
    
    const isOnBeat = Math.abs(currentBeat % 1) < epsilon;

    // **Design Change**: Prevent long notes on off-beats
    if (!isOnBeat) {
        possibleUnits = possibleUnits.filter(unit => unit.duration < 1);
    }

    if (possibleUnits.length === 0) break;
    
    // Encourage notes over rests, especially early in the pattern
    const noteCountInPattern = pattern.filter(p => p.type === 'note').length;
    let unit;
    
    if (noteCountInPattern < 2 && possibleUnits.some(u => u.type === 'note')) {
      // Force notes early in the pattern if we don't have enough yet
      const noteUnits = possibleUnits.filter(u => u.type === 'note');
      unit = noteUnits[Math.floor(Math.random() * noteUnits.length)];
    } else {
      // Otherwise, pick a unit randomly
      unit = possibleUnits[Math.floor(Math.random() * possibleUnits.length)];
    }
    
    // FIXED: Handle triplets with precise beat positioning
    if (Math.abs(unit.duration - (1/3)) < epsilon) {
      // This is a triplet unit - create all 3 notes of the triplet
      const tripletGroup = Math.floor(pattern.filter(n => n.triplet).length / 3);
      
      for (let i = 0; i < 3; i++) {
        // FIXED: Precise triplet timing - each note is 1/3 of a beat apart
        const tripletBeat = currentBeat + (i / 3);
        pattern.push({
          type: 'note',
          duration: 1/3,
          name: 'Eighth Note Triplet',
          beat: tripletBeat,
          triplet: true,
          tripletGroup: tripletGroup
        });
      }
      
      currentBeat += 1; // Move forward by one full beat
      complexity++;
      context_tags.add('triplet');
    } else {
      // Regular note or rest
      pattern.push({
        ...unit,
        beat: currentBeat
      });
      
      currentBeat += unit.duration;
      complexity++;
      
      if (unit.type === 'rest') {
        context_tags.add('rest');
      }
    }
  }
  
  // Fill remaining time with rests if needed, prioritizing larger rests
  let remainingDuration = 4.0 - currentBeat;
  let restBeatPosition = currentBeat;
  let hasSixteenthNotes = pattern.some(p => p.duration === 0.25 && p.type === 'note');

  while (remainingDuration > epsilon) {
    context_tags.add('rest');
    if (remainingDuration >= 2 - epsilon) {
      pattern.push({ type: 'rest', duration: 2, name: 'Half Rest', beat: restBeatPosition });
      remainingDuration -= 2.0;
      restBeatPosition += 2.0;
    } else if (remainingDuration >= 1 - epsilon) {
      pattern.push({ type: 'rest', duration: 1, name: 'Quarter Rest', beat: restBeatPosition });
      remainingDuration -= 1.0;
      restBeatPosition += 1.0;
    } else if (remainingDuration >= 0.5 - epsilon) {
      pattern.push({ type: 'rest', duration: 0.5, name: 'Eighth Rest', beat: restBeatPosition });
      remainingDuration -= 0.5;
      restBeatPosition += 0.5;
    } else if (remainingDuration >= 0.25 - epsilon && hasSixteenthNotes) { // only use 16th rests if 16th notes exist
        pattern.push({ type: 'rest', duration: 0.25, name: 'Sixteenth Rest', beat: restBeatPosition });
        remainingDuration -= 0.25;
        restBeatPosition += 0.25;
    } else {
      break; // No more standard rests can fit
    }
  }

  // Ensure we have at least 2 notes
  const finalNoteCount = pattern.filter(p => p.type === 'note').length;
  if (finalNoteCount < 2) {
    return createRhythmPatternForLevel(difficultyLevel);
  }
  
  // Sort by beat position to ensure correct playback order
  pattern.sort((a, b) => a.beat - b.beat);
  
  return { pattern, context_tags: Array.from(context_tags) };
}

// NEW: Helper function to create a slightly modified distractor pattern
function createDistractorPattern(originalPattern) {
  let modifiedPattern = JSON.parse(JSON.stringify(originalPattern)); // Deep copy
  let attempts = 0;

  while (attempts < 20) {
    const modifiableIndices = [];
    modifiedPattern.forEach((note, index) => {
      // Avoid modifying parts of triplets to keep it simple and effective
      if (!note.triplet) {
        modifiableIndices.push(index);
      }
    });

    if (modifiableIndices.length > 0) {
      const indexToModify = modifiableIndices[Math.floor(Math.random() * modifiableIndices.length)];
      const noteToChange = modifiedPattern[indexToModify];

      // Simple modification: swap note to rest or rest to note.
      // This is a common and effective way to create a subtle error.
      noteToChange.type = noteToChange.type === 'note' ? 'rest' : 'note';

      // Check if the modification resulted in a different pattern
      if (JSON.stringify(modifiedPattern) !== JSON.stringify(originalPattern)) {
        return modifiedPattern; // Return the successfully modified pattern
      }
    }
    attempts++;
  }
  // If we fail to create a variation, we'll rely on the calling function to try again.
  return originalPattern;
}

// FIXED: Helper function to translate note names in sight reading exercises
const translateNoteForSightReading = (noteName) => {
  const settings = getLanguageSettings();
  if (settings.language === 'english') return noteName;
  
  // Handle note names for sight reading (C4, D4, etc.)
  const noteMatch = noteName.match(/([A-G][#b]?)(\d+)/);
  if (noteMatch) {
    const [, pitch, octave] = noteMatch;
    const translatedPitch = NOTE_TRANSLATIONS.latin[pitch] || pitch;
    return `${translatedPitch}${octave}`;
  }
  return noteName;
};

// Generate level-appropriate sight reading exercises
function generateSightReadingExercisesForLevel(count, level) {
  const levelConfig = SIGHT_READING_LEVELS[level] || SIGHT_READING_LEVELS[30];
  const { noteRange, timer, accidentals, enharmonic } = levelConfig;
  
  const availableNotes = SIGHT_READING_NOTES[noteRange];
  const exercises = [];
  const usedNotes = new Set();
  
  for (let i = 0; i < count; i++) {
    let attempts = 0;
    let correctNote;
    
    do {
      correctNote = availableNotes[Math.floor(Math.random() * availableNotes.length)];
      attempts++;
    } while (usedNotes.has(correctNote.name) && attempts < 10);
    
    usedNotes.add(correctNote.name);
    
    // Generate wrong options from the same note range
    const wrongOptions = availableNotes
      .filter(note => note.name !== correctNote.name)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(note => translateNoteForSightReading(note.displayName)); // FIXED: Apply translation here
    
    exercises.push({
      type: 'note_identification',
      question: 'What note is shown?',
      note: {
        ...correctNote,
        ledgerLine: correctNote.yOffset > 108 || correctNote.yOffset < -24
      },
      options: [translateNoteForSightReading(correctNote.displayName), ...wrongOptions].sort(() => Math.random() - 0.5), // FIXED: Apply translation here
      correct_answer: translateNoteForSightReading(correctNote.displayName), // FIXED: Apply translation here
      explanation: `This note is ${translateNoteForSightReading(correctNote.displayName)}.`,
      timer: timer,
      level: level
    });
  }
  
  return exercises;
}

// FIXED: Updated ear training generation with proper translation and data structure
function generateEarTrainingExercisesForLevel(count, level) {
  const levelConfig = EAR_TRAINING_LEVELS[level] || EAR_TRAINING_LEVELS[20];
  const { intervals, chords, inversions } = levelConfig;
  
  const exercises = [];
  const usedAnswers = new Set();
  
  // Define base frequencies for different starting notes (level 6+)
  const baseFrequencies = level >= 6 ? [
    261.63, // C4
    293.66, // D4
    329.63, // E4
    349.23, // F4
    392.00, // G4
    440.00, // A4
    493.88  // B4
  ] : [261.63]; // Only C4 for levels 1-5
  
  const usedBaseFreqs = new Set();
  // Keep track of the last few inversions used to cycle through them
  const usedChordInversionsHistory = [];
  const maxInversionHistory = 3; 

  for (let i = 0; i < count; i++) {
    let attempts = 0;
    const chooseInterval = intervals.length > 0 && (chords.length === 0 || Math.random() < 0.5);

    if (chooseInterval) {
      // Interval exercise
      let correctInterval;
      do {
        correctInterval = intervals[Math.floor(Math.random() * intervals.length)];
        attempts++;
      } while (usedAnswers.has(correctInterval) && attempts < 20);
      usedAnswers.add(correctInterval);
      
      const wrongOptions = intervals
        .filter(interval => interval !== correctInterval)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      
      // Choose unique base frequency for level 6+
      let baseFrequency = baseFrequencies[0]; // Default to C4
      if (level >= 6) {
        const availableFreqs = baseFrequencies.filter(freq => !usedBaseFreqs.has(freq));
        if (availableFreqs.length > 0) {
          baseFrequency = availableFreqs[Math.floor(Math.random() * availableFreqs.length)];
          usedBaseFreqs.add(baseFrequency);
        } else {
          // Reset if all frequencies used
          usedBaseFreqs.clear();
          baseFrequency = baseFrequencies[Math.floor(Math.random() * baseFrequencies.length)];
          usedBaseFreqs.add(baseFrequency);
        }
      }
      
      // FIXED: Create options as objects with id (English key) and name (translated)
      const options = [correctInterval, ...wrongOptions].map(intervalName => ({
        id: intervalName, // English key for logic
        name: translateInterval(intervalName) // Translated name for display
      })).sort(() => Math.random() - 0.5);

      exercises.push({
        type: 'interval_identification',
        question: 'What interval do you hear?',
        audio_description: '🎵 Play Interval',
        options: options, // Use the new object array
        correct_answer: correctInterval, // Correct answer is the English key
        explanation: `This is a ${translateInterval(correctInterval).toLowerCase()}.`,
        level: level,
        baseFrequency: baseFrequency // Pass the base frequency to the exercise
      });
    } else if (chords.length > 0) {
      // Chord exercise
      let correctChord;
      do {
        correctChord = chords[Math.floor(Math.random() * chords.length)];
        attempts++;
      } while (usedAnswers.has(correctChord) && attempts < 20);
      usedAnswers.add(correctChord);

      const wrongOptions = chords
        .filter(chord => chord !== correctChord)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      
      // Choose unique base frequency for level 6+
      let baseFrequency = baseFrequencies[0]; // Default to C4
      if (level >= 6) {
        const availableFreqs = baseFrequencies.filter(freq => !usedBaseFreqs.has(freq));
        if (availableFreqs.length > 0) {
          baseFrequency = availableFreqs[Math.floor(Math.random() * availableFreqs.length)];
          usedBaseFreqs.add(baseFrequency);
        } else {
          // Reset if all frequencies used
          usedBaseFreqs.clear();
          baseFrequency = baseFrequencies[Math.floor(Math.random() * baseFrequencies.length)];
          usedBaseFreqs.add(baseFrequency);
        }
      }
      
      // Ensure different inversions for consecutive chord exercises (level 6+)
      let chordInversion = 'root'; // Default inversion
      if (level >= 6 && inversions) {
        const possibleInversions = ['root', 'first', 'second'];
        let availableInversionsForSelection = possibleInversions.filter(inv => !usedChordInversionsHistory.includes(inv));
        
        if (availableInversionsForSelection.length === 0) {
          // If all inversions have been used recently, reset history to ensure variety
          usedChordInversionsHistory.length = 0; 
          availableInversionsForSelection = possibleInversions;
        }

        chordInversion = availableInversionsForSelection[Math.floor(Math.random() * availableInversionsForSelection.length)];
        
        // Add to history and trim if too long
        usedChordInversionsHistory.push(chordInversion);
        if (usedChordInversionsHistory.length > maxInversionHistory) {
          usedChordInversionsHistory.shift(); // Remove oldest entry
        }
      }
      
      exercises.push({
        type: 'chord_identification',
        question: 'What chord do you hear?',
        audio_description: '🎵 Play Chord',
        options: [correctChord, ...wrongOptions].sort(() => Math.random() - 0.5),
        correct_answer: correctChord,
        explanation: `Listen for the characteristic sound of a ${correctChord.toLowerCase()}.`,
        level: level,
        baseFrequency: baseFrequency,
        inversion: chordInversion
      });
    }
  }
  
  return exercises;
}

// FIXED: Generate level-appropriate rhythm exercises with correct validation
function generateRhythmRecognitionExercisesForLevel(count, level) {
  const exercises = [];
  const sessionCorrectPatterns = new Set();

  for (let i = 0; i < count; i++) {
    let correctPatternData;
    let patternAttempts = 0;
    
    do {
      correctPatternData = createRhythmPatternForLevel(level);
      patternAttempts++;
    } while (sessionCorrectPatterns.has(JSON.stringify(correctPatternData.pattern)) && patternAttempts < 50);
    
    sessionCorrectPatterns.add(JSON.stringify(correctPatternData.pattern));
    const correctPattern = correctPatternData.pattern;

    // Generate exactly 2 unique distractors
    const distractors = [];
    let distractorAttempts = 0;
    
    while (distractors.length < 2 && distractorAttempts < 100) { // Increased attempts for unique distractors
      const distractor = createDistractorPattern(correctPattern);
      const distractorStr = JSON.stringify(distractor);
      const correctStr = JSON.stringify(correctPattern);
      
      // Make sure distractor is different from correct and other distractors
      if (distractorStr !== correctStr && !distractors.some(d => JSON.stringify(d) === distractorStr)) {
        distractors.push(distractor);
      }
      distractorAttempts++;
    }
    
    // Fallback if unique distractors can't be generated
    while (distractors.length < 2) {
      distractors.push(createDistractorPattern(correctPattern));
    }

    // --- COMPLETELY REWRITTEN AND FIXED PLACEMENT LOGIC ---
    // 1. Create an array of our three patterns.
    const allPatterns = [correctPattern, distractors[0], distractors[1]];
    
    // 2. Shuffle the array to randomize the position of the correct answer.
    allPatterns.sort(() => Math.random() - 0.5);
    
    // 3. Find the new index of the correct pattern.
    const correctPosition = allPatterns.findIndex(p => JSON.stringify(p) === JSON.stringify(correctPattern));
    
    // 4. Determine the correct answer ID ('A', 'B', or 'C') based on the new position.
    const correctAnswerId = ['A', 'B', 'C'][correctPosition];
    
    // 5. Create the final options array, which is now correctly randomized but maps A, B, C to the shuffled patterns.
    const finalOptions = [
      { id: 'A', name: 'Rhythm A', pattern: allPatterns[0] },
      { id: 'B', name: 'Rhythm B', pattern: allPatterns[1] },
      { id: 'C', name: 'Rhythm C', pattern: allPatterns[2] }
    ];
    
    exercises.push({
      type: 'rhythm_recognition',
      question: 'Which audio matches the rhythm shown?',
      rhythmPattern: correctPattern, // This is the visual notation, always the correct one.
      options: finalOptions,         // These are the audio options, now correctly randomized.
      correct_answer: correctAnswerId, // This ID points to the option with the matching audio.
      explanation: `Listen for the rhythm pattern with ${correctPattern.filter(n => n.type === 'note').length} notes.`,
      level: level,
      context_tags: correctPatternData.context_tags,
    });
  }
  
  return exercises;
}


// --- NEW: Musical Geography Exercise Generator ---
const INTERVALS = {
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

const INTERVAL_NAMES = ['Minor Second', 'Major Second', 'Minor Third', 'Major Third', 'Perfect Fourth', 'Tritone', 'Perfect Fifth', 'Minor Sixth', 'Major Sixth', 'Minor Seventh', 'Major Seventh', 'Perfect Octave'];

// Updated Musical Geography with consistent accidentals per exercise
const NOTES_ON_STAFF_WITH_ACCIDENTALS = [
  { pitch: 'C', octave: 4 }, { pitch: 'C#', octave: 4 }, { pitch: 'Db', octave: 4 },
  { pitch: 'D', octave: 4 }, { pitch: 'D#', octave: 4 }, { pitch: 'Eb', octave: 4 },
  { pitch: 'E', octave: 4 }, { pitch: 'E#', octave: 4 }, { pitch: 'Fb', octave: 4 },
  { pitch: 'F', octave: 4 }, { pitch: 'F#', octave: 4 }, { pitch: 'Gb', octave: 4 },
  { pitch: 'G', octave: 4 }, { pitch: 'G#', octave: 4 }, { pitch: 'Ab', octave: 4 },
  { pitch: 'A', octave: 4 }, { pitch: 'A#', octave: 4 }, { pitch: 'Bb', octave: 4 },
  { pitch: 'B', octave: 4 }, { pitch: 'B#', octave: 4 }, { pitch: 'Cb', octave: 4 },
  { pitch: 'C', octave: 5 }, { pitch: 'C#', octave: 5 }, { pitch: 'Db', octave: 5 },
  { pitch: 'D', octave: 5 }, { pitch: 'D#', octave: 5 }, { pitch: 'Eb', octave: 5 },
  { pitch: 'E', octave: 5 }, { pitch: 'E#', octave: 5 }, { pitch: 'Fb', octave: 5 },
  { pitch: 'F', octave: 5 }, { pitch: 'F#', octave: 5 }, { pitch: 'Gb', octave: 5 },
  { pitch: 'G', octave: 5 }, { pitch: 'G#', octave: 5 }, { pitch: 'Ab', octave: 5 },
  { pitch: 'A', octave: 5 }, { pitch: 'A#', octave: 5 }, { pitch: 'Bb', octave: 5 },
  { pitch: 'B', octave: 5 }, { pitch: 'B#', octave: 5 }, { pitch: 'Cb', octave: 5 },
];

const getNoteValue = (note) => {
  const noteOrder = { 
    'C': 0, 'C#': 1, 'Db': 1,
    'D': 2, 'D#': 3, 'Eb': 3,
    'E': 4, 'Fb': 4, 
    'F': 5, 'E#': 5, 'F#': 6, 'Gb': 6,
    'G': 7, 'G#': 8, 'Ab': 8,
    'A': 9, 'A#': 10, 'Bb': 10,
    'B': 11, 'Cb': 11, 
  };
  // Handle B# to effectively be C in the next octave for calculation
  let pitchValue = noteOrder[note.pitch];
  let octaveAdjust = note.octave;
  if (note.pitch === 'B#') {
    pitchValue = noteOrder['C']; // Map B# to C
    octaveAdjust = note.octave + 1; // Increment octave
  } else if (note.pitch === 'Cb') {
    pitchValue = noteOrder['B']; // Map Cb to B
    octaveAdjust = note.octave - 1; // Decrement octave
  }
  return 12 * octaveAdjust + pitchValue;
};

// FIXED: Musical Geography with better difficulty progression and consistent accidentals
function generateMusicalGeographyExercisesForLevel(count, level) {
  const exercises = [];
  
  // IMPROVED: Better level progression for Musical Geography
  let intervals_pool;
  let useAccidentals = false;
  
  if (level <= 5) {
    // Beginner: Only perfect intervals and simple major/minor intervals
    intervals_pool = ['Perfect Fourth', 'Perfect Fifth', 'Major Third', 'Minor Third'];
    useAccidentals = false;
  } else if (level <= 10) {
    // Intermediate: Add seconds and sixths, still no accidentals
    intervals_pool = ['Minor Second', 'Major Second', 'Minor Third', 'Major Third', 'Perfect Fourth', 'Perfect Fifth', 'Minor Sixth', 'Major Sixth'];
    useAccidentals = false;
  } else if (level <= 15) {
    // Advanced: Add sevenths and octave, introduce accidentals but consistently
    intervals_pool = ['Minor Second', 'Major Second', 'Minor Third', 'Major Third', 'Perfect Fourth', 'Perfect Fifth', 'Minor Sixth', 'Major Sixth', 'Minor Seventh', 'Major Seventh', 'Perfect Octave'];
    useAccidentals = true;
  } else {
    // Expert: All intervals with accidentals
    intervals_pool = ['Perfect Unison', 'Minor Second', 'Major Second', 'Minor Third', 'Major Third', 'Perfect Fourth', 'Tritone', 'Perfect Fifth', 'Minor Sixth', 'Major Sixth', 'Minor Seventh', 'Major Seventh', 'Perfect Octave'];
    useAccidentals = true;
  }
  
  const usedExerciseKeys = new Set();
  
  for (let i = 0; i < count; i++) {
    let exercise;
    let attempts = 0;
    
    do {
      exercise = null;
      attempts++;
      
      // FIXED: Consistent accidental choice per exercise (no mixing flats and sharps)
      const useFlats = useAccidentals && Math.random() > 0.5;
      const availableNotes = NOTES_ON_STAFF_WITH_ACCIDENTALS.filter(n => {
        if (!useAccidentals) {
          // Only natural notes for lower levels
          return !n.pitch.includes('#') && !n.pitch.includes('b');
        }
        
        if (useFlats) {
          // In flat context, allow natural notes and flats only
          return !n.pitch.includes('#') || n.pitch === 'E#' || n.pitch === 'B#';
        } else {
          // In sharp context, allow natural notes and sharps only
          return !n.pitch.includes('b') || n.pitch === 'Cb' || n.pitch === 'Fb';
        }
      });

      const minNoteValue = getNoteValue({pitch: 'C', octave: 4});
      const maxNoteValue = getNoteValue({pitch: 'B', octave: 5});
      const suitableNotes = availableNotes.filter(n => getNoteValue(n) >= minNoteValue && getNoteValue(n) <= maxNoteValue);


      if (level <= 10 || (level <= 15 && Math.random() > 0.5)) { 
        // Identification exercises
        const correctIntervalName = intervals_pool[Math.floor(Math.random() * intervals_pool.length)];
        const semitones = INTERVALS[correctIntervalName];

        let baseNote, topNote;
        let noteAttempts = 0;
        do {
          if (suitableNotes.length === 0) break;
          baseNote = suitableNotes[Math.floor(Math.random() * suitableNotes.length)];
          const targetValue = getNoteValue(baseNote) + semitones;
          topNote = availableNotes.find(n => getNoteValue(n) === targetValue);
          
          if (!topNote) {
              topNote = NOTES_ON_STAFF_WITH_ACCIDENTALS.find(n => getNoteValue(n) === targetValue);
          }

          noteAttempts++;
        } while ((!topNote || getNoteValue(topNote) < getNoteValue(baseNote) || topNote === baseNote || getNoteValue(topNote) > maxNoteValue) && noteAttempts < 50);

        if (topNote && getNoteValue(topNote) > getNoteValue(baseNote)) {
          const exerciseKey = `${baseNote.pitch}${baseNote.octave}-${topNote.pitch}${topNote.octave}-${correctIntervalName}-${useFlats ? 'flats' : 'sharps'}`;
          
          if (!usedExerciseKeys.has(exerciseKey)) {
            const wrongOptions = intervals_pool.filter(name => name !== correctIntervalName)
              .sort(() => 0.5 - Math.random()).slice(0, 3);
            
            exercise = {
              type: 'musical_geography_identification',
              question: 'What interval is shown on the staff?',
              notes: [baseNote, topNote],
              options: [translateInterval(correctIntervalName), ...wrongOptions.map(translateInterval)].sort(() => 0.5 - Math.random()),
              correct_answer: translateInterval(correctIntervalName),
              level: level,
            };
            usedExerciseKeys.add(exerciseKey);
          }
        }
      } else { 
        // Generation exercises with note letter options
        const correctIntervalName = intervals_pool[Math.floor(Math.random() * intervals_pool.length)];
        const semitones = INTERVALS[correctIntervalName];
        
        let baseNote, correctTopNote;
        let noteAttempts = 0;
        do {
          if (suitableNotes.length === 0) break;
          baseNote = suitableNotes[Math.floor(Math.random() * suitableNotes.length)];
          const targetValue = getNoteValue(baseNote) + semitones;
          correctTopNote = availableNotes.find(n => getNoteValue(n) === targetValue);
          if (!correctTopNote) {
             correctTopNote = NOTES_ON_STAFF_WITH_ACCIDENTALS.find(n => getNoteValue(n) === targetValue);
          }
          noteAttempts++;
        } while ((!correctTopNote || getNoteValue(correctTopNote) < getNoteValue(baseNote) || correctTopNote === baseNote || getNoteValue(correctTopNote) > maxNoteValue) && noteAttempts < 50);

        if (correctTopNote && getNoteValue(correctTopNote) > getNoteValue(baseNote)) {
          const exerciseKey = `${baseNote.pitch}${baseNote.octave}-gen-${correctIntervalName}-${useFlats ? 'flats' : 'sharps'}`;
          
          if (!usedExerciseKeys.has(exerciseKey)) {
            // FIXED: Create note letter options (not staff notation)
            const correctOption = { 
              id: 'correct', 
              label: translateNote(`${correctTopNote.pitch}${correctTopNote.octave}`),
              notes: [baseNote, correctTopNote] 
            };
            const options = [correctOption];

            // Generate wrong note letter options
            let wrongAttempts = 0;
            while (options.length < 4 && wrongAttempts < 100) {
              const wrongNote = availableNotes[Math.floor(Math.random() * availableNotes.length)];
              const wrongLabel = translateNote(`${wrongNote.pitch}${wrongNote.octave}`);
              
              if (!options.some(opt => opt.label === wrongLabel)) {
                options.push({ 
                  id: `wrong_${options.length}`, 
                  label: wrongLabel,
                  notes: [baseNote, wrongNote] 
                });
              }
              wrongAttempts++;
            }
            
            exercise = {
              type: 'musical_geography_generation',
              question: `Show me a ${translateInterval(correctIntervalName)} above ${translateNote(`${baseNote.pitch}${baseNote.octave}`)}`,
              notes: [baseNote],
              options: options.sort(() => 0.5 - Math.random()),
              correct_answer: 'correct',
              level: level,
            };
            usedExerciseKeys.add(exerciseKey);
          }
        }
      }
    } while (!exercise && attempts < 100);
    
    if (exercise) {
      exercises.push(exercise);
    } else {
        // console.warn(`Failed to generate a unique musical geography exercise for level ${level} (attempt ${i+1}) after 100 attempts.`);
    }
  }
  
  return exercises;
}


// Updated function for Drumline Memory (renamed and improved)
function generateDrumlineMemoryExercise(level) {
  const timeSignatures = {
    1: [2, 4], // 2/4 time
    2: [4, 4], // 4/4 time
    3: [3, 4]  // 3/4 time
  };
  // Default to 4/4 if level exceeds defined time signatures
  const timeSignature = timeSignatures[level] || [4, 4];
  
  const [beatsPerMeasure] = timeSignature;
  const pattern = [];
  let currentBeat = 0;
  const epsilon = 0.001; // For floating point comparisons
  
  // **Design Change**: Enhanced pattern generation for different levels
  // Level 1: Simple 2/4 patterns with basic note values
  // Level 2: More complex 4/4 patterns with varied rhythms
  // Level 3: 3/4 patterns with triplet feel
  while (currentBeat < beatsPerMeasure - epsilon) {
    const remainingBeats = beatsPerMeasure - currentBeat;
    
    let possibleDurations = [];
    
    // **Design Change**: Level-specific rhythm complexity
    if (level === 1) {
      // Level 1: Simple rhythms - quarters and halves
      if (remainingBeats >= 1 - epsilon) possibleDurations.push({ dur: 1, name: 'Quarter Note', restName: 'Quarter Rest' });
      if (remainingBeats >= 0.5 - epsilon) possibleDurations.push({ dur: 0.5, name: 'Eighth Note', restName: 'Eighth Rest' });
    } else if (level === 2) {
      // Level 2: More variety - add sixteenths occasionally
      if (remainingBeats >= 1 - epsilon) possibleDurations.push({ dur: 1, name: 'Quarter Note', restName: 'Quarter Rest' });
      if (remainingBeats >= 0.5 - epsilon) possibleDurations.push({ dur: 0.5, name: 'Eighth Note', restName: 'Eighth Rest' });
      if (remainingBeats >= 0.25 - epsilon && Math.random() < 0.3) possibleDurations.push({ dur: 0.25, name: 'Sixteenth Note', restName: 'Sixteenth Rest' });
    } else if (level === 3) {
      // Level 3: 3/4 with dotted notes
      if (remainingBeats >= 1.5 - epsilon) possibleDurations.push({ dur: 1.5, name: 'Dotted Quarter', restName: 'Dotted Quarter Rest' });
      if (remainingBeats >= 1 - epsilon) possibleDurations.push({ dur: 1, name: 'Quarter Note', restName: 'Quarter Rest' });
      if (remainingBeats >= 0.5 - epsilon) possibleDurations.push({ dur: 0.5, name: 'Eighth Note', restName: 'Eighth Rest' });
    } else { // Default behavior for levels > 3
        if (remainingBeats >= 1 - epsilon) possibleDurations.push({ dur: 1, name: 'Quarter Note', restName: 'Quarter Rest' });
        if (remainingBeats >= 0.5 - epsilon) possibleDurations.push({ dur: 0.5, name: 'Eighth Note', restName: 'Eighth Rest' });
        if (remainingBeats >= 0.25 - epsilon) possibleDurations.push({ dur: 0.25, name: 'Sixteenth Note', restName: 'Sixteenth Rest' });
    }

    if (possibleDurations.length === 0) break;

    const chosenDur = possibleDurations[Math.floor(Math.random() * possibleDurations.length)];
    
    // **Design Change**: Adjusted note/rest probability by level
    const noteProb = level === 1 ? 0.8 : level === 2 ? 0.7 : 0.75;
    const isNote = Math.random() < noteProb;
    
    if (isNote) {
      pattern.push({
        type: 'note',
        duration: chosenDur.dur,
        beat: currentBeat,
        name: chosenDur.name
      });
    } else {
      pattern.push({
        type: 'rest',
        duration: chosenDur.dur,
        beat: currentBeat,
        name: chosenDur.restName
      });
    }
    currentBeat += chosenDur.dur;
  }
  
  // Ensure the pattern exactly fills the measure by padding with rests if needed
  let totalDuration = pattern.reduce((sum, item) => sum + item.duration, 0);
  while (totalDuration < beatsPerMeasure - epsilon) {
    const remaining = beatsPerMeasure - totalDuration;
    if (remaining >= 1 - epsilon) {
        pattern.push({ type: 'rest', duration: 1, beat: totalDuration, name: 'Quarter Rest' });
        totalDuration += 1;
    } else if (remaining >= 0.5 - epsilon) {
        pattern.push({ type: 'rest', duration: 0.5, beat: totalDuration, name: 'Eighth Rest' });
        totalDuration += 0.5;
    } else if (remaining >= 0.25 - epsilon) {
        pattern.push({ type: 'rest', duration: 0.25, beat: totalDuration, name: 'Sixteenth Rest' });
        totalDuration += 0.25;
    } else {
        break;
    }
  }

  // Ensure pattern is not empty
  if (pattern.length === 0) {
      pattern.push({ type: 'note', duration: 1, beat: 0, name: 'Quarter Note' }); // Fallback
  }
  
  pattern.sort((a, b) => a.beat - b.beat); // Sort by beat position

  return [{
    type: 'drumline_memory',
    question: `Memorize and reproduce this rhythm:`,
    rhythmPattern: pattern,
    timeSignature: timeSignature,
    options: [], // No options as it's a reproduction task
    correct_answer: null, // No correct_answer as it's a reproduction task
    level: level
  }];
}


// --- NEW: Ear Training: In Action! Generator ---

const NOTE_LATTICE = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
];

const getNoteFromIndex = (index) => {
  const pitch = NOTE_LATTICE[index % 12];
  const octave = Math.floor(index / 12); // Assumes C0 is index 0
  return { pitch, octave };
};

const getIndexFromNote = (note) => {
  const baseIndex = NOTE_LATTICE.indexOf(note.pitch);
  if (baseIndex === -1) {
      // Handle cases like 'Cb', 'B#', if needed, by mapping them to their enharmonic equivalents in NOTE_LATTICE
      // For now, assume pitch is directly in NOTE_LATTICE
      return -1; 
  }
  return baseIndex + (note.octave * 12);
};

// NEW HELPER: Function to get interval name from semitones
const getIntervalName = (semitones) => {
  // Ordered by preference for same semitone values (e.g., Tritone vs. others)
  const intervalMap = {
    0: 'Perfect Unison',
    1: 'Minor Second',
    2: 'Major Second',
    3: 'Minor Third',
    4: 'Major Third',
    5: 'Perfect Fourth',
    6: 'Tritone', // Prefer Tritone for 6 semitones
    7: 'Perfect Fifth',
    8: 'Minor Sixth',
    9: 'Major Sixth',
    10: 'Minor Seventh',
    11: 'Major Seventh',
    12: 'Perfect Octave'
  };

  // Find the interval name. If no exact match (shouldn't happen with standard intervals), return a generic name.
  return intervalMap[semitones] || 'Unknown Interval';
};

// **Design Change**: Updated melodic exercise generator for uniqueness and note variety
export function generateMelodicExerciseForLevel(level, usedKeys = new Set()) {
  let phraseLength, phraseRhythm;
  let phraseNotes, baseNote, finalNote, correctAnswer, phraseForSynth, options;
  let exerciseKey;
  let attempts = 0;
  
  // **Design Change**: Define the full playable range for all notes
  const minPlayableNoteIndex = getIndexFromNote({ pitch: 'C', octave: 4 });
  const maxPlayableNoteIndex = getIndexFromNote({ pitch: 'C', octave: 6 });

  do {
    // Configuration for melodic phrase complexity per level
    switch (level) {
      case 1:
        phraseLength = 2;
        phraseRhythm = [{ duration: 1 }, { duration: 1 }]; // Two quarter notes
        break;
      case 2:
        phraseLength = 3;
        phraseRhythm = [{ duration: 1 }, { duration: 0.5 }, { duration: 1 }]; // Quarter, Eighth, Quarter
        break;
      case 3:
        phraseLength = 4;
        phraseRhythm = [{ duration: 1 }, { duration: 0.5 }, { duration: 0.5 }, { duration: 1 }]; // Quarter, Eighth, Eighth, Quarter
        break;
      case 4:
        const isLevel2Pattern = Math.random() < 0.5; // Randomly choose between level 2 or level 3 rhythm complexity
        phraseLength = isLevel2Pattern ? 3 : 4;
        phraseRhythm = isLevel2Pattern
          ? [{ duration: 1 }, { duration: 0.5 }, { duration: 1 }]
          : [{ duration: 1 }, { duration: 0.5 }, { duration: 0.5 }, { duration: 1 }];
        break;
      default:
        // For levels beyond 4, cap at level 4's complexity unless more are explicitly defined
        phraseLength = 4;
        phraseRhythm = [{ duration: 1 }, { duration: 0.5 }, { duration: 0.5 }, { duration: 1 }];
        break;
    }

    // 1. Generate Base Note
    const direction = Math.random() < 0.5 ? 1 : -1; // 1 for up, -1 for down
    let minBaseNoteIndex = getIndexFromNote({ pitch: 'C', octave: 4 });
    let maxBaseNoteIndex = getIndexFromNote({ pitch: 'G', octave: 5 }); // Widen base note range for variety

    // **Design Change**: For downward phrases level 2+, base note must be F4 or higher
    if (level >= 2 && direction === -1) {
      minBaseNoteIndex = Math.max(minBaseNoteIndex, getIndexFromNote({ pitch: 'F', octave: 4 }));
    }
    
    minBaseNoteIndex = Math.max(minBaseNoteIndex, minPlayableNoteIndex);
    maxBaseNoteIndex = Math.min(maxBaseNoteIndex, maxPlayableNoteIndex);

    if (minBaseNoteIndex > maxBaseNoteIndex) {
        // Failsafe if range becomes invalid
        minBaseNoteIndex = getIndexFromNote({ pitch: 'F', octave: 4 });
        maxBaseNoteIndex = getIndexFromNote({ pitch: 'G', octave: 5 });
    }

    const baseNoteIndex = minBaseNoteIndex + Math.floor(Math.random() * (maxBaseNoteIndex - minBaseNoteIndex + 1));
    baseNote = getNoteFromIndex(baseNoteIndex);

    // 2. Generate phrase
    let currentNoteIndex = baseNoteIndex;
    phraseNotes = [baseNote];
    const noteCounts = { [`${baseNote.pitch}${baseNote.octave}`]: 1 };

    for (let i = 1; i < phraseLength; i++) {
        let noteAttempts = 0;
        let nextNoteIndexCandidate = null;
        let newNote = null;

        do {
            const step = Math.floor(Math.random() * 5) + 1; // 1-5 semitones
            const candidateIndex = currentNoteIndex + (direction * step);

            if (candidateIndex >= minPlayableNoteIndex && candidateIndex <= maxPlayableNoteIndex) {
                const candidateNote = getNoteFromIndex(candidateIndex);
                const candidateNoteName = `${candidateNote.pitch}${candidateNote.octave}`;
                
                // **Design Change**: Ensure no more than two identical notes
                if ((noteCounts[candidateNoteName] || 0) < 2) {
                    nextNoteIndexCandidate = candidateIndex;
                    newNote = candidateNote;
                }
            }
            noteAttempts++;
        } while (nextNoteIndexCandidate === null && noteAttempts < 50);

        if (newNote) {
            currentNoteIndex = nextNoteIndexCandidate;
            phraseNotes.push(newNote);
            const newNoteName = `${newNote.pitch}${newNote.octave}`;
            noteCounts[newNoteName] = (noteCounts[newNoteName] || 0) + 1;
        } else {
            phraseNotes.push(phraseNotes[phraseNotes.length - 1]); 
            currentNoteIndex = getIndexFromNote(phraseNotes[phraseNotes.length - 1]);
        }
    }

    finalNote = phraseNotes[phraseNotes.length - 1];
    correctAnswer = `${finalNote.pitch}${finalNote.octave}`;
    
    // **Design Change**: Create a unique key for each exercise to prevent duplicates
    exerciseKey = `${baseNote.pitch}${baseNote.octave}-${phraseNotes.map(n => `${n.pitch}${n.octave}`).join('-')}`;
    attempts++;
    
  } while (usedKeys.has(exerciseKey) && attempts < 50);


  // 3. Generate phrase with rhythm for synthesizer
  phraseForSynth = phraseNotes.map((note, i) => ({
    pitch: note.pitch,
    octave: note.octave,
    // Use the corresponding rhythm duration, or repeat the last one if phraseNotes is longer
    duration: phraseRhythm[i] ? phraseRhythm[i].duration : phraseRhythm[phraseRhythm.length - 1].duration
  }));

  // 4. Generate options
  options = new Set([correctAnswer]);
  while (options.size < 4) {
    const randomOffset = Math.floor(Math.random() * 12) - 6; // -6 to +5 semitones from the final note
    if (randomOffset === 0) continue; // Don't add the correct answer as a wrong option
    
    const optionNoteIndex = getIndexFromNote(finalNote) + randomOffset;
    
    // Ensure option note is also within a reasonable musical range
    if (optionNoteIndex >= minPlayableNoteIndex && optionNoteIndex <= maxPlayableNoteIndex) {
        const optionNote = getNoteFromIndex(optionNoteIndex);
        options.add(`${optionNote.pitch}${optionNote.octave}`);
    }
  }

  // 5. Generate hint for level 1: interval between first and last note
  let hint = '';
  if (level === 1) {
    const firstNoteIndex = getIndexFromNote(phraseNotes[0]);
    // **FIXED**: Changed getIndexFromIndex to getIndexFromNote
    const lastNoteIndex = getIndexFromNote(phraseNotes[phraseNotes.length - 1]);
    const intervalSemitones = Math.abs(lastNoteIndex - firstNoteIndex);
    
    // Find a matching interval name from INTERVALS
    if (intervalSemitones === 0) {
      hint = 'Perfect Unison';
    } else {
      // Iterate through INTERVALS to find the name, prioritizing standard names
      for (const [name, semitones] of Object.entries(INTERVALS)) {
          if (semitones === intervalSemitones) {
              if (name === 'Tritone' && intervalSemitones === 6) {
                  hint = name;
                  break; 
              }
              if (name.includes('Second') || name.includes('Third') || name.includes('Fourth') || 
                  name.includes('Fifth') || name.includes('Sixth') || name.includes('Seventh') || 
                  name.includes('Octave')) { // Prioritize common interval names
                  if (!hint || hint.includes('Tritone')) { // Don't overwrite Tritone if it was set
                     hint = name;
                  }
              }
          }
      }
    }
  }

  return {
    key: exerciseKey, // Return the unique key
    type: level === 1 ? 'two_notes' : 'melodic_phrase', // New exercise type for melodic ear training
    question: 'Listen to the melody and identify the final note.',
    audio_description: '🎵 Play Melody',
    level,
    baseNote: `${baseNote.pitch}${baseNote.octave}`,
    phrase: phraseForSynth, // The notes and durations for the synthesizer
    correct_answer: correctAnswer,
    options: Array.from(options).sort(() => Math.random() - 0.5),
    hint: hint, // General hint, for level 1 it's an Nterval hint
    interval: getIntervalName(Math.abs(getIndexFromNote(finalNote) - getIndexFromNote(baseNote)))
  };
}


// Updated main exercise generator
export function generateExercises(moduleType, count, userLevel = 1) {
  let maxAllowedLevel = 20; // Default for most modules
  // Adjust max levels for specific modules
  if (moduleType === 'sight_reading' || moduleType === 'musical_geography') {
    maxAllowedLevel = 30;
  } else if (moduleType === 'ear_training_melodic') { // New module max level
    // Assuming higher levels will be added for melodic exercises in the future
    // For now, max complexity is effectively level 4, but progression can be beyond that.
    maxAllowedLevel = 20; 
  }
  
  // The 'level' variable here is a clipped version of userLevel, used for 'combined' exercises.
  // Other module types will now directly use 'userLevel' as per the outline's updated instruction.
  const level = Math.min(Math.max(1, userLevel), maxAllowedLevel);
  
  // This logic is for the classic ear training module (intervals/chords)
  if (moduleType === 'ear_training') { 
    return generateEarTrainingExercisesForLevel(count, userLevel);
  }

  switch (moduleType) {
    case 'rhythm_training':
      return generateRhythmRecognitionExercisesForLevel(count, userLevel);
    case 'sight_reading':
      return generateSightReadingExercisesForLevel(count, userLevel);
    case 'musical_geography':
      return generateMusicalGeographyExercisesForLevel(count, userLevel);
    case 'drumline_memory':
      const drumlineExercises = [];
      for (let i = 0; i < count; i++) {
          drumlineExercises.push(...generateDrumlineMemoryExercise(userLevel));
      }
      return drumlineExercises;
    case 'ear_training_melodic': // NEW MODULE TYPE: Ear Training: In Action!
      const melodicExercises = [];
      const usedMelodicKeys = new Set();
      for (let i = 0; i < count; i++) {
          const exercise = generateMelodicExerciseForLevel(userLevel, usedMelodicKeys);
          usedMelodicKeys.add(exercise.key); // Add the key to the set to prevent duplicates
          melodicExercises.push(exercise);
      }
      return melodicExercises;
    case 'combined':
      return generateCombinedExercisesForLevel(count, level);
    default:
      return [];
    }
}

function generateCombinedExercisesForLevel(count, level) {
  let earLevel, rhythmLevel, sightLevel;
  
  if (level <= 4) {
    earLevel = rhythmLevel = sightLevel = Math.min(level + 1, 5);
  } else if (level <= 8) {
    earLevel = rhythmLevel = sightLevel = Math.min(level + 2, 10);
  } else if (level <= 12) {
    earLevel = rhythmLevel = sightLevel = Math.min(level + 3, 15);
  } else if (level <= 16) {
    earLevel = rhythmLevel = sightLevel = Math.min(level + 4, 20);
  } else {
    earLevel = rhythmLevel = sightLevel = 20;
  }
  
  // Adjusted distribution for 10 exercises
  const earCount = Math.floor(count * 0.3);      // 3 exercises
  const rhythmCount = Math.floor(count * 0.4);   // 4 exercises  
  const sightCount = count - earCount - rhythmCount; // 3 exercises
  
  const exercises = [
    ...generateEarTrainingExercisesForLevel(earCount, earLevel),
    ...generateRhythmRecognitionExercisesForLevel(rhythmCount, rhythmLevel),
    ...generateSightReadingExercisesForLevel(sightCount, sightLevel)
  ];
  
  return exercises.sort(() => Math.random() - 0.5);
}

// Helper function to determine if user should level up
export function shouldLevelUp(currentLevel, accuracy, moduleType) {
  // Updated max levels
  const maxLevels = {
    sight_reading: 30,
    musical_geography: 30,
    ear_training: 20, // Classic ear training
    rhythm_training: 20,
    drumline_memory: 20, // Drumline Memory
    ear_training_melodic: 20, // New melodic ear training
    combined: 20
  };
  
  const maxLevel = maxLevels[moduleType] || 20;
  
  if (currentLevel >= maxLevel) {
    return { shouldLevelUp: false, newLevel: currentLevel };
  }
  
  // Require 70% accuracy to advance
  const willLevelUp = accuracy >= 70;
  
  return {
    shouldLevelUp: willLevelUp,
    newLevel: willLevelUp ? currentLevel + 1 : currentLevel
  };
}

// Helper function to get level range for congratulations
export function getLevelRange(level) {
  if (level <= 5) return '1-5';
  if (level <= 10) return '6-10';
  if (level <= 15) return '11-15';
  if (level <= 20) return '16-20';
  if (level <= 25) return '21-25';
  if (level <= 30) return '26-30';
  return '30+';
}
