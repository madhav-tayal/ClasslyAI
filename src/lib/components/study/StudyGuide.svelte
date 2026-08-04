<script module lang="ts">
	export interface Guide {
		topic: string;
		overview: string;
		concepts: { title: string; explanation: string }[];
		takeaways: string[];
	}
</script>

<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { faLightbulb, faCircleCheck } from '@fortawesome/free-solid-svg-icons';

	let { guide }: { guide: Guide } = $props();
</script>

<Card preset="notched">
	{#snippet content()}
		<div class="overview">
			<h3>Overview</h3>
			<p>{guide.overview}</p>
		</div>
	{/snippet}
</Card>

<h3 class="group-heading">Key concepts</h3>
<div class="concepts">
	{#each guide.concepts as concept (concept.title)}
		<details class="concept">
			<summary>
				<Icon icon={faLightbulb} size="1rem" color="var(--accent)" />
				<span>{concept.title}</span>
			</summary>
			<p>{concept.explanation}</p>
		</details>
	{/each}
</div>

{#if guide.takeaways.length}
	<Card preset="flat">
		{#snippet content()}
			<h3>Takeaways</h3>
			<ul class="takeaways">
				{#each guide.takeaways as takeaway (takeaway)}
					<li>
						<Icon icon={faCircleCheck} size="1rem" color="var(--accent)" />
						<span>{takeaway}</span>
					</li>
				{/each}
			</ul>
		{/snippet}
	</Card>
{/if}

<style>
	.overview h3,
	.group-heading {
		margin: 0 0 0.75rem;
		font-size: 1.25rem;
	}

	.group-heading {
		margin-left: 1rem;
	}

	.overview p {
		margin: 0;
		line-height: 1.6;
	}

	.concepts {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin: 0 1rem;
	}

	.concept {
		border: 1px solid var(--border);
		border-radius: var(--radius);
		background: var(--mg);
		padding: 1rem 1.25rem;
	}

	.concept summary {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		cursor: pointer;
		font-weight: 600;
	}

	.concept p {
		margin: 0.75rem 0 0;
		line-height: 1.6;
		color: var(--muted);
	}

	.takeaways {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.takeaways li {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		line-height: 1.5;
	}
</style>
