




import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	
	define: {
		'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
	},
	
	server: {
		port: 3000,
		host: true,
		fs: {
			allow: ['..']
		}
	},
	
	preview: {
		port: 4173,
		host: true
	},
	
	build: {
		target: 'es2015',
		sourcemap: true,
		rollupOptions: {
			output: {
				manualChunks: {
					vendor: ['svelte']
				}
			}
		}
	},
	
	optimizeDeps: {
		include: ['svelte']
	},
	
	css: {
		devSourcemap: true
	}
});

