import type { Exercise } from '$lib/Exercise.Types';
import { GET_BUILTIN_EXERCISES } from '$lib/BuiltinExercises';

export function GetNewExerciseID(): number {
	// ID-Space from 0 to 100 is reserved for Builtin Exercises
	let maxID = 100;

	EXERCISES.map((entry) => entry.id)
		.filter((id) => id > 100)
		.forEach((id) => {
			if (id > maxID) {
				maxID = id;
			}
		});

	// Return biggest ID + 1
	return maxID + 1;
}

// Normally we would do some logic to load the stuff, for now we just use builtin stuff
// export const EXERCISES: Exercise[] = [];
export const EXERCISES: Exercise[] = GET_BUILTIN_EXERCISES();
