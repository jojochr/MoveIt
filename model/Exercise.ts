/**
 * Represents data points about an exercise at one point in time
 */
export interface ExerciseLogEntry {
  date: Date;
  maxWeight: number;
  repetitions: number;
}

/**
 * Represents an exercise to be displayed in UI and persisted in DB
 */
export interface Exercise {
  id: number;
  name: string;
  exerciseHistory: ExerciseLogEntry[];
}

/**
 * Constructor for Exercise Interface
 * @constructor
 */
export function CreateExercise(id: number, name: string): Exercise {
  return {
    id: id,
    name: name,
    exerciseHistory: [],
  };
}

export const Deadlift: Exercise = CreateExercise(1, 'Deadlift');
export const Squats: Exercise = CreateExercise(2, 'Squats');
export const Leg_Extensions: Exercise = CreateExercise(3, 'Leg Extensions');
export const Pull_Ups: Exercise = CreateExercise(4, 'Pull Ups');
export const Bicep_Curls: Exercise = CreateExercise(5, 'Bicep Curls');

/**
 * This Function returns all the exercises that are built into the app
 * @constructor
 */
export function GET_BUILTIN_EXERCISES(): Exercise[] {
  return [Deadlift, Squats, Leg_Extensions, Pull_Ups, Bicep_Curls];
}
