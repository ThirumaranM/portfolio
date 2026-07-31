import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const key = '@riadh-adrani-theme';

const updateLocalStorage = (value: boolean) => {
	if (browser) {
		localStorage.setItem(key, JSON.stringify(value));
	}
};

const getInitialTheme = (): boolean => {
	if (!browser) return false; // SSR always defaults to light
	try {
		const stored = localStorage.getItem(key);
		if (stored !== null) return JSON.parse(stored) === true;
		return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
	} catch {
		return false;
	}
};

const initialTheme = getInitialTheme();

// Apply data-theme immediately at module load (browser only), before first Svelte render
if (browser) {
	document.documentElement.setAttribute('data-theme', initialTheme ? 'dark' : 'light');
}

export const theme = writable<boolean>(initialTheme);

export const toggleTheme = (value?: boolean) =>
	theme.update((it) => {
		const $v = typeof value === 'boolean' ? value : !it;

		updateLocalStorage($v);

		document.querySelector(':root')?.setAttribute('data-theme', $v ? 'dark' : 'light');

		return $v;
	});

export const onHydrated = () => {
	const fromStore = localStorage.getItem(key);

	if (!fromStore) {
		if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
			// dark mode
			toggleTheme(true);
		}
		else {
			// light mode
			toggleTheme(false);
		}
	} else {
		toggleTheme(JSON.parse(fromStore));
	}
};
