<script lang="ts">
	import '../app.css';
	import type { Snippet } from 'svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import {
		faHome,
		faTachometerAlt,
		faQuestionCircle,
		faInfoCircle,
		faCog,
		faCloudMoonRain
	} from '@fortawesome/free-solid-svg-icons';
	import { page } from '$app/state';

	import { PUBLIC_CONVEX_URL } from '$env/static/public';
	import { setupConvex } from 'convex-svelte';
	setupConvex(PUBLIC_CONVEX_URL);

	import { resolve } from '$app/paths';
	import ModeToggle from '$lib/components/ModeToggle.svelte';
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
	import SideBar from '$lib/components/SideBar.svelte';



	let { children }: { children: Snippet } = $props();

	// 2. APPLY the global App.Link type here
	const links: App.Link[] = [
		{ name: 'Home', path: '/', icon: faHome, size: '2x' },
		{ name: 'Dashboard', path: '/dashboard', icon: faTachometerAlt, size: '2x' },
		{ name: 'Quizzes', path: '/quizzes', icon: faQuestionCircle, size: '2x' },
		{ name: 'About', path: '/about', icon: faInfoCircle, size: '2x' }
	];
</script>

<SideBar></SideBar>

<div class="colors">
	<ModeToggle />
	<ThemeSwitcher />
</div>

<main>
	{@render children()}
</main>

<style>
	* {
		--sidebar: 4rem;
	}

	.colors {
		position: fixed;
		top: 0;
		right: 0;
		margin: 2rem 2rem 0rem 0rem;
	}

	main {
		margin-left: var(--sidebar);
	}
	
	
	div {
		height: 4rem;
		text-decoration: none;
	}
	
	div {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 1rem;
	}

	
	div:hover {
		color: var(--muted);
	}
	
		
	
	div {
		color: var(--text);
	}

	
	
	

	@media only screen and (max-width: 600px) {
		
		main {
			margin: 0;
		}
	}

	
</style>
