




<script>
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();
  
  export let question;
  export let currentAnswer = '';
  export let showResult = false;
  export let isCorrect = false;
  export let disabled = false;
  
  let selectedOption = '';
  
  function handleSubmit() {
    if (selectedOption && !disabled) {
      dispatch('answer', {
        answer: selectedOption,
        isCorrect: selectedOption === question.correct
      });
    }
  }
  
  function handleOptionSelect(option) {
    if (!disabled) {
      selectedOption = option;
    }
  }
  
  $: if (showResult) {
    selectedOption = currentAnswer;
  }
</script>

<div class="question-card" class:disabled>
  <div class="question-header">
    <h2 class="question-title">{question.question}</h2>
    {#if question.category}
      <span class="category-badge">{question.category}</span>
    {/if}
  </div>
  
  <div class="options-container">
    {#each question.options as option, index}
      <button
        class="option-button"
        class:selected={selectedOption === option}
        class:correct={showResult && option === question.correct}
        class:incorrect={showResult && selectedOption === option && option !== question.correct}
        class:disabled
        on:click={() => handleOptionSelect(option)}
        disabled={disabled}
      >
        <span class="option-letter">{String.fromCharCode(65 + index)}</span>
        <span class="option-text">{option}</span>
        {#if showResult && option === question.correct}
          <span class="result-icon correct">✓</span>
        {:else if showResult && selectedOption === option && option !== question.correct}
          <span class="result-icon incorrect">✗</span>
        {/if}
      </button>
    {/each}
  </div>
  
  {#if !showResult && !disabled}
    <div class="submit-container">
      <button
        class="submit-button"
        class:ready={selectedOption}
        on:click={handleSubmit}
        disabled={!selectedOption}
      >
        Submit Answer
      </button>
    </div>
  {/if}
  
  {#if showResult && question.explanation}
    <div class="explanation">
      <h3>Explanation:</h3>
      <p>{question.explanation}</p>
    </div>
  {/if}
</div>

<style>
  .question-card {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    margin: 0 auto;
    transition: opacity 0.3s ease;
  }
  
  .question-card.disabled {
    opacity: 0.7;
  }
  
  .question-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 2rem;
    gap: 1rem;
  }
  
  .question-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
    line-height: 1.4;
    flex: 1;
  }
  
  .category-badge {
    background: #e5e7eb;
    color: #374151;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
    white-space: nowrap;
  }
  
  .options-container {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 2rem;
  }
  
  .option-button {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    background: white;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;
    font-size: 1rem;
  }
  
  .option-button:hover:not(.disabled) {
    border-color: #3b82f6;
    background: #f8fafc;
  }
  
  .option-button.selected {
    border-color: #3b82f6;
    background: #eff6ff;
  }
  
  .option-button.correct {
    border-color: #10b981;
    background: #ecfdf5;
  }
  
  .option-button.incorrect {
    border-color: #ef4444;
    background: #fef2f2;
  }
  
  .option-button.disabled {
    cursor: not-allowed;
  }
  
  .option-letter {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    background: #f3f4f6;
    border-radius: 50%;
    font-weight: 600;
    color: #374151;
    flex-shrink: 0;
  }
  
  .option-button.selected .option-letter {
    background: #3b82f6;
    color: white;
  }
  
  .option-button.correct .option-letter {
    background: #10b981;
    color: white;
  }
  
  .option-button.incorrect .option-letter {
    background: #ef4444;
    color: white;
  }
  
  .option-text {
    flex: 1;
    line-height: 1.4;
  }
  
  .result-icon {
    font-weight: bold;
    font-size: 1.25rem;
  }
  
  .result-icon.correct {
    color: #10b981;
  }
  
  .result-icon.incorrect {
    color: #ef4444;
  }
  
  .submit-container {
    display: flex;
    justify-content: center;
  }
  
  .submit-button {
    background: #6b7280;
    color: white;
    border: none;
    padding: 0.75rem 2rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .submit-button.ready {
    background: #3b82f6;
  }
  
  .submit-button.ready:hover {
    background: #2563eb;
  }
  
  .submit-button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
  
  .explanation {
    margin-top: 1.5rem;
    padding: 1rem;
    background: #f8fafc;
    border-radius: 8px;
    border-left: 4px solid #3b82f6;
  }
  
  .explanation h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1rem;
    font-weight: 600;
    color: #1f2937;
  }
  
  .explanation p {
    margin: 0;
    color: #4b5563;
    line-height: 1.5;
  }
  
  @media (max-width: 640px) {
    .question-card {
      padding: 1.5rem;
      margin: 1rem;
    }
    
    .question-header {
      flex-direction: column;
      gap: 0.75rem;
    }
    
    .option-button {
      padding: 0.75rem;
    }
    
    .option-letter {
      width: 1.5rem;
      height: 1.5rem;
      font-size: 0.875rem;
    }
  }
</style>







