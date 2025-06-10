






<script>
  import { onMount } from 'svelte';
  import { user } from '../stores/auth.js';
  import LoadingSpinner from '../components/LoadingSpinner.svelte';
  import ErrorMessage from '../components/ErrorMessage.svelte';
  import ProgressChart from '../components/ProgressChart.svelte';
  import AchievementBadge from '../components/AchievementBadge.svelte';
  
  let userProfile = null;
  let loading = true;
  let error = null;
  let editMode = false;
  let saveLoading = false;
  let profileForm = {
    displayName: '',
    email: '',
    bio: '',
    learningGoals: '',
    preferredSubjects: []
  };
  
  let stats = {
    completedLessons: 0,
    totalStudyTime: 0,
    streak: 0,
    achievements: []
  };
  
  let recentActivity = [];
  let profilePicture = null;
  let fileInput;
  
  const subjectOptions = [
    'Mathematics',
    'Science',
    'Language Arts',
    'History',
    'Programming',
    'Art',
    'Music',
    'Philosophy'
  ];
  
  onMount(async () => {
    if ($user) {
      await loadProfile();
    }
  });
  
  async function loadProfile() {
    try {
      loading = true;
      error = null;
      
      const [profileResponse, statsResponse, activityResponse] = await Promise.all([
        fetch('/api/user/profile'),
        fetch('/api/user/stats'),
        fetch('/api/user/activity')
      ]);
      
      if (!profileResponse.ok) throw new Error('Failed to load profile');
      if (!statsResponse.ok) throw new Error('Failed to load stats');
      if (!activityResponse.ok) throw new Error('Failed to load activity');
      
      userProfile = await profileResponse.json();
      stats = await statsResponse.json();
      recentActivity = await activityResponse.json();
      
      // Initialize form with current profile data
      profileForm = {
        displayName: userProfile.displayName || '',
        email: userProfile.email || '',
        bio: userProfile.bio || '',
        learningGoals: userProfile.learningGoals || '',
        preferredSubjects: userProfile.preferredSubjects || []
      };
      
    } catch (err) {
      error = err.message;
      console.error('Error loading profile:', err);
    } finally {
      loading = false;
    }
  }
  
  function toggleEditMode() {
    editMode = !editMode;
    if (!editMode) {
      // Reset form if canceling
      profileForm = {
        displayName: userProfile.displayName || '',
        email: userProfile.email || '',
        bio: userProfile.bio || '',
        learningGoals: userProfile.learningGoals || '',
        preferredSubjects: userProfile.preferredSubjects || []
      };
    }
  }
  
  async function saveProfile() {
    try {
      saveLoading = true;
      
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileForm)
      });
      
      if (!response.ok) {
        throw new Error('Failed to save profile');
      }
      
      userProfile = await response.json();
      editMode = false;
      
    } catch (err) {
      error = err.message;
      console.error('Error saving profile:', err);
    } finally {
      saveLoading = false;
    }
  }
  
  function handleSubjectToggle(subject) {
    const index = profileForm.preferredSubjects.indexOf(subject);
    if (index > -1) {
      profileForm.preferredSubjects = profileForm.preferredSubjects.filter(s => s !== subject);
    } else {
      profileForm.preferredSubjects = [...profileForm.preferredSubjects, subject];
    }
  }
  
  function triggerFileUpload() {
    fileInput.click();
  }
  
  async function handleProfilePictureUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('profilePicture', file);
    
    try {
      const response = await fetch('/api/user/profile-picture', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) throw new Error('Failed to upload profile picture');
      
      const result = await response.json();
      userProfile.profilePicture = result.url;
      
    } catch (err) {
      error = err.message;
      console.error('Error uploading profile picture:', err);
    }
  }
  
  function formatStudyTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  }
  
  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
</script>

<svelte:head>
  <title>Profile - Learning Platform</title>
  <meta name="description" content="Manage your learning profile and track your progress" />
</svelte:head>

