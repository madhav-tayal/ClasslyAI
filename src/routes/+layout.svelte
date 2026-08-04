<script lang="ts">
	import '../app.css';
	import type { Snippet } from 'svelte';

	import { PUBLIC_CONVEX_URL } from '$env/static/public';
	import { setupConvex } from 'convex-svelte';
	setupConvex(PUBLIC_CONVEX_URL);

	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
	import SideBar from '$lib/components/SideBar.svelte';

	// The nav lives in SideBar, this just wraps the page around it.
	let { children }: { children: Snippet } = $props();
</script>

<SideBar></SideBar>

<div class="colors">
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
