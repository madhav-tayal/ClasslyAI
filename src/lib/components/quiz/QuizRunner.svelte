<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { optionLetter, type QuizQuestion } from '$lib/quiz';

	let {
		questions,
		answers = $bindable(),
		onsubmit
	}: {
		questions: QuizQuestion[];
		answers: Record<number, string>;
		onsubmit: () => void;
	} = $props();

	const answered = $derived(Object.keys(answers).length);
</script>

<Card preset="notched">
	{#snippet content()}
		<form
			class="quiz-form"
			onsubmit={(e) => {
				e.preventDefault();
				onsubmit();
			}}
		>
			<ol class="question-list">
				{#each questions as q, i (i)}
					<li class="question-item">
						<p class="question-text"><strong>Q{i + 1}.</strong> {q.question}</p>
						<div class="options-grid">
							{#each q.options as opt (opt)}
								<label class="option-label">
									<input
										type="radio"
										name={`q${i}`}
										value={optionLetter(opt)}
										checked={answers[i] === optionLetter(opt)}
										onchange={() => (answers[i] = optionLetter(opt))}
									/>
									<span>{opt}</span>
								</label>
							{/each}
						</div>
					</li>
				{/each}
			</ol>

			<div class="form-actions centered">
				<span class="progress">{answered} of {questions.length} answered</span>
				<Button type="submit" size="lg">Submit Answers</Button>
			</div>
		</form>
	{/snippet}
</Card>

<style>
	.question-list {
		list-style: none;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.question-text {
		font-size: 1.2rem;
		margin-bottom: 1rem;
	}

	.options-grid {
		display: grid;
		gap: 0.75rem;
	}

	.option-label {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem;
		border: 1px solid var(--muted);
		border-radius: 0.5rem;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.option-label:hover {
		background-color: var(--bg);
	}

	.form-actions.centered {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
	}

	.progress {
		font-size: 0.9rem;
		color: var(--muted);
	}
</style>
