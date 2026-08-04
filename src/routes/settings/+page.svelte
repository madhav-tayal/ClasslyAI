<script lang="ts">
	import { useQuery, useConvexClient } from 'convex-svelte';
	import { api } from '$lib/convex/_generated/api';

	import Button from '$lib/components/ui/Button.svelte';
	import Form from '$lib/components/ui/Form.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import Search from '$lib/components/ui/Search.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import PageSection from '$lib/components/layout/PageSection.svelte';
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
	import { settings, saveSettings, resetSettings } from '$lib/settings.svelte';
	import { faGear, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

	const quizzes = useQuery(api.quizzes.list, {});
	const materials = useQuery(api.materials.list, {});
	const client = useConvexClient();

	let saved = $state(false);
	let clearing = $state('');
	let error = $state('');

	// Bound to the number input, which hands back a string
	let questionCount = $state(String(settings.questionCount));

	function apply() {
		const parsed = parseInt(questionCount);
		if (isNaN(parsed) || parsed < 1 || parsed > 20) {
			error = 'Pick a number between 1 and 20.';
			return;
		}
		error = '';
		settings.questionCount = parsed;
		saveSettings();
		saved = true;
		setTimeout(() => (saved = false), 2000);
	}

	function restoreDefaults() {
		resetSettings();
		questionCount = String(settings.questionCount);
		error = '';
	}

	async function clearQuizzes() {
		if (!confirm('Delete every saved quiz and its scores? This cannot be undone.')) return;
		clearing = 'quizzes';
		error = '';
		try {
			for (const quiz of quizzes.data ?? []) {
				await client.mutation(api.quizzes.remove, { id: quiz._id });
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to clear quizzes.';
		} finally {
			clearing = '';
		}
	}

	async function clearNotes() {
		if (!confirm('Delete every saved note? This cannot be undone.')) return;
		clearing = 'notes';
		error = '';
		try {
			for (const material of materials.data ?? []) {
				await client.mutation(api.materials.remove, { id: material._id });
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to clear notes.';
		} finally {
			clearing = '';
		}
	}
</script>

<PageHeader heading="Settings" subtitle="Defaults for new quizzes, and what to keep.">
	{#snippet badge()}
		<Icon icon={faGear} size="1.2rem" color="var(--text)" />
		<span>Preferences</span>
	{/snippet}
</PageHeader>

<PageSection heading="Appearance">
	<Card preset="flat">
		{#snippet content()}
			<div class="row">
				<div>
					<h3>Theme</h3>
					<p class="hint">Light, dark or forest. Your choice is remembered on this device.</p>
				</div>
				<ThemeSwitcher />
			</div>
		{/snippet}
	</Card>
</PageSection>

<PageSection heading="Quiz defaults">
	<Form preset="card" onsubmit={apply}>
		<label for="question-count">Questions per quiz</label>
		<Search
			id="question-count"
			name="question-count"
			variant="number"
			min="1"
			max="20"
			bind:value={questionCount}
		/>
		<p class="hint">Used as the starting value on the quiz generator.</p>

		<label class="checkbox">
			<input type="checkbox" bind:checked={settings.autoSaveNotes} onchange={saveSettings} />
			<span>Save generated notes to my history automatically</span>
		</label>

		<div class="actions">
			<Button variant="outline" type="submit">Save</Button>
			<Button variant="ghost" onclick={restoreDefaults}>Restore defaults</Button>
			{#if saved}
				<span class="saved">Saved</span>
			{/if}
		</div>
	</Form>
</PageSection>

<PageSection heading="Your data">
	<Card preset="notched">
		{#snippet content()}
			<div class="row">
				<div>
					<h3>Saved quizzes</h3>
					<p class="hint">
						{quizzes.data?.length ?? 0} saved. Deleting these also removes their scores, so the
						dashboard resets.
					</p>
				</div>
				<Button variant="outline" onclick={clearQuizzes} disabled={clearing === 'quizzes'}>
					<Icon icon={faTriangleExclamation} />
					{clearing === 'quizzes' ? 'Clearing…' : 'Clear quizzes'}
				</Button>
			</div>

			<div class="row">
				<div>
					<h3>Saved notes</h3>
					<p class="hint">{materials.data?.length ?? 0} saved.</p>
				</div>
				<Button variant="outline" onclick={clearNotes} disabled={clearing === 'notes'}>
					<Icon icon={faTriangleExclamation} />
					{clearing === 'notes' ? 'Clearing…' : 'Clear notes'}
				</Button>
			</div>
		{/snippet}
	</Card>

	{#if error}
		<p role="alert" class="error-text">{error}</p>
	{/if}
</PageSection>

<style>
	.row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 2rem;
		flex-wrap: wrap;
	}

	.row h3 {
		margin: 0 0 0.25rem;
		font-size: 1.1rem;
	}

	.hint {
		margin: 0;
		font-size: 0.9rem;
		color: var(--muted);
	}

	.checkbox {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		cursor: pointer;
	}

	.actions {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.saved {
		font-size: 0.9rem;
		color: var(--muted);
	}

	.error-text {
		color: var(--error, #ef4444);
		margin-top: 1rem;
	}
</style>
