<script lang="ts">
	import type { Exercise } from '$lib/Exercise.Types';
	import { EXERCISES } from '../routes/data';
	import DumbBell from '@lucide/svelte/icons/dumbbell';

	let { selectedExercise = $bindable(null) }: { selectedExercise: Exercise | null } = $props();

	function handleExerciseOnClick(exercise: Exercise): void {
		// Happy case
		if (selectedExercise == null || selectedExercise.id !== exercise.id) {
			selectedExercise = exercise;
			return;
		}

		// If the exercise is already selected -> Unselect
		if (selectedExercise.id === exercise.id) {
			selectedExercise = null;
			return;
		}
	}
</script>

<div class="w-64 bg-white rounded-lg shadow-lg p-4">
	<h2 class="text-xl font-bold mb-4 flex items-center gap-2">
		<DumbBell />
		Exercises
	</h2>

	<!-- region  Listed Exercises-->
	<div>
		{#each EXERCISES as exercise}
			<button
				class="w-full text-left px-4 py-2 rounded-md transition-colors
										 {selectedExercise?.id === exercise.id ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}"
				onclick={() => handleExerciseOnClick(exercise)}
			>
				{exercise.name}
			</button>
		{/each}
	</div>
	<!-- endregion -->
</div>