<div class="profile-page">
  {#if loading}
    <LoadingSpinner />
  {:else if error}
    <ErrorMessage message={error} />
    <button on:click={loadProfile} class="retry-button">
      Try Again
    </button>
  {:else if userProfile}
    <div class="profile-content">
      <div class="profile-header">
        <div class="profile-picture-section">
          <div class="profile-picture">
            {#if userProfile.profilePicture}
              <img src={userProfile.profilePicture} alt="Profile" />
            {:else}
              <div class="profile-avatar">
                {userProfile.displayName?.charAt(0) || userProfile.email?.charAt(0) || 'U'}
              </div>
            {/if}
            <button on:click={triggerFileUpload} class="change-picture-btn">
              Change Photo
            </button>
          </div>
          <input
            bind:this={fileInput}
            type="file"
            accept="image/*"
            on:change={handleProfilePictureUpload}
            style="display: none;"
          />
        </div>
        
        <div class="profile-info">
          {#if editMode}
            <input
              bind:value={profileForm.displayName}
              placeholder="Display Name"
              class="name-input"
            />
            <input
              bind:value={profileForm.email}
              type="email"
              placeholder="Email"
              class="email-input"
            />
          {:else}
            <h1>{userProfile.displayName || 'Anonymous User'}</h1>
            <p class="email">{userProfile.email}</p>
          {/if}
          
          <div class="profile-actions">
            {#if editMode}
              <button
                on:click={saveProfile}
                disabled={saveLoading}
                class="save-btn"
              >
                {saveLoading ? 'Saving...' : 'Save Changes'}
              </button>
              <button on:click={toggleEditMode} class="cancel-btn">
                Cancel
              </button>
            {:else}
              <button on:click={toggleEditMode} class="edit-btn">
                Edit Profile
              </button>
            {/if}
          </div>
        </div>
      </div>
      
      <div class="profile-body">
        <div class="left-column">
          <section class="bio-section">
            <h2>About</h2>
            {#if editMode}
              <textarea
                bind:value={profileForm.bio}
                placeholder="Tell us about yourself..."
                class="bio-textarea"
              ></textarea>
            {:else}
              <p class="bio-text">
                {userProfile.bio || 'No bio provided yet.'}
              </p>
            {/if}
          </section>
          
          <section class="goals-section">
            <h2>Learning Goals</h2>
            {#if editMode}
              <textarea
                bind:value={profileForm.learningGoals}
                placeholder="What are your learning objectives?"
                class="goals-textarea"
              ></textarea>
            {:else}
              <p class="goals-text">
                {userProfile.learningGoals || 'No learning goals set yet.'}
              </p>
            {/if}
          </section>
          
          <section class="subjects-section">
            <h2>Preferred Subjects</h2>
            {#if editMode}
              <div class="subject-checkboxes">
                {#each subjectOptions as subject}
                  <label class="subject-checkbox">
                    <input
                      type="checkbox"
                      checked={profileForm.preferredSubjects.includes(subject)}
                      on:change={() => handleSubjectToggle(subject)}
                    />
                    {subject}
                  </label>
                {/each}
              </div>
            {:else}
              <div class="subject-tags">
                {#each userProfile.preferredSubjects || [] as subject}
                  <span class="subject-tag">{subject}</span>
                {:else}
                  <p class="no-subjects">No preferred subjects selected.</p>
                {/each}
              </div>
            {/if}
          </section>
        </div>
        
        <div class="right-column">
          <section class="stats-section">
            <h2>Learning Statistics</h2>
            <div class="stats-grid">
              <div class="stat-card">
                <h3>{stats.completedLessons}</h3>
                <p>Lessons Completed</p>
              </div>
              <div class="stat-card">
                <h3>{formatStudyTime(stats.totalStudyTime)}</h3>
                <p>Total Study Time</p>
              </div>
              <div class="stat-card">
                <h3>{stats.streak}</h3>
                <p>Day Streak</p>
              </div>
            </div>
            
            {#if stats.completedLessons > 0}
              <div class="progress-chart">
                <h3>Progress Overview</h3>
                <ProgressChart data={stats.progressData} />
              </div>
            {/if}
          </section>
          
          <section class="achievements-section">
            <h2>Achievements</h2>
            {#if stats.achievements && stats.achievements.length > 0}
              <div class="achievements-grid">
                {#each stats.achievements as achievement}
                  <AchievementBadge {achievement} />
                {/each}
              </div>
            {:else}
              <p class="no-achievements">No achievements yet. Keep learning!</p>
            {/if}
          </section>
          
          <section class="activity-section">
            <h2>Recent Activity</h2>
            {#if recentActivity && recentActivity.length > 0}
              <div class="activity-list">
                {#each recentActivity.slice(0, 5) as activity}
                  <div class="activity-item">
                    <div class="activity-icon">
                      {#if activity.type === 'lesson_completed'}
                        ✓
                      {:else if activity.type === 'quiz_passed'}
                        🎯
                      {:else if activity.type === 'badge_earned'}
                        🏆
                      {:else}
                        📚
                      {/if}
                    </div>
                    <div class="activity-details">
                      <p class="activity-description">{activity.description}</p>
                      <p class="activity-date">{formatDate(activity.createdAt)}</p>
                    </div>
                  </div>
                {/each}
              </div>
            {:else}
              <p class="no-activity">No recent activity.</p>
            {/if}
          </section>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .profile-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .profile-content {
    background: var(--surface-color);
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  
  .profile-header {
    display: flex;
    align-items: center;
    gap: 2rem;
    padding: 2rem;
    background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
    color: white;
  }
  
  .profile-picture-section {
    position: relative;
  }
  
  .profile-picture {
    position: relative;
    width: 120px;
    height: 120px;
  }
  
  .profile-picture img,
  .profile-avatar {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .profile-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.2);
    font-size: 2.5rem;
    font-weight: bold;
  }
  
  .change-picture-btn {
    position: absolute;
    bottom: 0;
    right: 0;
    background: var(--accent-color);
    color: white;
    border: none;
    padding: 0.5rem;
    border-radius: 50%;
    cursor: pointer;
    font-size: 0.8rem;
    transition: background-color 0.2s;
  }
  
  .change-picture-btn:hover {
    background: var(--accent-dark);
  }
  
  .profile-info {
    flex: 1;
  }
  
  .profile-info h1 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
  
  .email {
    opacity: 0.9;
    margin-bottom: 1rem;
  }
  
  .name-input,
  .email-input {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    padding: 0.5rem;
    border-radius: 6px;
    margin-bottom: 0.5rem;
    width: 100%;
    max-width: 300px;
  }
  
  .name-input {
    font-size: 1.5rem;
    font-weight: bold;
  }
  
  .name-input::placeholder,
  .email-input::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
  
  .profile-actions {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }
  
  .edit-btn,
  .save-btn,
  .cancel-btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s;
  }
  
  .edit-btn {
    background: rgba(255, 255, 255, 0.2);
    color: white;
  }
  
  .edit-btn:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  
  .save-btn {
    background: var(--success-color);
    color: white;
  }
  
  .save-btn:hover:not(:disabled) {
    background: var(--success-dark);
  }
  
  .save-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .cancel-btn {
    background: transparent;
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
  }
  
  .cancel-btn:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  .profile-body {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    padding: 2rem;
  }
  
  .left-column,
  .right-column {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  
  section {
    background: var(--background-color);
    padding: 1.5rem;
    border-radius: 8px;
    border: 1px solid var(--border-color);
  }
  
  section h2 {
    margin-bottom: 1rem;
    color: var(--text-primary);
    font-size: 1.25rem;
  }
  
  .bio-textarea,
  .goals-textarea {
    width: 100%;
    min-height: 100px;
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    resize: vertical;
    font-family: inherit;
  }
  
  .bio-text,
  .goals-text {
    color: var(--text-secondary);
    line-height: 1.6;
  }
  
  .subject-checkboxes {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 0.5rem;
  }
  
  .subject-checkbox {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }
  
  .subject-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .subject-tag {
    background: var(--primary-light);
    color: var(--primary-color);
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.9rem;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .stat-card {
    text-align: center;
    padding: 1rem;
    background: var(--surface-color);
    border-radius: 8px;
    border: 1px solid var(--border-color);
  }
  
  .stat-card h3 {
    font-size: 1.5rem;
    color: var(--primary-color);
    margin-bottom: 0.25rem;
  }
  
  .stat-card p {
    color: var(--text-secondary);
    font-size: 0.9rem;
  }
  
  .achievements-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 1rem;
  }
  
  .activity-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .activity-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem;
    background: var(--surface-color);
    border-radius: 6px;
    border: 1px solid var(--border-color);
  }
  
  .activity-icon {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--primary-light);
    border-radius: 50%;
    font-size: 1rem;
  }
  
  .activity-details {
    flex: 1;
  }
  
  .activity-description {
    color: var(--text-primary);
    margin-bottom: 0.25rem;
  }
  
  .activity-date {
    color: var(--text-secondary);
    font-size: 0.8rem;
  }
  
  .no-subjects,
  .no-achievements,
  .no-activity {
    color: var(--text-secondary);
    font-style: italic;
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
  
  @media (max-width: 768px) {
    .profile-page {
      padding: 1rem;
    }
    
    .profile-header {
      flex-direction: column;
      text-align: center;
      gap: 1rem;
    }
    
    .profile-body {
      grid-template-columns: 1fr;
    }
    
    .stats-grid {
      grid-template-columns: 1fr;
    }
    
    .subject-checkboxes {
      grid-template-columns: 1fr;
    }
  }
</style>




