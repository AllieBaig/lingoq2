

// Purpose: Configure SvelteKit for static site generation and GitHub Pages deployment
// Key features: Static adapter, base path handling, GitHub Pages optimization
// Dependencies: @sveltejs/adapter-static, @sveltejs/vite-plugin-svelte
// Related helpers: +layout.js prerender configuration, .nojekyll file
// Function names: N/A (configuration object)
// MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
// 2025-06-10 17:50 | File: svelte.config.js

import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const dev = process.argv.includes('dev');

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: 'index.html',
			precompress: false,
			strict: true
		}),
		
		prerender: {
			handleHttpError: 'warn',
			handleMissingId: 'warn'
		},
		
		serviceWorker: {
			register: false // We handle service worker registration manually
		},
		
		paths: {
			base: dev ? '' : process.env.BASE_PATH || '/lingoq2'
		},
		
		appDir: 'app' // Avoid underscore prefix for GitHub Pages
	}
};

export default config;


