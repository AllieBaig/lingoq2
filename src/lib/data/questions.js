


// Purpose: Define question templates, types, and generation logic for language learning exercises
// Key features: Multiple question types, difficulty scaling, answer validation, hint system
// Dependencies: lessons.js for lesson context, languages.js for language-specific content
// Related helpers: Used by quiz components, exercise generators, progress tracking
// Function names: generateQuestion, validateAnswer, getQuestionsByType, calculateScore
// MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
// Timestamp: 2025-06-10 14:34 | File: src/lib/data/questions.js

export const questionTypes = {
  'multiple-choice': {
    name: 'Multiple Choice',
    icon: '✅',
    description: 'Choose the correct answer from options',
    minOptions: 3,
    maxOptions: 5,
    timeLimit: 30,
    points: 10
  },
  'fill-blanks': {
    name: 'Fill in the Blanks',
    icon: '📝',
    description: 'Complete the sentence with missing words',
    timeLimit: 45,
    points: 15
  },
  'translation': {
    name: 'Translation',
    icon: '🔄',
    description: 'Translate between languages',
    timeLimit: 60,
    points: 25
  },
  'matching': {
    name: 'Matching',
    icon: '🔗',
    description: 'Match words with their meanings',
    minPairs: 4,
    maxPairs: 8,
    timeLimit: 40,
    points: 20
  },
  'listening': {
    name: 'Listening',
    icon: '👂',
    description: 'Listen and respond to audio',
    timeLimit: 50,
    points: 30
  },
  'speaking': {
    name: 'Speaking',
    icon: '🗣️',
    description: 'Speak the word or phrase',
    timeLimit: 45,
    points: 35
  },
  'ordering': {
    name: 'Word Order',
    icon: '🔀',
    description: 'Arrange words in correct order',
    timeLimit: 40,
    points: 20
  },
  'true-false': {
    name: 'True or False',
    icon: '❓',
    description: 'Decide if statement is correct',
    timeLimit: 20,
    points: 8
  }
};

export const difficultyModifiers = {
  1: { timeMultiplier: 1.5, hintCount: 3, pointMultiplier: 0.8 },
  2: { timeMultiplier: 1.3, hintCount: 2, pointMultiplier: 0.9 },
  3: { timeMultiplier: 1.2, hintCount: 2, pointMultiplier: 1.0 },
  4: { timeMultiplier: 1.1, hintCount: 1, pointMultiplier: 1.1 },
  5: { timeMultiplier: 1.0, hintCount: 1, pointMultiplier: 1.2 },
  6: { timeMultiplier: 0.9, hintCount: 1, pointMultiplier: 1.3 },
  7: { timeMultiplier: 0.8, hintCount: 0, pointMultiplier: 1.4 },
  8: { timeMultiplier: 0.7, hintCount: 0, pointMultiplier: 1.5 }
};

export function generateQuestion(type, vocabulary, grammar, level, category) {
  const questionConfig = questionTypes[type];
  const modifier = difficultyModifiers[level] || difficultyModifiers[3];
  
  const baseQuestion = {
    id: generateQuestionId(),
    type,
    level,
    category,
    timeLimit: Math.round(questionConfig.timeLimit * modifier.timeMultiplier),
    points: Math.round(questionConfig.points * modifier.pointMultiplier),
    hints: generateHints(type, modifier.hintCount),
    createdAt: Date.now(),
    attempts: 0,
    correctAttempts: 0
  };

  switch (type) {
    case 'multiple-choice':
      return generateMultipleChoice(baseQuestion, vocabulary, level);
    case 'fill-blanks':
      return generateFillBlanks(baseQuestion, vocabulary, grammar, level);
    case 'translation':
      return generateTranslation(baseQuestion, vocabulary, level);
    case 'matching':
      return generateMatching(baseQuestion, vocabulary, level);
    case 'listening':
      return generateListening(baseQuestion, vocabulary, level);
    case 'speaking':
      return generateSpeaking(baseQuestion, vocabulary, level);
    case 'ordering':
      return generateOrdering(baseQuestion, vocabulary, grammar, level);
    case 'true-false':
      return generateTrueFalse(baseQuestion, vocabulary, grammar, level);
    default:
      throw new Error(`Unknown question type: ${type}`);
  }
}

