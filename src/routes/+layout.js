

// Purpose: Enable prerendering for static site generation and set trailing slash behavior
// Key features: Prerender all pages, configure trailing slash for GitHub Pages compatibility
// Dependencies: SvelteKit static adapter
// Related helpers: svelte.config.js adapter configuration
// Function names: N/A (configuration exports only)
// MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
// 2025-06-10 17:50 | File: src/routes/+layout.js

export const prerender = true;
export const trailingSlash = 'always';
