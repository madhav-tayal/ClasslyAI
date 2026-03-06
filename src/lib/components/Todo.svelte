<script lang="ts">
	import { useQuery, useConvexClient } from 'convex-svelte';
	import { api } from '../convex/_generated/api';
	import type { Id } from '../convex/_generated/dataModel';
	import { Plus} from 'lucide-svelte';
	import Button from './ui/Button.svelte';
	// 1. Subscribe to the list of tasks
	// 'tasks' will be a reactive object with .data, .isLoading, and .error
	const tasks = useQuery(api.tasks.list, {});
	const client = useConvexClient();

	let todo = $state('');

	async function addTask(onSubmit: SubmitEvent) {
		onSubmit.preventDefault();
		if (todo.trim()) {
			await client.mutation(api.tasks.add, { text: todo });
			todo = '';
		}
	}

	async function toggleTask(id: Id<'tasks'>, done: boolean) {
		await client.mutation(api.tasks.toggle, { id, done });
	}

	async function removeTask(id: Id<'tasks'>) {
		await client.mutation(api.tasks.remove, { id });
	}
</script>

<h1>To Do</h1>
<form onsubmit={addTask}>
	<input bind:value={todo} type="text" placeholder="your task here" autocomplete="off" />
	<Button type="submit"><Plus /></Button>
</form>
{#if tasks.isLoading}
	<p>Loading tasks...</p>
{:else if tasks.data}
	<ul>
		{#each tasks.data as task (task._id)}
			<li>
				<input
					id="toggle"
					type="checkbox"
					checked={task.done}
					onchange={(e) => toggleTask(task._id, e.currentTarget.checked)}
				/>
				<label for="toggle" class:completed={task.done}>{task.text}</label>
				<Button type="button" onclick={() => removeTask(task._id)} variant="ghost">DELETE</Button>
			</li>
		{/each}
	</ul>
{:else}
	<p>ERROR</p>
{/if}
