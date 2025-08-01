// Mini Lesson Content System
// Each lesson is structured as carousel slides with mentor, visuals, and optional audio

export const MINI_LESSON_CONTENT = {
  ear_training: {
    '1-5': {
      title: "First Notes, First Steps",
      mentor: 'jimi',
      mentorName: 'Jimi Hendrix',
      slides: [
        {
          title: "Listen to the Sound Behind the Notes",
          text: "Hey, I'm Jimi. Ear training is all about hearing music deeply. You're not just guessing notes - you're training your ears to recognize distances and emotions in sound. 🎶",
          visual: null,
          audio: null
        },
        {
          title: "Meet the First Intervals",
          text: "An interval is the distance between two notes.\nHere are a few classics:\n\n• Minor 2nd (C to Db): Sounds tense - like a horror movie step\n• Major 2nd (C to D): Sounds like the start of \"Happy Birthday\"",
          visual: {
            type: 'intervals',
            intervals: [
              { from: 'C4', to: 'Db4', label: 'Minor 2nd' },
              { from: 'C4', to: 'D4', label: 'Major 2nd' }
            ]
          },
          audio: null
        },
        {
          title: "The Color of Sound",
          text: "Chords = 3 or more notes stacked.\n• Major Triad: Bright & happy\n• Minor Triad: Sad & serious\n\nDon't rush to name everything. First, feel the sound. Close your eyes and guess - is it tense? Bright? Smooth?",
          visual: {
            type: 'chords',
            chords: [
              { notes: ['C4', 'E4', 'G4'], label: 'Major Triad' },
              { notes: ['C4', 'Eb4', 'G4'], label: 'Minor Triad' }
            ]
          },
          audio: {
            type: 'chord_comparison',
            chords: ['major', 'minor']
          }
        }
      ]
    },
    
    // NEW: Ear Training Level Group 6-10
    '6-10': {
      title: "Expanding Your Sonic Palette",
      mentor: 'jimi',
      mentorName: 'Jimi Hendrix',
      slides: [
        {
          title: "Let's Add Some Flavor",
          text: "Time to grow your musical ears. You already know the basics - now meet the rest of the family:\n\n• Minor 3rd: A sadder flavor than major, often used in blues and rock\n• Major 3rd: Bright and melodic - try singing \"Sir Duke\"\n• Minor 6th / Major 6th: These have a wide sound, like jumping up a mountain\n• Perfect Octave: Same note, higher pitch - like magic doubling itself",
          visual: {
            type: 'intervals',
            intervals: [
              { from: 'C4', to: 'Eb4', label: 'Minor 3rd' },
              { from: 'C4', to: 'E4', label: 'Major 3rd' },
              { from: 'C4', to: 'Ab4', label: 'Minor 6th' },
              { from: 'C4', to: 'A4', label: 'Major 6th' },
              { from: 'C4', to: 'C5', label: 'Perfect Octave' }
            ]
          },
          audio: null
        },
        {
          title: "Tension vs. Mystery",
          text: "Triads aren't always major or minor.\n\n• Diminished Triad: Tense, unstable - sounds like something's about to happen\n• Augmented Triad: Dreamy and unresolved, feels like floating\n\nThese chords add color and emotion to music - they're like spices in cooking!",
          visual: {
            type: 'chords',
            chords: [
              { notes: ['C4', 'Eb4', 'Gb4'], label: 'Diminished Triad' },
              { notes: ['C4', 'E4', 'G#4'], label: 'Augmented Triad' }
            ]
          },
          audio: {
            type: 'chord_comparison',
            chords: ['diminished', 'augmented']
          }
        },
        {
          title: "Use Your Music Memory",
          text: "Link intervals to familiar melodies:\n\n• Perfect 5th: \"Twinkle, Twinkle, Little Star\" (first two notes)\n• Minor 6th: \"The Entertainer\" (opening)\n• Octave: \"Somewhere Over the Rainbow\" (\"Some-where\")\n\n🎧 Try humming these intervals before guessing - it really helps!\n\nYour brain already knows these sounds from songs you love.",
          visual: null,
          audio: null
        }
      ]
    }
  },
  
  rhythm_training: {
    '1-5': {
      title: "The Basic Beat",
      mentor: 'duke',
      mentorName: 'Duke Ellington',
      slides: [
        {
          title: "Feel the Pulse",
          text: "Welcome, rhythm traveler. I'm Duke.\n\nRhythm is the heartbeat of music - it's how sounds move through time.\nWhether you're grooving or clapping, you're riding the beat.\n🎼 Let's explore how time is divided in music.",
          visual: null,
          audio: null
        },
        {
          title: "One Beat or Two?",
          text: "• Quarter Note: 1 beat (Count: \"1\")\n• Quarter Rest: 1 beat of silence\n• Half Rest: 2 beats of silence",
          visual: {
            type: 'rhythm_basics',
            pattern: [
              { type: 'note', duration: 1, name: 'Quarter Note' },
              { type: 'rest', duration: 1, name: 'Quarter Rest' },
              { type: 'rest', duration: 2, name: 'Half Rest' }
            ]
          },
          audio: null
        },
        {
          title: "March to Your Own Tempo",
          text: "Tempo = how fast or slow music flows (measured in BPM - beats per minute).\n\nTip: Tap your foot or clap with a steady beat while listening.\nThis helps you feel the rhythm deep inside.",
          visual: null,
          audio: {
            type: 'metronome',
            bpm: 90,
            beats: 4
          }
        }
      ]
    }
  },
  
  sight_reading: {
    '1-5': {
      title: "The Staff's Secrets: Basic Notes",
      mentor: 'bach',
      mentorName: 'J.S. Bach',
      slides: [
        {
          title: "Read It Like a Musician",
          text: "Greetings, I'm Bach. Sight reading means reading and understanding notes the moment you see them - like reading words in a book.\n\nIt's not just about guessing - it's about recognizing patterns and reacting quickly.",
          visual: null,
          audio: null
        },
        {
          title: "Notes Live on Lines and Spaces",
          text: "The Staff has 5 lines and 4 spaces. The Treble Clef (G-clef) circles the G line.\n\n• Line Notes (bottom to top): E - G - B - D - F\n(Every Good Boy Does Fine)\n• Space Notes (bottom to top): F - A - C - E",
          visual: {
            type: 'staff_basics',
            notes: [
              { note: 'E4', type: 'line', label: 'E' },
              { note: 'F4', type: 'space', label: 'F' },
              { note: 'G4', type: 'line', label: 'G' },
              { note: 'A4', type: 'space', label: 'A' },
              { note: 'B4', type: 'line', label: 'B' },
              { note: 'C5', type: 'space', label: 'C' },
              { note: 'D5', type: 'line', label: 'D' },
              { note: 'E5', type: 'space', label: 'E' },
              { note: 'F5', type: 'line', label: 'F' }
            ]
          },
          audio: null
        },
        {
          title: "A Note Can Go Higher or Lower",
          text: "• Sharp (#): Raises a note by a half step\n• Flat (b): Lowers a note by a half step\n\nAccidentals change the pitch slightly but make a big difference.\nTip: Focus on where the note sits on the staff, not just the letter name.",
          visual: {
            type: 'accidentals',
            notes: [
              { note: 'C4', label: 'C' },
              { note: 'C#4', label: 'C#' },
              { note: 'Cb4', label: 'Cb' }
            ]
          },
          audio: null
        }
      ]
    }
  },
  
  musical_geography: {
    '1-5': {
      title: "Mapping Basic Intervals",
      mentor: 'freddie',
      mentorName: 'Freddie Mercury',
      slides: [
        {
          title: "Notes Have Distance Too",
          text: "Hey darling, I'm Freddie. Musical Geography is all about recognizing how far apart notes are - visually.\n\nIt's like reading a map of sound - the space between two notes is called an interval.\n🎼 You'll learn to read those shapes just by looking.",
          visual: null,
          audio: null
        },
        {
          title: "Spot the Shapes",
          text: "Here are your essential landmarks:\n• Major 3rd: Skips one line or space\n• Minor 3rd: A bit smaller - also skips a note, but closer\n• Perfect 4th: Covers four positions\n• Perfect 5th: Covers five positions - feels open and powerful",
          visual: {
            type: 'geography_intervals',
            intervals: [
              { from: 'C4', to: 'E4', label: 'Major 3rd' },
              { from: 'A4', to: 'C5', label: 'Minor 3rd' },
              { from: 'D4', to: 'G4', label: 'Perfect 4th' },
              { from: 'G4', to: 'D5', label: 'Perfect 5th' }
            ]
          },
          audio: null
        },
        {
          title: "Lines and Spaces Are Clues",
          text: "• If both notes are on lines or both in spaces, it's an odd-numbered interval (3rd, 5th…)\n• If one's on a line and one's on a space, it's an even-numbered interval (2nd, 4th…)\n\n🎯 Tip: Count lines and spaces between notes, including the first and last note.",
          visual: {
            type: 'interval_counting',
            examples: [
              { from: 'E4', to: 'G4', label: '3rd (line to line)' },
              { from: 'F4', to: 'G4', label: '2nd (space to line)' }
            ]
          },
          audio: null
        }
      ]
    }
  }
};