// src/app.d.ts
import type { IconSize } from 'svelte-fa';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

declare global {
	namespace App {
		interface Link {
			name: string;
			path: '/' | '/dashboard' | '/study' | '/quizzes' | '/settings' | '/about';
			icon: IconDefinition;
			size?: IconSize | string;
		}

		interface Column {
			key: string;
			label: string;
			sortable?: boolean;
			align?: 'left' | 'center' | 'right';
			width?: string;
		}
	}
}

export {};
