import { Observable, observable } from '@legendapp/state';
import { synced } from '@legendapp/state/sync';
import { ObservablePersistMMKV } from '@legendapp/state/persist-plugins/mmkv';
import { Exercise } from '@/model/Exercise';

export type SelectedExerciseType = ExerciseState | NoExerciseState | CreatingExerciseState;

type ExerciseState = {
  kind: 'Exercise';
  exercise: Exercise;
};

type NoExerciseState = {
  kind: 'NoExercise';
};

type CreatingExerciseState = {
  kind: 'CreatingExercise';
};

export function Exercise_asSelected(exercise: Exercise): SelectedExerciseType {
  return { kind: 'Exercise', exercise: exercise };
}

export const NoExercise: SelectedExerciseType = { kind: 'NoExercise' };
export const CreatingExercise: SelectedExerciseType = { kind: 'CreatingExercise' };

export interface ExerciseStore {
  exercises: Exercise[];
  currentSelection: SelectedExerciseType;
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

/**
 * This Does all the necessary validation and stuff to make the store extracted from persistence usable
 * @param store The store that should be made usable
 */
function ValidateAndPatch(store: Observable<ExerciseStore>) {
  // If exercises don't exist yet initialize them
  if (store.exercises.peek() === undefined || store.exercises.peek() === null) {
    store.exercises.set([]);
    store.currentSelection.set(NoExercise);
    return;
  }

  // Make sure the selected Exercise points to valid data
  PatchSelectedExercise(store);
}

/**
 * This takes a store to be patched and validates/patches its selected exercise
 * @param store The Store to be patched
 */
function PatchSelectedExercise(store: Observable<ExerciseStore>) {
  const selectedExercise = store.currentSelection.peek();

  // If selected exercise is invalid
  if (selectedExercise === undefined || selectedExercise === null) {
    store.currentSelection.set(NoExercise);
    return;
  }

  // Make sure selected exercise points to the correct entry in ExerciseList
  if (selectedExercise.kind === 'Exercise') {
    const maybeID: number = selectedExercise.exercise.id;

    let maybeExercise: Exercise | null = GetExerciseByID(store.peek(), maybeID);
    store.currentSelection.set(maybeExercise === null ? NoExercise : Exercise_asSelected(maybeExercise));
  }
}

function GetExerciseByID(store: ExerciseStore, id: number): Exercise | null {
  let maybeExercise = store.exercises.find(exercise => {
    return exercise.id === id;
  });

  // Return Exercise in success case or convert undefined to null in case we did not find the exercise
  return typeof maybeExercise === 'undefined' ? null : maybeExercise;
}
