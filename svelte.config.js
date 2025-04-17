import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: vitePreprocess(),
	kit: {
		// ... other config
		alias: {
			"@/*": "./src/lib/*",
			"@components/*": "./src/components/*",
		},
		adapter: adapter()
	}
};

export default config;
