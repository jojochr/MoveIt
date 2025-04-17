<script lang="ts">
	import ExerciseList from '@components/ExerciseList.svelte';
	import ExerciseDetails from '@components/ExerciseDetails.svelte';
	import type { Exercise } from '$lib/Exercise.Types.js';

	let selectedExercise: Exercise | null = $state(null);
</script>

<div class="min-h-screen bg-gray-100 p-8 max-w-6xl mx-auto">
	<h1 class="text-3xl font-bold text-gray-800 mb-8">Gym Progress Tracker</h1>
	<div class="flex">
		<ExerciseList bind:selectedExercise={selectedExercise} />
		<ExerciseDetails exercise={selectedExercise} />
	</div>
</div>
