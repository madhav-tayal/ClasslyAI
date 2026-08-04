<script module lang="ts">
	export interface HistoryItem {
		id: string;
		title: string;
		subtitle?: string;
	}
</script>

<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';
	import Search from '$lib/components/ui/Search.svelte';
	import { faTrash } from '@fortawesome/free-solid-svg-icons';

	let {
		items,
		query = $bindable(''),
		label = 'History',
		searchId = 'history-search',
		placeholder = 'Search…',
		empty = 'Nothing saved yet.',
		onopen,
		onremove
	}: {
		items: HistoryItem[];
		query?: string;
		label?: string;
		searchId?: string;
		placeholder?: string;
		empty?: string;
		onopen: (id: string) => void;
		onremove: (id: string) => void;
	} = $props();
</script>

<label for={searchId}>{label}</label>
<Search id={searchId} name={searchId} variant="text" {placeholder} bind:value={query} />

<article class="history">
	{#if items.length}
		<ul>
			{#each items as item (item.id)}
				<li>
					<button type="button" class="open" onclick={() => onopen(item.id)}>
						<span class="title">{item.title}</span>
						{#if item.subtitle}
							<span class="subtitle">{item.subtitle}</span>
						{/if}
					</button>
					<button
						type="button"
						class="remove"
						aria-label={`Delete ${item.title}`}
						onclick={() => onremove(item.id)}
					>
						<Icon icon={faTrash} size="0.9rem" />
					</button>
				</li>
			{/each}
		</ul>
	{:else}
		<p class="empty">{empty}</p>
	{/if}
</article>

<style>
	.history {
		overflow-y: auto;
		max-height: 16rem;
		min-height: 6rem;
	}

	ul {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	li {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		border: 1px solid var(--border);
		border-radius: var(--radius);
		background: var(--bg);
	}

	li:hover {
		border-color: var(--accent);
	}

	.open {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.15rem;
		padding: 0.6rem 0.75rem;
		background: none;
		border: none;
		color: inherit;
		font: inherit;
		text-align: left;
		cursor: pointer;
	}

	.title {
		font-weight: 500;
	}

	.subtitle {
		font-size: 0.8rem;
		color: var(--muted);
	}

	.remove {
		background: none;
		border: none;
		color: var(--muted);
		cursor: pointer;
		padding: 0.6rem 0.75rem;
	}

	.remove:hover {
		color: var(--text);
	}

	.empty {
		color: var(--muted);
		font-size: 0.9rem;
		margin: 0.5rem 0 0;
	}
</style>
