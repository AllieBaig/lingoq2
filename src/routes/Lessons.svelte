




<script>
  import { onMount } from 'svelte';
  import LessonCard from '../components/LessonCard.svelte';
  import LoadingSpinner from '../components/LoadingSpinner.svelte';
  import ErrorMessage from '../components/ErrorMessage.svelte';
  
  let lessons = [];
  let loading = true;
  let error = null;
  let searchTerm = '';
  let selectedCategory = 'all';
  let sortBy = 'created';
  
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'math', label: 'Mathematics' },
    { value: 'science', label: 'Science' },
    { value: 'language', label: 'Language Arts' },
    { value: 'history', label: 'History' },
    { value: 'programming', label: 'Programming' }
  ];
  
  const sortOptions = [
    { value: 'created', label: 'Date Created' },
    { value: 'title', label: 'Title' },
    { value: 'difficulty', label: 'Difficulty' },
    { value: 'duration', label: 'Duration' }
  ];
  
  onMount(async () => {
    await loadLessons();
  });
  
  async function loadLessons() {
    try {
      loading = true;
      error = null;
      
      const response = await fetch('/api/lessons');
      if (!response.ok) {
        throw new Error(`Failed to load lessons: ${response.statusText}`);
      }
      
      lessons = await response.json();
    } catch (err) {
      error = err.message;
      console.error('Error loading lessons:', err);
    } finally {
      loading = false;
    }
  }
  
  function handleSearch(event) {
    searchTerm = event.target.value.toLowerCase();
  }
  
  function handleCategoryChange(event) {
    selectedCategory = event.target.value;
  }
  
  function handleSortChange(event) {
    sortBy = event.target.value;
  }
  
  $: filteredLessons = lessons
    .filter(lesson => {
      const matchesSearch = lesson.title.toLowerCase().includes(searchTerm) ||
                           lesson.description.toLowerCase().includes(searchTerm);
      const matchesCategory = selectedCategory === 'all' || lesson.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'difficulty':
          const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        case 'duration':
          return a.estimatedDuration - b.estimatedDuration;
        case 'created':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
</script>

<svelte:head>
  <title>Lessons - Learning Platform</title>
  <meta name="description" content="Browse and discover educational lessons across various subjects" />
</svelte:head>

<div class="lessons-page">
  <header class="page-header">
    <h1>All Lessons</h1>
    <p>Discover educational content across various subjects and skill levels</p>
  </header>
  
  <div class="filters-section">
    <div class="search-bar">
      <input
        type="text"
        placeholder="Search lessons..."
        on:input={handleSearch}
        class="search-input"
      />
    </div>
    
    <div class="filter-controls">
      <select on:change={handleCategoryChange} class="filter-select">
        {#each categories as category}
          <option value={category.value}>{category.label}</option>
        {/each}
      </select>
      
      <select on:change={handleSortChange} class="filter-select">
        {#each sortOptions as option}
          <option value={option.value}>Sort by {option.label}</option>
        {/each}
      </select>
    </div>
  </div>
  
  <main class="lessons-content">
    {#if loading}
      <LoadingSpinner />
    {:else if error}
      <ErrorMessage message={error} />
      <button on:click={loadLessons} class="retry-button">
        Try Again
      </button>
    {:else if filteredLessons.length === 0}
      <div class="no-results">
        <h3>No lessons found</h3>
        <p>Try adjusting your search terms or filters</p>
      </div>
    {:else}
      <div class="lessons-grid">
        {#each filteredLessons as lesson (lesson.id)}
          <LessonCard {lesson} />
        {/each}
      </div>
    {/if}
  </main>
</div>

<style>
  .lessons-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .page-header {
    text-align: center;
    margin-bottom: 3rem;
  }
  
  .page-header h1 {
    font-size: 2.5rem;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }
  
  .page-header p {
    font-size: 1.1rem;
    color: var(--text-secondary);
  }
  
  .filters-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: var(--surface-color);
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .search-bar {
    flex: 1;
  }
  
  .search-input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    font-size: 1rem;
    background: var(--background-color);
    color: var(--text-primary);
  }
  
  .search-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }
  
  .filter-controls {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }
  
  .filter-select {
    padding: 0.5rem 1rem;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    background: var(--background-color);
    color: var(--text-primary);
    font-size: 0.9rem;
    cursor: pointer;
  }
  
  .filter-select:focus {
    outline: none;
    border-color: var(--primary-color);
  }
  
  .lessons-content {
    min-height: 400px;
  }
  
  .lessons-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }
  
  .no-results {
    text-align: center;
    padding: 3rem;
    color: var(--text-secondary);
  }
  
  .no-results h3 {
    margin-bottom: 0.5rem;
    color: var(--text-primary);
  }
  
  .retry-button {
    display: block;
    margin: 1rem auto;
    padding: 0.75rem 1.5rem;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.2s;
  }
  
  .retry-button:hover {
    background: var(--primary-dark);
  }
  
  @media (min-width: 768px) {
    .filters-section {
      flex-direction: row;
      align-items: center;
    }
    
    .filter-controls {
      flex-wrap: nowrap;
    }
  }
  
  @media (max-width: 640px) {
    .lessons-page {
      padding: 1rem;
    }
    
    .page-header h1 {
      font-size: 2rem;
    }
    
    .lessons-grid {
      grid-template-columns: 1fr;
    }
  }
</style>


