<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
	import type { GradeResult } from '$lib/quiz';

	let { results }: { results: GradeResult[] } = $props();
</script>

{#each results as r (r.questionIndex)}
	<Card preset="notched">
		{#snippet content()}
			<div class="result-header">
				<Icon
					icon={r.isCorrect ? faCheckCircle : faTimesCircle}
					size="2rem"
					color={r.isCorrect ? 'var(--success, #22c55e)' : 'var(--error, #ef4444)'}
				/>
				<h3>Question {r.questionIndex + 1}</h3>
			</div>

			<p class="result-question">{r.question}</p>

			<div class="result-details">
				<div class="detail-row">
					<strong>You:</strong>
					<span class={r.isCorrect ? 'text-success' : 'text-error'}>
						{r.userAnswer || 'Skipped'}
					</span>
				</div>
				{#if !r.isCorrect}
					<div class="detail-row">
						<strong>Correct:</strong>
						<span>{r.correctAnswer}</span>
					</div>
				{/if}
			</div>
		{/snippet}
	</Card>
{/each}

<style>
	.result-header {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.result-header h3 {
		margin: 0;
	}

	.result-details {
		margin-top: 1rem;
		padding-top: 1rem;
		border-top: 1px solid var(--muted);
	}

	.detail-row {
		display: flex;
		justify-content: space-between;
		margin-bottom: 0.25rem;
	}

	.text-error {
		color: var(--error, #ef4444);
	}

	.text-success {
		color: var(--success, #22c55e);
	}
</style>
