import { Observable, observable } from '@legendapp/state';
import { syncObservable } from '@legendapp/state/sync';
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

export const exerciseStore$: Observable<ExerciseStore> = observable<ExerciseStore>(
  () => new ExerciseStore([])
);

syncObservable(exerciseStore$, {
  persist: {
    name: 'exercises',
    plugin: ObservablePersistMMKV,
  },
});
