import { Exercise } from './Exercise.Types';

export const Deadlift: Exercise = new Exercise(1, 'Deadlift');
export const Squats: Exercise = new Exercise(2, 'Squats');
export const Leg_Extensions: Exercise = new Exercise(3, 'Leg Extensions');
export const Pull_Ups: Exercise = new Exercise(4, 'Pull Ups');
export const Bicep_Curls: Exercise = new Exercise(5, 'Bicep Curls');

export function GET_BUILTIN_EXERCISES(): Exercise[] {
	return [Deadlift, Squats, Leg_Extensions, Pull_Ups, Bicep_Curls];
}