function generateMultipleChoice(baseQuestion, vocabulary, level) {
  const targetWord = getRandomVocabulary(vocabulary);
  const distractors = generateDistractors(vocabulary, targetWord, 3);
  const options = shuffleArray([targetWord.translation, ...distractors]);
  
  return {
    ...baseQuestion,
    question: `What does "${targetWord.english}" mean?`,
    options,
    correctAnswer: targetWord.translation,
    explanation: `"${targetWord.english}" translates to "${targetWord.translation}"`,
    context: generateContext(targetWord, level),
    audio: targetWord.pronunciation || null
  };
}

function generateFillBlanks(baseQuestion, vocabulary, grammar, level) {
  const targetWord = getRandomVocabulary(vocabulary);
  const sentence = generateSentence(targetWord, level);
  const blankedSentence = sentence.replace(targetWord.translation, '______');
  
  return {
    ...baseQuestion,
    question: `Fill in the blank: ${blankedSentence}`,
    correctAnswer: targetWord.translation,
    acceptableAnswers: generateAcceptableAnswers(targetWord),
    explanation: `The correct word is "${targetWord.translation}" (${targetWord.english})`,
    context: `Complete sentence: ${sentence}`,
    caseSensitive: false
  };
}

function generateTranslation(baseQuestion, vocabulary, level) {
  const targetWord = getRandomVocabulary(vocabulary);
  const direction = Math.random() > 0.5 ? 'to-target' : 'to-english';
  
  if (direction === 'to-target') {
    return {
      ...baseQuestion,
      question: `Translate to the target language: "${targetWord.english}"`,
      correctAnswer: targetWord.translation,
      acceptableAnswers: generateAcceptableAnswers(targetWord),
      explanation: `"${targetWord.english}" translates to "${targetWord.translation}"`,
      direction: 'to-target'
    };
  } else {
    return {
      ...baseQuestion,
      question: `Translate to English: "${targetWord.translation}"`,
      correctAnswer: targetWord.english,
      acceptableAnswers: [targetWord.english.toLowerCase()],
      explanation: `"${targetWord.translation}" translates to "${targetWord.english}"`,
      direction: 'to-english'
    };
  }
}

function generateMatching(baseQuestion, vocabulary, level) {
  const selectedWords = getRandomVocabulary(vocabulary, 5);
  const leftColumn = selectedWords.map(word => ({
    id: word.english,
    text: word.english,
    audio: word.pronunciation
  }));
  const rightColumn = shuffleArray(selectedWords.map(word => ({
    id: word.english,
    text: word.translation
  })));
  
  const correctPairs = selectedWords.reduce((pairs, word) => {
    pairs[word.english] = word.translation;
    return pairs;
  }, {});
  
  return {
    ...baseQuestion,
    question: 'Match the English words with their translations:',
    leftColumn,
    rightColumn,
    correctPairs,
    explanation: 'Match each English word with its correct translation'
  };
}

function generateListening(baseQuestion, vocabulary, level) {
  const targetWord = getRandomVocabulary(vocabulary);
  const sentence = generateSentence(targetWord, level);
  
  return {
    ...baseQuestion,
    question: 'Listen to the audio and type what you hear:',
    audioUrl: generateAudioUrl(sentence, baseQuestion.id),
    correctAnswer: sentence,
    acceptableAnswers: generateListeningAcceptableAnswers(sentence),
    explanation: `The correct sentence is: "${sentence}"`,
    playCount: 0,
    maxPlays: 3
  };
}

function generateSpeaking(baseQuestion, vocabulary, level) {
  const targetWord = getRandomVocabulary(vocabulary);
  
  return {
    ...baseQuestion,
    question: `Say the following word: "${targetWord.translation}"`,
    targetText: targetWord.translation,
    pronunciation: targetWord.pronunciation,
    correctAnswer: targetWord.translation,
    explanation: `Pronounce "${targetWord.translation}" as ${targetWord.pronunciation}`,
    recordingTime: 5,
    attempts: 3
  };
}

