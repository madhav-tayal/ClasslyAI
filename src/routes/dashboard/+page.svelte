<script lang="ts">
	import { useQuery } from 'convex-svelte';
	import { api } from '$lib/convex/_generated/api';

	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import PageSection from '$lib/components/layout/PageSection.svelte';
	import PageFooter from '$lib/components/layout/PageFooter.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';

	import Table, { type TableColumn } from '$lib/components/Table.svelte';
	import AreaChart from '$lib/components/AreaChart.svelte';
	import Todo from '$lib/components/Todo.svelte';
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
	import StatTiles from '$lib/components/dashboard/StatTiles.svelte';
	import WeakTopics from '$lib/components/dashboard/WeakTopics.svelte';
	import { shortDate } from '$lib/format';

	import { faArrowRight, faListCheck, faChartLine } from '@fortawesome/free-solid-svg-icons';

	const stats = useQuery(api.stats.summary, {});
	const attempts = useQuery(api.attempts.list, { limit: 20 });

	interface AttemptRow {
		topic: string;
		score: string;
		percentage: number;
		taken: string;
	}

	const rows = $derived<AttemptRow[]>(
		(attempts.data ?? []).map((a) => ({
			topic: a.topic,
			score: `${a.correct}/${a.total}`,
			percentage: a.percentage,
			taken: shortDate(a._creationTime)
		}))
	);

	const columns: TableColumn<AttemptRow>[] = [
		{ key: 'topic', label: 'Topic', sortable: true },
		{ key: 'score', label: 'Score', align: 'center' },
		{ key: 'percentage', label: '%', align: 'center', sortable: true },
		{ key: 'taken', label: 'Taken', align: 'right', sortable: true }
	];

	// One series, so no legend — the section heading names it.
	const chartLabels = $derived((stats.data?.trend ?? []).map((t) => shortDate(t.at)));
	const chartDatasets = $derived([
		{
			label: 'Score %',
			data: (stats.data?.trend ?? []).map((t) => t.percentage),
			color: 'var(--accent)'
		}
	]);
</script>

<PageHeader heading="Your Dashboard" subtitle="How your quizzes have been going.">
	{#snippet badge()}
		<ThemeSwitcher />
		<span>Gemini Powered</span>
	{/snippet}

	{#snippet redirect()}
		<div class="actions">
			<Button href="/quizzes" variant="outline" size="lg">
				New Quiz
				<Icon icon={faArrowRight} />
			</Button>
		</div>
	{/snippet}
</PageHeader>

<PageSection heading="At a glance">
	{#if stats.isLoading}
		<p class="muted-text">Loading…</p>
	{:else if stats.error}
		<p role="alert" class="error-text">Could not load your stats.</p>
	{:else if stats.data}
		<StatTiles
			quizzesTaken={stats.data.quizzesTaken}
			averageScore={stats.data.averageScore}
			bestScore={stats.data.bestScore}
			materialsSaved={stats.data.materialsSaved}
		/>
	{/if}
</PageSection>

<PageSection heading="Score trend">
	{#if chartLabels.length > 1}
		<AreaChart labels={chartLabels} datasets={chartDatasets} height={320} />
	{:else}
		<p class="muted-text">Take a couple of quizzes and your trend will show up here.</p>
	{/if}
</PageSection>

<PageSection heading="My Workspace">
	<div class="workspace-grid">
		<div class="workspace-card">
			<div class="card-header">
				<Icon icon={faListCheck} size="1.2rem" color="var(--text)" />
				<h3>Priorities</h3>
			</div>
			<div class="card-content">
				<Todo />
			</div>
		</div>

		<div class="workspace-card">
			<div class="card-header">
				<Icon icon={faChartLine} size="1.2rem" color="var(--accent)" />
				<h3>Weakest topics</h3>
			</div>
			<div class="card-content scrollable">
				<WeakTopics topics={stats.data?.weakTopics ?? []} />
			</div>
		</div>
	</div>
</PageSection>

<PageSection heading="Recent attempts">
	{#if rows.length}
		<Table data={rows} {columns} paginated={true} pageSize={8} />
	{:else}
		<p class="muted-text">Nothing yet — your quiz results will be listed here.</p>
	{/if}
</PageSection>

<PageFooter heading="Want to change how quizzes work?" subtitle="Tune the defaults in settings.">
	<Button href="/settings" size="lg">
		Settings
		<Icon icon={faArrowRight} />
	</Button>
</PageFooter>

<style>
	.actions {
		display: flex;
		gap: 1rem;
	}

	.workspace-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
		gap: 2rem;
		width: 100%;
	}

	.workspace-card {
		background: var(--bg);
		border: 1px solid var(--muted);
		border-radius: 1rem;
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		height: 400px; /* Fixed height for consistency */
		box-shadow: 0 4px 6px -1px var(--shadow);
	}

	.card-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.card-header h3 {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 600;
	}

	.card-content {
		flex: 1;
		overflow: hidden; /* Contains the scrollable children */
	}

	.card-content.scrollable {
		overflow-y: auto;
	}

	.muted-text {
		color: var(--muted);
		margin: 0;
	}

	.error-text {
		color: var(--error, #ef4444);
		margin: 0;
	}
</style>
