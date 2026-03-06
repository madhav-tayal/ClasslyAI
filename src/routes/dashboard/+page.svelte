<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import PageSection from '$lib/components/layout/PageSection.svelte';
	import PageFooter from '$lib/components/layout/PageFooter.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';

	// Import upgraded components
	import Table, { type TableColumn } from '$lib/components/Table.svelte';
	import AreaChart from '$lib/components/AreaChart.svelte';
	import Todo from '$lib/components/Todo.svelte';
	import Gallery from '$lib/components/Gallery.svelte';
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';

	import {
		faArrowRight,
		faDownload,
		faListCheck,
		faImage
	} from '@fortawesome/free-solid-svg-icons';

	// 1. Define Data LOCALLY with strict types
	// This proves the component works without external JSON and fixes the type error.
	interface Student {
		id: number;
		name: string;
		grade: number;
		status: 'Active' | 'Inactive';
	}

	const students: Student[] = [
		{ id: 101, name: 'Alice Johnson', grade: 92, status: 'Active' },
		{ id: 102, name: 'Bob Smith', grade: 78, status: 'Inactive' },
		{ id: 103, name: 'Charlie Brown', grade: 88, status: 'Active' },
		{ id: 104, name: 'Diana Prince', grade: 95, status: 'Active' },
		{ id: 105, name: 'Evan Wright', grade: 64, status: 'Inactive' }
	];

	// Explicitly typed columns using the exported interface from Table.svelte
	const columns: TableColumn<Student>[] = [
		{ key: 'id', label: 'ID', width: '80px', sortable: true },
		{ key: 'name', label: 'Student Name', sortable: true },
		{ key: 'grade', label: 'Grade (%)', align: 'center', sortable: true },
		{ key: 'status', label: 'Status', align: 'right' }
	];

	// Example Data
	const chartLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
	const chartDatasets = [
		{
			label: 'Sales',
			data: [400, 300, 550, 480, 700, 900],
			color: 'var(--accent)' // Uses your Blue 500
		},
		{
			label: 'Views',
			data: [200, 150, 300, 250, 400, 500],
			color: '#10b981' // Emerald 500 example
		}
	];
</script>

<PageHeader heading="Student Dashboard" subtitle="Live overview of performance and tasks.">
	{#snippet badge()}
		<ThemeSwitcher />
		<span>Gemini Powered</span>
	{/snippet}

	{#snippet redirect()}
		<div class="actions">
			<Button variant="outline" size="lg">
				Export
				<Icon icon={faDownload} />
			</Button>
		</div>
	{/snippet}
</PageHeader>

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
				<Icon icon={faImage} size="1.2rem" color="var(--accent)" />
				<h3>Snapshots</h3>
			</div>
			<div class="card-content">
				<Gallery />
			</div>
		</div>
	</div>
</PageSection>

<PageSection heading="Performance Overview">
	<AreaChart labels={chartLabels} datasets={chartDatasets} height={320} />
</PageSection>

<PageSection heading="Student Records">
	<Table data={students} {columns} paginated={true} pageSize={4} selectable={true} />
</PageSection>

<PageFooter heading="Ready to level up?" subtitle="Upgrade for more features.">
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
</style>
