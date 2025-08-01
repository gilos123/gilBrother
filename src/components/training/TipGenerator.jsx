export const generateTip = (exercise, userChoice) => {
  const { type, correct_answer } = exercise;

  // --- Ear Training Tips ---
  if (type === 'interval_identification' || type === 'chord_identification') {
    if (userChoice === 'Minor Third' && correct_answer === 'Major Third') {
      return "Listen for the mood! Major 3rds often sound bright and happy (like the start of 'Oh, When the Saints'), while Minor 3rds sound more somber.";
    }
    if (userChoice === 'Major Third' && correct_answer === 'Minor Third') {
      return "Listen for the mood! Minor 3rds can sound sad or thoughtful (like 'Greensleeves'), while Major 3rds are often bright and cheerful.";
    }
    if (userChoice === 'Perfect Fourth' && correct_answer === 'Perfect Fifth') {
      return "Try singing 'Twinkle, Twinkle, Little Star' – the first two notes are a Perfect 5th. A Perfect 4th sounds more like 'Here Comes the Bride'.";
    }
    if (userChoice === 'Perfect Fifth' && correct_answer === 'Perfect Fourth') {
        return "A Perfect 4th has a 'resolved' sound, like 'Here Comes the Bride'. A Perfect 5th is more open, like the Star Wars theme.";
    }
    if (userChoice?.includes('Diminished') && correct_answer?.includes('Augmented') || userChoice?.includes('Augmented') && correct_answer?.includes('Diminished')) {
        return "Augmented chords sound stretched or dreamy. Diminished chords sound tense or spooky. Listen for that 'unsettled' feeling.";
    }
    return "Focus on the relationship between the notes. Try humming the first note, then the second, to feel the distance.";
  }

  // --- Rhythm Training Tips ---
  if (type === 'rhythm_recognition') {
    if (exercise.context_tags?.includes('syncopation')) {
        return "Try activating the metronome! Syncopated notes often land on the 'and' between the main beats. Feel the push and pull against the steady pulse.";
    }
    if (exercise.context_tags?.includes('triplet')) {
        return "For triplets, think 'tri-pl-et' or '1-2-3' fitting evenly inside one beat. Use the metronome to hear how three notes squeeze into the space of two.";
    }
    if (exercise.context_tags?.includes('rest')) {
        return "Silence is part of the music! Listen carefully for the gaps. Use the metronome to help you count through the rests.";
    }
    return "Tap your foot to the beat as you listen. It helps internalize the rhythm before you choose an answer.";
  }
  
  // --- Sight Reading Tips ---
  if (type === 'note_identification') {
    if (exercise.note?.ledgerLine) {
        return "Count from the nearest staff line you know! Ledger lines are just extensions of the staff ladder.";
    }
    if (correct_answer.startsWith('G')) {
        return "The G-clef's curl wraps around the G line (2nd from the bottom). Use it as your anchor to find other notes!";
    }
    return "Remember the acronyms! For lines: 'Every Good Boy Does Fine'. For spaces: 'F-A-C-E'.";
  }
  
  // --- Musical Geography Tips ---
  if (type === 'musical_geography_identification' || type === 'musical_geography_generation') {
    return "Focus on the distance between the notes on the staff. Each line and space represents one step in a scale. Count them to determine the interval.";
  }

  return "Listen carefully and trust your ear. You've got this!"; // Default fallback tip
};