function generateOrdering(baseQuestion, vocabulary, grammar, level) {
  const targetWord = getRandomVocabulary(vocabulary);
  const sentence = generateSentence(targetWord, level);
  const words = sentence.split(' ');
  const shuffledWords = shuffleArray([...words]);
  
  return {
    ...baseQuestion,
    question: 'Arrange these words in the correct order:',
    words: shuffledWords.map((word, index) => ({
      id: index,
      text: word,
      position: null
    })),
    correctOrder: words,
    explanation: `The correct sentence is: "${sentence}"`
  };
}

function generateTrueFalse(baseQuestion, vocabulary, grammar, level) {
  const targetWord = getRandomVocabulary(vocabulary);
  const isTrue = Math.random() > 0.5;
  
  let statement, correctAnswer;
  
  if (isTrue) {
    statement = `"${targetWord.english}" means "${targetWord.translation}"`;
    correctAnswer = true;
  } else {
    const wrongTranslation = getRandomVocabulary(vocabulary.filter(w => w !== targetWord)).translation;
    statement = `"${targetWord.english}" means "${wrongTranslation}"`;
    correctAnswer = false;
  }
  
  return {
    ...baseQuestion,
    question: `True or False: ${statement}`,
    statement,
    correctAnswer,
    explanation: isTrue 
      ? `Correct! "${targetWord.english}" does mean "${targetWord.translation}"`
      : `False! "${targetWord.english}" actually means "${targetWord.translation}"`
  };
}

function generateQuestionId() {
  return 'q_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
}

function getRandomVocabulary(vocabulary, count = 1) {
  if (count === 1) {
    return vocabulary[Math.floor(Math.random() * vocabulary.length)];
  }
  
  const shuffled = shuffleArray([...vocabulary]);
  return shuffled.slice(0, Math.min(count, vocabulary.length));
}

