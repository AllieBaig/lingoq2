




<!--
  Purpose: Quiz route component for interactive language assessments and skill testing
  Key features: Multiple choice questions, progress tracking, scoring, results display
  Dependencies: Svelte stores, quiz data management, progress tracking utilities
  Related helpers: QuizCard, ProgressBar, ScoreDisplay, QuestionNavigation components
  Function names: startQuiz, submitAnswer, calculateScore, showResults, nextQuestion
  MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
  2025-06-10 14:30 | File: src/routes/Quiz.svelte
-->

<script>
  import { onMount, onDestroy } from 'svelte';
  import { writable } from 'svelte/store';
  import { ChevronLeft, ChevronRight, Clock, Trophy, Target, CheckCircle2, XCircle, RotateCcw } from 'lucide-svelte';

  // Quiz state management
  let currentQuestionIndex = 0;
  let selectedAnswer = null;
  let quizStarted = false;
  let quizCompleted = false;
  let timeLeft = 300; // 5 minutes default
  let timer = null;
  let userAnswers = [];
  let score = 0;
  let showResults = false;

  // Quiz data - this would typically come from an API or store
  let quizData = {
    title: "Spanish Vocabulary Challenge",
    description: "Test your knowledge of common Spanish words and phrases",
    timeLimit: 300,
    passingScore: 70,
    questions: [
      {
        id: 1,
        question: "What does 'Hola' mean in English?",
        options: ["Goodbye", "Hello", "Thank you", "Please"],
        correct: 1,
        explanation: "'Hola' is the most common way to say 'Hello' in Spanish."
      },
      {
        id: 2,
        question: "How do you say 'Thank you' in Spanish?",
        options: ["Por favor", "De nada", "Gracias", "Lo siento"],
        correct: 2,
        explanation: "'Gracias' means 'Thank you' in Spanish."
      },
      {
        id: 3,
        question: "What is the Spanish word for 'water'?",
        options: ["Leche", "Agua", "Jugo", "Café"],
        correct: 1,
        explanation: "'Agua' is the Spanish word for 'water'."
      },
      {
        id: 4,
        question: "How do you say 'Good morning' in Spanish?",
        options: ["Buenas noches", "Buenas tardes", "Buenos días", "Hasta luego"],
        correct: 2,
        explanation: "'Buenos días' is used to say 'Good morning' in Spanish."
      },
      {
        id: 5,
        question: "What does 'Casa' mean?",
        options: ["Car", "House", "School", "Store"],
        correct: 1,
        explanation: "'Casa' means 'House' or 'Home' in Spanish."
      }
    ]
  };

  // Reactive statements
  $: currentQuestion = quizData.questions[currentQuestionIndex];
  $: isLastQuestion = currentQuestionIndex === quizData.questions.length - 1;
  $: isFirstQuestion = currentQuestionIndex === 0;
  $: progressPercentage = ((currentQuestionIndex + 1) / quizData.questions.length) * 100;
  $: timePercentage = (timeLeft / quizData.timeLimit) * 100;
  $: scorePercentage = (score / quizData.questions.length) * 100;
  $: passed = scorePercentage >= quizData.passingScore;

  // Start quiz function
  function startQuiz() {
    quizStarted = true;
    userAnswers = new Array(quizData.questions.length).fill(null);
    startTimer();
  }

  // Timer functions
  function startTimer() {
    timer = setInterval(() => {
      timeLeft--;
      if (timeLeft <= 0) {
        endQuiz();
      }
    }, 1000);
  }

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  // Answer selection
  function selectAnswer(answerIndex) {
    selectedAnswer = answerIndex;
    userAnswers[currentQuestionIndex] = answerIndex;
  }

  // Navigation functions
  function nextQuestion() {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      currentQuestionIndex++;
      selectedAnswer = userAnswers[currentQuestionIndex];
    }
  }

  function previousQuestion() {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      selectedAnswer = userAnswers[currentQuestionIndex];
    }
  }

  function goToQuestion(index) {
    currentQuestionIndex = index;
    selectedAnswer = userAnswers[currentQuestionIndex];
  }

  // Quiz completion
  function endQuiz() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    
    // Calculate score
    score = 0;
    userAnswers.forEach((answer, index) => {
      if (answer === quizData.questions[index].correct) {
        score++;
      }
    });

    quizCompleted = true;
    showResults = true;
  }

  function restartQuiz() {
    currentQuestionIndex = 0;
    selectedAnswer = null;
    quizStarted = false;
    quizCompleted = false;
    timeLeft = quizData.timeLimit;
    userAnswers = [];
    score = 0;
    showResults = false;
    
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  // Cleanup
  onDestroy(() => {
    if (timer) {
      clearInterval(timer);
    }
  });
</script>

<svelte:head>
  <title>Quiz - LingoQuest</title>
  <meta name="description" content="Test your language skills with interactive quizzes" />
</svelte:head>

<div class="quiz-container">
  {#if !quizStarted}
    <!-- Quiz Introduction -->
    <div class="quiz-intro">
      <div class="quiz-header">
        <div class="quiz-icon">
          <Trophy size={48} />
        </div>
        <h1>{quizData.title}</h1>
        <p class="quiz-description">{quizData.description}</p>
      </div>

      <div class="quiz-info">
        <div class="info-card">
          <Target class="info-icon" />
          <div>
            <h3>{quizData.questions.length} Questions</h3>
            <p>Multiple choice format</p>
          </div>
        </div>

        <div class="info-card">
          <Clock class="info-icon" />
          <div>
            <h3>{formatTime(quizData.timeLimit)}</h3>
            <p>Time limit</p>
          </div>
        </div>

        <div class="info-card">
          <Trophy class="info-icon" />
          <div>
            <h3>{quizData.passingScore}%</h3>
            <p>Passing score</p>
          </div>
        </div>
      </div>

      <button class="btn btn-primary btn-lg start-quiz-btn" on:click={startQuiz}>
        Start Quiz
      </button>
    </div>

  {:else if showResults}
    <!-- Quiz Results -->
    <div class="quiz-results">
      <div class="results-header">
        <div class="score-circle" class:passed>
          <span class="score-number">{Math.round(scorePercentage)}%</span>
          <span class="score-label">Score</span>
        </div>
        
        <h2 class="results-title">
          {#if passed}
            🎉 Congratulations!
          {:else}
            💪 Keep Practicing!
          {/if}
        </h2>
        
        <p class="results-message">
          {#if passed}
            You passed the quiz! Great job on your language skills.
          {:else}
            Don't worry, practice makes perfect. Try again to improve your score.
          {/if}
        </p>
      </div>

      <div class="results-stats">
        <div class="stat-item">
          <CheckCircle2 class="stat-icon success" />
          <div>
            <span class="stat-number">{score}</span>
            <span class="stat-label">Correct</span>
          </div>
        </div>

        <div class="stat-item">
          <XCircle class="stat-icon error" />
          <div>
            <span class="stat-number">{quizData.questions.length - score}</span>
            <span class="stat-label">Incorrect</span>
          </div>
        </div>

        <div class="stat-item">
          <Clock class="stat-icon" />
          <div>
            <span class="stat-number">{formatTime(quizData.timeLimit - timeLeft)}</span>
            <span class="stat-label">Time Used</span>
          </div>
        </div>
      </div>

      <div class="results-actions">
        <button class="btn btn-secondary" on:click={restartQuiz}>
          <RotateCcw size={20} />
          Try Again
        </button>
        <a href="/lessons" class="btn btn-primary">
          Continue Learning
        </a>
      </div>
    </div>

  {:else}
    <!-- Active Quiz -->
    <div class="quiz-active">
      <!-- Quiz Header -->
      <div class="quiz-progress-header">
        <div class="progress-info">
          <span class="question-counter">
            Question {currentQuestionIndex + 1} of {quizData.questions.length}
          </span>
          <div class="timer" class:warning={timeLeft < 60}>
            <Clock size={16} />
            {formatTime(timeLeft)}
          </div>
        </div>
        
        <div class="progress-bar">
          <div class="progress-fill" style="width: {progressPercentage}%"></div>
        </div>
      </div>

      <!-- Question Content -->
      <div class="question-content">
        <h2 class="question-text">{currentQuestion.question}</h2>

        <div class="options-grid">
          {#each currentQuestion.options as option, index}
            <button
              class="option-button"
              class:selected={selectedAnswer === index}
              on:click={() => selectAnswer(index)}
            >
              <span class="option-letter">{String.fromCharCode(65 + index)}</span>
              <span class="option-text">{option}</span>
            </button>
          {/each}
        </div>
      </div>

      <!-- Question Navigation -->
      <div class="question-navigation">
        <div class="nav-buttons">
          <button
            class="btn btn-secondary"
            disabled={isFirstQuestion}
            on:click={previousQuestion}
          >
            <ChevronLeft size={20} />
            Previous
          </button>

          {#if isLastQuestion}
            <button
              class="btn btn-primary"
              disabled={selectedAnswer === null}
              on:click={endQuiz}
            >
              Finish Quiz
            </button>
          {:else}
            <button
              class="btn btn-primary"
              disabled={selectedAnswer === null}
              on:click={nextQuestion}
            >
              Next
              <ChevronRight size={20} />
            </button>
          {/if}
        </div>

        <!-- Question Dots -->
        <div class="question-dots">
          {#each quizData.questions as _, index}
            <button
              class="dot"
              class:current={index === currentQuestionIndex}
              class:answered={userAnswers[index] !== null}
              on:click={() => goToQuestion(index)}
            >
              {index + 1}
            </button>
          {/each}
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .quiz-container {
    max-width: 800px;
    margin: 0 auto;
    padding: var(--spacing-6);
  }

  /* Quiz Introduction Styles */
  .quiz-intro {
    text-align: center;
    padding: var(--spacing-8) 0;
  }

  .quiz-header {
    margin-bottom: var(--spacing-8);
  }

  .quiz-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    background: var(--primary-gradient);
    border-radius: 50%;
    color: white;
    margin-bottom: var(--spacing-4);
  }

  .quiz-intro h1 {
    font-size: var(--font-size-3xl);
    margin-bottom: var(--spacing-3);
    color: var(--text-color);
  }

  .quiz-description {
    font-size: var(--font-size-lg);
    color: var(--text-secondary);
    margin-bottom: var(--spacing-6);
  }

  .quiz-info {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spacing-4);
    margin-bottom: var(--spacing-8);
  }

  .info-card {
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
    padding: var(--spacing-4);
    background: var(--bg-primary);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border-color);
  }

  .info-icon {
    color: var(--primary-color);
    flex-shrink: 0;
  }

  .info-card h3 {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    margin-bottom: var(--spacing-1);
  }

  .info-card p {
    font-size: var(--font-size-sm);
    color: var(--text-muted);
    margin: 0;
  }

  .start-quiz-btn {
    padding: var(--spacing-4) var(--spacing-8);
    font-size: var(--font-size-lg);
  }

  /* Active Quiz Styles */
  .quiz-active {
    display: flex;
    flex-direction: column;
    min-height: 70vh;
  }

  .quiz-progress-header {
    margin-bottom: var(--spacing-6);
  }

  .progress-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-3);
  }

  .question-counter {
    font-weight: var(--font-weight-medium);
    color: var(--text-secondary);
  }

  .timer {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
    font-weight: var(--font-weight-medium);
    color: var(--text-color);
    padding: var(--spacing-2) var(--spacing-3);
    background: var(--bg-secondary);
    border-radius: var(--border-radius);
  }

  .timer.warning {
    color: var(--error-color);
    background: var(--error-light);
  }

  .question-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-bottom: var(--spacing-6);
  }

  .question-text {
    font-size: var(--font-size-2xl);
    text-align: center;
    margin-bottom: var(--spacing-8);
    color: var(--text-color);
  }

  .options-grid {
    display: grid;
    gap: var(--spacing-3);
    max-width: 600px;
    margin: 0 auto;
  }

  .option-button {
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
    padding: var(--spacing-4);
    background: var(--bg-primary);
    border: 2px solid var(--border-color);
    border-radius: var(--border-radius-lg);
    cursor: pointer;
    transition: all var(--transition-fast);
    text-align: left;
  }

  .option-button:hover {
    border-color: var(--primary-color);
    box-shadow: var(--shadow-md);
  }

  .option-button.selected {
    border-color: var(--primary-color);
    background: var(--primary-color-20);
  }

  .option-letter {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: var(--bg-secondary);
    border-radius: 50%;
    font-weight: var(--font-weight-semibold);
    font-size: var(--font-size-sm);
    flex-shrink: 0;
  }

  .option-button.selected .option-letter {
    background: var(--primary-color);
    color: white;
  }

  .option-text {
    font-size: var(--font-size-base);
  }

  /* Navigation Styles */
  .question-navigation {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-4);
  }

  .nav-buttons {
    display: flex;
    justify-content: space-between;
    gap: var(--spacing-3);
  }

  .question-dots {
    display: flex;
    justify-content: center;
    gap: var(--spacing-2);
    flex-wrap: wrap;
  }

  .dot {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid var(--border-color);
    background: var(--bg-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .dot:hover {
    border-color: var(--primary-color);
  }

  .dot.current {
    border-color: var(--primary-color);
    background: var(--primary-color);
    color: white;
  }

  .dot.answered {
    border-color: var(--success-color);
    background: var(--success-color);
    color: white;
  }

  .dot.answered.current {
    border-color: var(--primary-color);
    background: var(--primary-color);
  }

  /* Results Styles */
  .quiz-results {
    text-align: center;
    padding: var(--spacing-8) 0;
  }

  .results-header {
    margin-bottom: var(--spacing-8);
  }

  .score-circle {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    border: 4px solid var(--error-color);
    margin-bottom: var(--spacing-4);
  }

  .score-circle.passed {
    border-color: var(--success-color);
  }

  .score-number {
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-bold);
    color: var(--text-color);
  }

  .score-label {
    font-size: var(--font-size-sm);
    color: var(--text-muted);
  }

  .results-title {
    font-size: var(--font-size-3xl);
    margin-bottom: var(--spacing-3);
  }

  .results-message {
    font-size: var(--font-size-lg);
    color: var(--text-secondary);
    margin-bottom: var(--spacing-6);
  }

  .results-stats {
    display: flex;
    justify-content: center;
    gap: var(--spacing-6);
    margin-bottom: var(--spacing-8);
  }

  .stat-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
  }

  .stat-icon {
    color: var(--text-muted);
  }

  .stat-icon.success {
    color: var(--success-color);
  }

  .stat-icon.error {
    color: var(--error-color);
  }

  .stat-number {
    display: block;
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-bold);
    color: var(--text-color);
  }

  .stat-label {
    display: block;
    font-size: var(--font-size-sm);
    color: var(--text-muted);
  }

  .results-actions {
    display: flex;
    justify-content: center;
    gap: var(--spacing-4);
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .quiz-container {
      padding: var(--spacing-4);
    }

    .question-text {
      font-size: var(--font-size-xl);
    }

    .nav-buttons {
      flex-direction: column;
    }

    .nav-buttons .btn {
      width: 100%;
    }

    .results-stats {
      flex-direction: column;
      align-items: center;
    }

    .results-actions {
      flex-direction: column;
    }

    .results-actions .btn {
      width: 100%;
    }
  }
</style>


