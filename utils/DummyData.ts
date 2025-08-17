import * as schema from '@/db/schema';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { SQLiteDatabase, SQLiteRunResult } from 'expo-sqlite';
import { ExerciseId, exercises, exercising_history } from '@/db/schema';
import { Branded } from './Brand';

export const DeleteAllAndAddDummyData = async (expo_db: SQLiteDatabase) => {
  const db = drizzle(expo_db, { schema });

  await db.delete(exercising_history);
  await db.delete(exercises);

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(today.getDate() - 2);
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(today.getDate() - 3);

  let { lastInsertRowId }: SQLiteRunResult = await db.insert(exercises).values({ name: 'Deadlift' });
  await db.insert(exercising_history).values([
    {
      exerciseId: lastInsertRowId as ExerciseId, // Allow here because we know it exists
      date: threeDaysAgo,
      exerciseData: { weight: 10 as Branded<number, 'Kilogram'>, repetitions: 10 } satisfies schema.ExerciseData,
    },
    {
      exerciseId: lastInsertRowId as ExerciseId, // Allow here because we know it exists
      date: twoDaysAgo,
      exerciseData: { weight: 40 as Branded<number, 'Kilogram'>, repetitions: 12 } satisfies schema.ExerciseData,
    },
    {
      exerciseId: lastInsertRowId as ExerciseId, // Allow here because we know it exists
      date: yesterday,
      exerciseData: { weight: 50 as Branded<number, 'Kilogram'>, repetitions: 10 } satisfies schema.ExerciseData,
    },
    {
      exerciseId: lastInsertRowId as ExerciseId, // Allow here because we know it exists
      date: today,
      exerciseData: { weight: 50 as Branded<number, 'Kilogram'>, repetitions: 12 } satisfies schema.ExerciseData,
    },
  ]);

  const squadsResult = await db.insert(exercises).values({ name: 'Squads' });
  lastInsertRowId = squadsResult.lastInsertRowId;
  await db.insert(exercising_history).values([
    {
      exerciseId: lastInsertRowId as ExerciseId, // Allow here because we know it exists
      date: twoDaysAgo,
      exerciseData: { weight: 80 as Branded<number, 'Kilogram'>, repetitions: 8 } satisfies schema.ExerciseData,
    },
    {
      exerciseId: lastInsertRowId as ExerciseId, // Allow here because we know it exists
      date: yesterday,
      exerciseData: { weight: 86 as Branded<number, 'Kilogram'>, repetitions: 8 } satisfies schema.ExerciseData,
    },
    {
      exerciseId: lastInsertRowId as ExerciseId, // Allow here because we know it exists
      date: today,
      exerciseData: { weight: 90 as Branded<number, 'Kilogram'>, repetitions: 8 } satisfies schema.ExerciseData,
    },
  ]);

  const sprintsResult = await db.insert(exercises).values({ name: 'Sprints' });
  lastInsertRowId = sprintsResult.lastInsertRowId;
  await db.insert(exercising_history).values([
    {
      exerciseId: lastInsertRowId as ExerciseId, // Allow here because we know it exists
      date: twoDaysAgo,
      exerciseData: { distance: 200 as Branded<number, 'Meter'>, time: 25 as Branded<number, 'Second'> } satisfies schema.ExerciseData,
    },
    {
      exerciseId: lastInsertRowId as ExerciseId, // Allow here because we know it exists
      date: yesterday,
      exerciseData: { distance: 200 as Branded<number, 'Meter'>, time: 24.5 as Branded<number, 'Second'> } satisfies schema.ExerciseData,
    },
    {
      exerciseId: lastInsertRowId as ExerciseId, // Allow here because we know it exists
      date: today,
      exerciseData: { distance: 200 as Branded<number, 'Meter'>, time: 23 as Branded<number, 'Second'> } satisfies schema.ExerciseData,
    },
  ]);
};