function generateDistractors(vocabulary, targetWord, count) {
  const others = vocabulary.filter(word => word.translation !== targetWord.translation);
  const shuffled = shuffleArray(others);
  return shuffled.slice(0, count).map(word => word.translation);
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateSentence(targetWord, level) {
  const templates = [
    `I want to buy ${targetWord.translation}.`,
    `The ${targetWord.translation} is very good.`,
    `Where is the ${targetWord.translation}?`,
    `This ${targetWord.translation} is expensive.`,
    `I like ${targetWord.translation}.`
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
}

function generateContext(word, level) {
  return `This word is commonly used in ${word.category || 'general'} contexts.`;
}

function generateAcceptableAnswers(word) {
  const answers = [word.translation, word.translation.toLowerCase()];
  
  // Add common variations
  if (word.alternatives) {
    answers.push(...word.alternatives);
  }
  
  return [...new Set(answers)];
}

function generateListeningAcceptableAnswers(sentence) {
  const answers = [sentence, sentence.toLowerCase()];
  
  // Add versions without punctuation
  answers.push(sentence.replace(/[.,!?]/g, ''));
  answers.push(sentence.toLowerCase().replace(/[.,!?]/g, ''));
  
  return [...new Set(answers)];
}

function generateAudioUrl(text, questionId) {
  // This would integrate with a text-to-speech service
  return `/api/tts?text=${encodeURIComponent(text)}&id=${questionId}`;
}

function generateHints(type, count) {
  const hints = [];
  
  for (let i = 0; i < count; i++) {
    switch (type) {
      case 'multiple-choice':
        hints.push('Look for grammatical clues in the question');
        break;
      case 'translation':
        hints.push('Think about the context and word structure');
        break;
      case 'fill-blanks':
        hints.push('Consider the sentence structure and meaning');
        break;
      default:
        hints.push('Take your time and think carefully');
    }
  }
  
  return hints.slice(0, count);
}

export function validateAnswer(question, userAnswer) {
  const result = {
    correct: false,
    score: 0,
    feedback: '',
    explanation: question.explanation || ''
  };
  
  switch (question.type) {
    case 'multiple-choice':
    case 'true-false':
      result.correct = userAnswer === question.correctAnswer;
      break;
      
    case 'fill-blanks':
    case 'translation':
      result.correct = question.acceptableAnswers.some(answer => 
        normalizeAnswer(userAnswer) === normalizeAnswer(answer)
      );
      break;
      
    case 'matching':
      result.correct = validateMatching(question.correctPairs, userAnswer);
      break;
      
    case 'ordering':
      result.correct = validateOrdering(question.correctOrder, userAnswer);
      break;
      
    case 'listening':
      result.correct = question.acceptableAnswers.some(answer => 
        normalizeAnswer(userAnswer) === normalizeAnswer(answer)
      );
      break;
      
    case 'speaking':
      // This would integrate with speech recognition
      result.correct = calculateSpeechScore(question.targetText, userAnswer) > 0.7;
      break;
  }
  
  result.score = result.correct ? question.points : 0;
  result.feedback = result.correct ? 'Correct!' : 'Incorrect. ' + question.explanation;
  
  return result;
}

function normalizeAnswer(answer) {
  return answer.toString().toLowerCase().trim().replace(/[.,!?]/g, '');
}

function validateMatching(correctPairs, userPairs) {
  const correctCount = Object.keys(correctPairs).filter(key => 
    correctPairs[key] === userPairs[key]
  ).length;
  
  return correctCount === Object.keys(correctPairs).length;
}

function validateOrdering(correctOrder, userOrder) {
  if (correctOrder.length !== userOrder.length) return false;
  
  return correctOrder.every((word, index) => 
    normalizeAnswer(word) === normalizeAnswer(userOrder[index])
  );
}

function calculateSpeechScore(target, spoken) {
  // Placeholder for speech recognition scoring
  // This would integrate with a speech recognition API
  return Math.random() * 0.4 + 0.6; // Random score between 0.6-1.0
}

export function getQuestionsByType(type, vocabulary, grammar, level, count = 5) {
  const questions = [];
  
  for (let i = 0; i < count; i++) {
    questions.push(generateQuestion(type, vocabulary, grammar, level, 'mixed'));
  }
  
  return questions;
}

export function generateQuizQuestions(lessonData, questionCount = 10) {
  const { vocabulary, grammar, level, category } = lessonData;
  const questions = [];
  const availableTypes = Object.keys(questionTypes);
  
  // Distribute questions across different types
  const typeDistribution = distributeQuestionTypes(availableTypes, questionCount, level);
  
  typeDistribution.forEach(({ type, count }) => {
    for (let i = 0; i < count; i++) {
      questions.push(generateQuestion(type, vocabulary, grammar, level, category));
    }
  });
  
  return shuffleArray(questions);
}

function distributeQuestionTypes(types, totalCount, level) {
  const distribution = [];
  const availableTypes = types.filter(type => {
    // Some question types are only available at higher levels
    if (type === 'speaking' && level < 4) return false;
    if (type === 'listening' && level < 3) return false;
    if (type === 'translation' && level < 2) return false;
    return true;
  });
  
  const baseCount = Math.floor(totalCount / availableTypes.length);
  const remainder = totalCount % availableTypes.length;
  
  availableTypes.forEach((type, index) => {
    const count = baseCount + (index < remainder ? 1 : 0);
    if (count > 0) {
      distribution.push({ type, count });
    }
  });
  
  return distribution;
}

export function calculateQuizScore(questions, answers) {
  let totalScore = 0;
  let maxScore = 0;
  let correctCount = 0;
  
  questions.forEach((question, index) => {
    const userAnswer = answers[index];
    const result = validateAnswer(question, userAnswer);
    
    totalScore += result.score;
    maxScore += question.points;
    if (result.correct) correctCount++;
  });
  
  return {
    score: totalScore,
    maxScore,
    percentage: Math.round((totalScore / maxScore) * 100),
    correctCount,
    totalCount: questions.length,
    accuracy: Math.round((correctCount / questions.length) * 100)
  };
}


