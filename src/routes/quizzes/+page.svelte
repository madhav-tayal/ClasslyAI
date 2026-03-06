<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Form from '$lib/components/ui/Form.svelte';
	import Search from '$lib/components/ui/Search.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import PageSection from '$lib/components/layout/PageSection.svelte';
	import PageFooter from '$lib/components/layout/PageFooter.svelte';
	import {
		faCheckCircle,
		faTimesCircle,
		faRotateRight,
		faPodcast
	} from '@fortawesome/free-solid-svg-icons';

	interface QuizQuestion {
		question: string;
		options: string[];
		answer: string;
	}

	let topic = $state('');
	let count = $state<string>('3');
	let loading = $state(false);
	let error = $state('');
	let quizData = $state<QuizQuestion[]>([]);
	let answers = $state<Record<number, string>>({});
	let results = $state<
		{
			questionIndex: number;
			question: string;
			correctAnswer: string;
			userAnswer: string;
			isCorrect: boolean;
		}[]
	>([]);
	let submitted = $state(false);
	let score = $state({ correct: 0, total: 0, percentage: 0 });

	async function generateQuiz() {
		error = '';
		results = [];
		submitted = false;
		if (!topic.trim()) {
			error = 'Please enter a topic.';
			return;
		}
		loading = true;
		try {
			const res = await fetch('/api/quiz', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ topic, count: parseInt(count) })
			});
			if (!res.ok) {
				const text = await res.text();
				throw new Error(text || `Server error: ${res.status}`);
			}
			const data = await res.json();
			quizData = data.quizData ?? [];
			answers = {};
		} catch (err: unknown) {
			if (err instanceof Error) {
				error = err.message;
			} else {
				error = String(err) || 'Failed to generate quiz.';
			}
		} finally {
			loading = false;
		}
	}

	function submitQuiz(e?: Event) {
		e?.preventDefault();
		if (!quizData.length) {
			error = 'No quiz to submit.';
			return;
		}
		results = quizData.map((q, i) => {
			const user = answers[i] ?? '';
			return {
				questionIndex: i,
				question: q.question,
				correctAnswer: q.answer,
				userAnswer: user,
				isCorrect: user === q.answer
			};
		});
		const correct = results.filter((r) => r.isCorrect).length;
		score = {
			correct,
			total: quizData.length,
			percentage: Math.round((correct / quizData.length) * 100)
		};
		submitted = true;
	}

	function resetQuiz() {
		topic = '';
		quizData = [];
		answers = {};
		results = [];
		submitted = false;
		error = '';
	}
</script>

<PageHeader
	heading={submitted ? 'Quiz Results' : 'Quiz Generator'}
	subtitle={submitted
		? `You scored ${score.correct} out of ${score.total} (${score.percentage}%). Review your answers below.`
		: 'ClasslyAI generates personalized study material, quizzes, and performance analytics — all driven by AI.'}
>
	{#snippet badge()}
		<Icon icon={faPodcast} size="1.2rem" color="var(--text)" />
		<span>Level up</span>
	{/snippet}
</PageHeader>

{#if !quizData.length}
	<PageSection heading="Create a new quiz" prose>
		<p>
			Enter a topic below to generate a custom quiz instantly. Choose your difficulty or specific
			area of focus.
		</p>
	</PageSection>

	<PageSection>
		<div class="form-container">
			<Form preset="card" onsubmit={generateQuiz}>
				<label for="topic">Topic</label>
				<Search id="topic" name="topic" variant="text" bind:value={topic} required />

				<label for="count">Number of questions</label>
				<Search id="count" name="count" variant="number" min="1" max="20" bind:value={count} />

				<div class="form-actions">
					<Button variant="outline" type="submit" disabled={loading}>
						{loading ? 'Generating…' : 'Generate Quiz'}
					</Button>
				</div>
			</Form>
			<Form preset="card">
				<label for="topic">Quiz History</label>
				<Search id="topic" name="topic" variant="text" placeholder="Search your quizzes" bind:value={topic} required />
				<article class="historyy">
					<ul>
						<li>Quiz Uno</li>
						<li>Quiz two</li>
						<li>Quiz trio</li>
					</ul>
				</article>

				
			</Form>
		</div>
		{#if error}
			<p role="alert" class="error-text">{error}</p>
		{/if}
	</PageSection>
{:else if !submitted}
	<PageSection heading={`Quiz: ${topic}`}>
		<Card preset="notched">
			{#snippet content()}
				<form onsubmit={submitQuiz} class="quiz-form">
					<ol class="question-list">
						{#each quizData as q, i (i)}
							<li class="question-item">
								<p class="question-text"><strong>Q{i + 1}.</strong> {q.question}</p>
								<div class="options-grid">
									{#each q.options as opt (opt)}
										<label class="option-label">
											<input
												type="radio"
												name={`q${i}`}
												value={opt.slice(0, 1)}
												checked={answers[i] === opt.slice(0, 1)}
												onchange={() => (answers[i] = opt.slice(0, 1))}
											/>
											<span>{opt}</span>
										</label>
									{/each}
								</div>
							</li>
						{/each}
					</ol>
					<div class="form-actions centered">
						<Button type="submit" size="lg">Submit Answers</Button>
					</div>
				</form>
			{/snippet}
		</Card>
	</PageSection>
{:else}
	<PageSection heading="Performance Breakdown" grid>
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
	</PageSection>

	<PageFooter
		heading="Ready for another round?"
		subtitle="Spin up a new topic to keep the streak alive."
	>
		<Button onclick={resetQuiz} size="lg" variant="outline">
			<Icon icon={faRotateRight} />
			Start New Quiz
		</Button>
	</PageFooter>
{/if}

<style>
	/* Minimal styling for radio inputs and layout within Cards */
	.error-text {
		color: red;
		text-align: center;
		margin-top: 1rem;
	}

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
		justify-content: center;
	}

	/* Result Card Styling */
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
		color: red;
	}
	.text-success {
		color: green;
	}
	.form-container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;


	}

	.historyy {
		overflow-y: auto;
		min-height: 100%;
	}
</style>
