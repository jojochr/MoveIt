<script lang="ts">
	import type { Exercise } from '$lib/Exercise.Types';
	import Weight from '@lucide/svelte/icons/weight';
	import Repeat from '@lucide/svelte/icons/repeat';
	import Save from '@lucide/svelte/icons/save';

	let { exercise = $bindable(null) }: { exercise: Exercise | null } = $props();
</script>

{#if exercise === null}
	<div
		class="flex-1 bg-white rounded-lg shadow-lg p-6 ml-6 flex items-center justify-center text-gray-500"
	>
		Select an exercise to track your progress
	</div>
{:else}
	<div class="flex-1 bg-white rounded-lg shadow-lg p-6 ml-6">
		<h2 class="text-2xl font-bold mb-6">{exercise.name}</h2>

		<div class="flex items-center gap-2 text-gray-600">
			<Weight />
			Maximum Weight
		</div>

		<input type="number" />

		<div class="flex items-center gap-2 text-gray-600">
			<Repeat />
			Maximum Reps
		</div>

		<input type="number" />

		<button
			class="flex justify-center items-center w-full px-6 py-2 gap-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white transition-colors"
		>
			<Save />
			Save Progress
		</button>
	</div>
{/if}
