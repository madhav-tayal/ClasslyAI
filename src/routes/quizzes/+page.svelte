<script lang="ts">
	import { useQuery, useConvexClient } from 'convex-svelte';
	import { api } from '$lib/convex/_generated/api';
	import type { Id } from '$lib/convex/_generated/dataModel';

	import Button from '$lib/components/ui/Button.svelte';
	import Form from '$lib/components/ui/Form.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import Search from '$lib/components/ui/Search.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import PageSection from '$lib/components/layout/PageSection.svelte';
	import PageFooter from '$lib/components/layout/PageFooter.svelte';
	import HistoryList from '$lib/components/HistoryList.svelte';
	import QuizRunner from '$lib/components/quiz/QuizRunner.svelte';
	import QuizResults from '$lib/components/quiz/QuizResults.svelte';
	import { grade, scoreOf, type GradeResult, type QuizQuestion } from '$lib/quiz';
	import { relativeDate } from '$lib/format';
	import { settings } from '$lib/settings.svelte';
	import { faRotateRight, faPodcast } from '@fortawesome/free-solid-svg-icons';

	let topic = $state('');
	let count = $state(String(settings.questionCount));
	let search = $state('');
	let loading = $state(false);
	let error = $state('');

	// The quiz currently on screen, plus the row it came from so attempts can
	// be attached to it.
	let quizId = $state<Id<'quizzes'> | null>(null);
	let questions = $state<QuizQuestion[]>([]);
	let answers = $state<Record<number, string>>({});
	let results = $state<GradeResult[]>([]);
	let submitted = $state(false);

	const saved = useQuery(api.quizzes.list, {});
	const client = useConvexClient();

	const score = $derived(scoreOf(results));

	const history = $derived(
		(saved.data ?? [])
			.filter((q) => q.topic.toLowerCase().includes(search.trim().toLowerCase()))
			.map((q) => ({
				id: q._id,
				title: q.topic,
				subtitle: `${q.questions.length} questions · ${relativeDate(q._creationTime)}`
			}))
	);

	async function generateQuiz() {
		if (!topic.trim()) {
			error = 'Please enter a topic.';
			return;
		}
		error = '';
		results = [];
		submitted = false;
		loading = true;

		try {
			const res = await fetch('/api/quiz', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ topic, count: parseInt(count) })
			});
			if (!res.ok) {
				throw new Error((await res.text()) || `Server error: ${res.status}`);
			}

			const data = await res.json();
			const generated: QuizQuestion[] = data.quizData ?? [];
			if (!generated.length) {
				throw new Error('Gemini returned an empty quiz. Try a different topic.');
			}

			quizId = await client.mutation(api.quizzes.save, { topic, questions: generated });
			questions = generated;
			answers = {};
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to generate quiz.';
		} finally {
			loading = false;
		}
	}

	// Retake something from the history panel
	function openQuiz(id: string) {
		const quiz = (saved.data ?? []).find((q) => q._id === id);
		if (!quiz) return;
		quizId = quiz._id;
		topic = quiz.topic;
		questions = quiz.questions;
		answers = {};
		results = [];
		submitted = false;
		error = '';
	}

	async function removeQuiz(id: string) {
		error = '';
		try {
			await client.mutation(api.quizzes.remove, { id: id as Id<'quizzes'> });
			if (quizId === id) reset();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to delete quiz.';
		}
	}

	async function submitQuiz() {
		if (!questions.length) {
			error = 'No quiz to submit.';
			return;
		}

		results = grade(questions, answers);
		submitted = true;

		if (!quizId) return;
		try {
			await client.mutation(api.attempts.record, {
				quizId,
				correct: results.filter((r) => r.isCorrect).length,
				total: results.length,
				wrongQuestions: results.filter((r) => !r.isCorrect).map((r) => r.question)
			});
		} catch (err) {
			// The score is already on screen, so a failed save shouldn't hide it.
			error = err instanceof Error ? err.message : 'Score could not be saved.';
		}
	}

	function reset() {
		topic = '';
		quizId = null;
		questions = [];
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
		: 'Pick a topic and ClasslyAI writes the questions. Every quiz is saved so you can retake it later.'}
>
	{#snippet badge()}
		<Icon icon={faPodcast} size="1.2rem" color="var(--text)" />
		<span>Level up</span>
	{/snippet}
</PageHeader>

{#if !questions.length}
	<PageSection heading="Create a new quiz" prose>
		<p>
			Enter a topic below to generate a custom quiz instantly. Past quizzes stay in your history —
			open one to take it again.
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
				<HistoryList
					items={history}
					bind:query={search}
					label="Quiz History"
					searchId="quiz-search"
					placeholder="Search your quizzes"
					empty="No quizzes yet. Generate one above."
					onopen={openQuiz}
					onremove={removeQuiz}
				/>
			</Form>
		</div>

		{#if error}
			<p role="alert" class="error-text">{error}</p>
		{/if}
	</PageSection>
{:else if !submitted}
	<PageSection heading={`Quiz: ${topic}`}>
		<QuizRunner {questions} bind:answers onsubmit={submitQuiz} />
		{#if error}
			<p role="alert" class="error-text">{error}</p>
		{/if}
	</PageSection>
{:else}
	<PageSection heading="Performance Breakdown" grid>
		<QuizResults {results} />
	</PageSection>

	{#if error}
		<p role="alert" class="error-text">{error}</p>
	{/if}

	<PageFooter
		heading="Ready for another round?"
		subtitle="Spin up a new topic to keep the streak alive."
	>
		<Button onclick={reset} size="lg" variant="outline">
			<Icon icon={faRotateRight} />
			Start New Quiz
		</Button>
	</PageFooter>
{/if}

<style>
	.error-text {
		color: var(--error, #ef4444);
		text-align: center;
		margin-top: 1rem;
	}

	.form-container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	@media only screen and (max-width: 900px) {
		.form-container {
			grid-template-columns: 1fr;
		}
	}
</style>
