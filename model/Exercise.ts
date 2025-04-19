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
export class Exercise {
  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

  id: number;
  name: string;
  exerciseHistory: ExerciseLogEntry[] = [];

  GetLastPerformedData(): ExerciseLogEntry | null {
    if (this.exerciseHistory.length > 0) {
      return this.exerciseHistory[0];
    }

    return null;
  }
}

/**
 * Represents an exercise that is currently being created and not yet assigned a proper ID or any data points
 */
export class NewExercise {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

export const Deadlift: Exercise = new Exercise(1, 'Deadlift');
export const Squats: Exercise = new Exercise(2, 'Squats');
export const Leg_Extensions: Exercise = new Exercise(3, 'Leg Extensions');
export const Pull_Ups: Exercise = new Exercise(4, 'Pull Ups');
export const Bicep_Curls: Exercise = new Exercise(5, 'Bicep Curls');

/**
 * This Function returns all the exercises that are built into the app
 * @constructor
 */
export function GET_BUILTIN_EXERCISES(): Exercise[] {
  return [Deadlift, Squats, Leg_Extensions, Pull_Ups, Bicep_Curls];
}
