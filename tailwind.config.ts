import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

export default {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/preline/preline.js'],

	theme: {
		extend: {}
	},

	plugins: [typography, forms, require('preline/plugin')]
} satisfies Config;
