export interface ExerciseLogEntry {
	date: Date;
	maxWeight: number;
	repetitions: number;
}

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

export class NewExercise {
	name: string;
	constructor(name: string) {
		this.name = name;
	}
}
