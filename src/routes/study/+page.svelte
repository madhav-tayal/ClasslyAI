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
	import HistoryList from '$lib/components/HistoryList.svelte';
	import StudyGuide, { type Guide } from '$lib/components/study/StudyGuide.svelte';
	import { relativeDate } from '$lib/format';
	import { settings } from '$lib/settings.svelte';
	import { faBookOpen, faRotateRight } from '@fortawesome/free-solid-svg-icons';

	let topic = $state('');
	let search = $state('');
	let loading = $state(false);
	let error = $state('');
	let guide = $state<Guide | null>(null);

	const saved = useQuery(api.materials.list, {});
	const client = useConvexClient();

	const history = $derived(
		(saved.data ?? [])
			.filter((m) => m.topic.toLowerCase().includes(search.trim().toLowerCase()))
			.map((m) => ({
				id: m._id,
				title: m.topic,
				subtitle: `${m.concepts.length} concepts · ${relativeDate(m._creationTime)}`
			}))
	);

	async function generate() {
		if (!topic.trim()) {
			error = 'Please enter a topic.';
			return;
		}
		error = '';
		loading = true;
		try {
			const res = await fetch('/api/generate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ topic })
			});
			if (!res.ok) {
				throw new Error((await res.text()) || `Server error: ${res.status}`);
			}
			const { data } = await res.json();
			guide = data;

			if (settings.autoSaveNotes) {
				await client.mutation(api.materials.save, {
					topic: data.topic ?? topic,
					overview: data.overview,
					concepts: data.concepts,
					takeaways: data.takeaways
				});
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to generate study material.';
		} finally {
			loading = false;
		}
	}

	async function open(id: string) {
		error = '';
		const material = (saved.data ?? []).find((m) => m._id === id);
		if (!material) return;
		guide = {
			topic: material.topic,
			overview: material.overview,
			concepts: material.concepts,
			takeaways: material.takeaways
		};
		topic = material.topic;
	}

	async function remove(id: string) {
		error = '';
		try {
			await client.mutation(api.materials.remove, { id: id as Id<'materials'> });
			if (guide && !(saved.data ?? []).some((m) => m.topic === guide?.topic)) {
				guide = null;
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to delete.';
		}
	}

	function reset() {
		guide = null;
		topic = '';
		error = '';
	}
</script>

<PageHeader
	heading={guide ? guide.topic : 'Study Material'}
	subtitle={guide
		? 'Generated notes for this topic. Everything here is saved to your history.'
		: 'Enter a topic and get an overview, the key concepts and the things worth remembering.'}
>
	{#snippet badge()}
		<Icon icon={faBookOpen} size="1.2rem" color="var(--text)" />
		<span>Gemini Powered</span>
	{/snippet}
</PageHeader>

{#if !guide}
	<PageSection>
		<div class="layout">
			<Form preset="card" onsubmit={generate}>
				<label for="topic">Topic</label>
				<Search
					id="topic"
					name="topic"
					variant="text"
					placeholder="Photosynthesis, the French Revolution…"
					bind:value={topic}
					required
				/>
				<div class="form-actions">
					<Button variant="outline" type="submit" disabled={loading}>
						{loading ? 'Generating…' : 'Generate Notes'}
					</Button>
				</div>
			</Form>

			<Form preset="card">
				<HistoryList
					items={history}
					bind:query={search}
					label="Saved Notes"
					searchId="material-search"
					placeholder="Search your notes"
					empty="No saved notes yet. Generate one to get started."
					onopen={open}
					onremove={remove}
				/>
			</Form>
		</div>

		{#if error}
			<p role="alert" class="error-text">{error}</p>
		{/if}
	</PageSection>
{:else}
	<PageSection>
		<StudyGuide {guide} />
		<div class="form-actions centered">
			<Button onclick={reset} size="lg" variant="outline">
				<Icon icon={faRotateRight} />
				New Topic
			</Button>
		</div>
	</PageSection>
{/if}

<style>
	.layout {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	.form-actions.centered {
		display: flex;
		justify-content: center;
	}

	.error-text {
		color: var(--error, #ef4444);
		text-align: center;
		margin-top: 1rem;
	}

	@media only screen and (max-width: 900px) {
		.layout {
			grid-template-columns: 1fr;
		}
	}
</style>
