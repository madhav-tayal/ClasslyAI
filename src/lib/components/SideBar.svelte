<script lang='ts'>
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
	import { Settings } from 'lucide-svelte';
	
    const links: App.Link[] = [
		{ name: 'Home', path: '/', icon: faHome, size: '2x' },
		{ name: 'Dashboard', path: '/dashboard', icon: faTachometerAlt, size: '2x' },
		{ name: 'Quizzes', path: '/quizzes', icon: faQuestionCircle, size: '2x' },
		{ name: 'About', path: '/about', icon: faInfoCircle, size: '2x' }
       
	];
    </script>


<aside class="sidebar" role="navigation">
	
	<nav>
		<ul>
			{#each links as link (link.path)}
				<li>
					<a href={resolve(link.path)} class:active={page.url.pathname === resolve(link.path)}>
						<Icon icon={link.icon} size={link.size} />
						<span>{link.name}</span>
					</a>
				</li>
			{/each}
            <li id='settings'>
					<a href='/settings' >
						<Icon icon={faCog} size={'2x'} />
						<span>{'Settings'}</span>
					</a>
				</li>
		</ul>
	</nav>
	
</aside>
<style>
	* {
		--sidebar: 4rem;
	}

	
	
	.sidebar {
		position: fixed;
		background-color: var(--bg);
		transition: width var(--time) ease;
		overflow: none;
		z-index: 10;
		position: fixed;
		display: grid;
		grid-template-rows: auto 1fr auto;
		border-right: 1px solid var(--muted);
	}
	.sidebar ul,
	li,
	a {display: flex; flex-direction: column;}
	
	.sidebar a
	{
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 1rem;
	}

	.sidebar a:hover
	{
		color: var(--muted);
	}
	.sidebar a.active {
		color: var(--muted);
	}
	.sidebar a
	{
		color: var(--text);
	}

	
	

	@media only screen and (max-width: 600px) {
		.sidebar {
			bottom: 0;
			width: 100vw;
			height: var(--sidebar);
			overflow: hidden;
		}
		
		span,
		:global(.theme-toggle) {
			display: none;
		}

		.sidebar ul {
			display: flex;
			justify-content: space-around;
		}
		
		
	}

	@media only screen and (min-width: 600px) {
		.sidebar {
			top: 0;
			width: var(--sidebar);
			height: 100vh;
		}
		.sidebar:hover {
			width: 16rem;
		}

		.sidebar span {
			display: none;
			margin: 0 2rem;
		}
		.sidebar:hover span {
			display: flex;
			flex-direction: row;
		}
	}
</style>