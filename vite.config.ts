import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		svelte(),
		VitePWA({
			registerType: 'autoUpdate',
			manifest: {
				name: 'Fast And Flexible Search',
				short_name: 'FAFS',
				theme_color: '#f3f4f6', // Light mode theme color
				background_color: '#f3f4f6',
				icons: [
					{
						src: '/app_icon.svg', // Make sure this path is correct
						sizes: '192x192',
						type: 'image/svg+xml'
					}
				]
			},
			workbox: {
				maximumFileSizeToCacheInBytes: 3 * 1024 * 1024 // 3 MB
			}
		})
	]
});
