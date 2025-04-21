import { Observable, observable } from '@legendapp/state';
import { synced } from '@legendapp/state/sync';
import { ObservablePersistMMKV } from '@legendapp/state/persist-plugins/mmkv';
import { Exercise } from '@/model/Exercise';

export class ExerciseStore {
  exercises: Exercise[];
  selectedExercise: Exercise | null;

  constructor(exercises: Exercise[]) {
    this.exercises = exercises;
    this.selectedExercise = null;
  }
}

export const exerciseStore$: Observable<ExerciseStore> = observable(
  synced<ExerciseStore>({
    persist: {
      name: 'ExerciseStore',
      plugin: ObservablePersistMMKV,
    },
  })
);

// Make sure we are initialized correctly
ValidateAndPatch(exerciseStore$);

function ValidateAndPatch(store: Observable<ExerciseStore>) {
  // If exercises don't exist yet initialize them
  if (store.exercises.peek() === undefined || store.exercises.peek() === null) {
    store.exercises.set([]);
    store.selectedExercise.set(null);
    return;
  }

  // If selected exercise is invalid
  if (store.selectedExercise.peek() === undefined) {
    store.selectedExercise.set(null);
    return;
  }
}
