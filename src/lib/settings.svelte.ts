import { browser } from '$app/environment';

const KEY = 'classly:settings';

export interface Settings {
	questionCount: number;
	autoSaveNotes: boolean;
}

const defaults: Settings = {
	questionCount: 3,
	autoSaveNotes: true
};

function load(): Settings {
	if (!browser) return { ...defaults };
	try {
		const stored = localStorage.getItem(KEY);
		return stored ? { ...defaults, ...JSON.parse(stored) } : { ...defaults };
	} catch {
		// Corrupt or blocked storage shouldn't stop the app booting
		return { ...defaults };
	}
}

export const settings = $state<Settings>(load());

export function saveSettings() {
	if (!browser) return;
	localStorage.setItem(KEY, JSON.stringify(settings));
}

export function resetSettings() {
	Object.assign(settings, defaults);
	saveSettings();
}
