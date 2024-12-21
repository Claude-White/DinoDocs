import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

export default {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/preline/preline.js'],

	theme: {
		extend: {
			animation: {
				'bounce-in': 'bounce-in 0.3s'
			},
			keyframes: {
				'bounce-in': {
					'0%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(0.95)' }, // Scale down a bit
					'100%': { transform: 'scale(1)' } // Return to normal size
				}
			},
		}
	},

	plugins: [typography, forms, require('preline/plugin')]
} satisfies Config;
