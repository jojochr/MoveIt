import * as schema from '@/db/schema';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { SQLiteDatabase, SQLiteRunResult } from 'expo-sqlite';
import { ExerciseId, exercises, exercising_history } from '@/db/schema';

export const DeleteAllAndAddDummyData = async (expo_db: SQLiteDatabase) => {
  const db = drizzle(expo_db, { schema });

  await db.delete(exercising_history);
  await db.delete(exercises);

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const inTwoDays = new Date();
  inTwoDays.setDate(today.getDate() + 2);
  const inThreeDays = new Date();
  inThreeDays.setDate(today.getDate() + 3);

  let { lastInsertRowId }: SQLiteRunResult = await db.insert(exercises).values({ name: 'Deadlift' });
  await db.insert(exercising_history).values([
    {
      exerciseId: lastInsertRowId as ExerciseId, // Allow here because we know it exists
      date: today,
      maxWeight: 40,
      repetitions: 10,
    },
    {
      exerciseId: lastInsertRowId as ExerciseId, // Allow here because we know it exists
      date: tomorrow,
      maxWeight: 40,
      repetitions: 12,
    },
    {
      exerciseId: lastInsertRowId as ExerciseId, // Allow here because we know it exists
      date: inTwoDays,
      maxWeight: 50,
      repetitions: 10,
    },
    {
      exerciseId: lastInsertRowId as ExerciseId, // Allow here because we know it exists
      date: inThreeDays,
      maxWeight: 50,
      repetitions: 12,
    },
  ]);

  const squadsResult = await db.insert(exercises).values({ name: 'Squads' });
  lastInsertRowId = squadsResult.lastInsertRowId;
  await db.insert(exercising_history).values([
    {
      exerciseId: lastInsertRowId as ExerciseId, // Allow here because we know it exists
      date: today,
      maxWeight: 80,
      repetitions: 8,
    },
    {
      exerciseId: lastInsertRowId as ExerciseId, // Allow here because we know it exists
      date: tomorrow,
      maxWeight: 86,
      repetitions: 8,
    },
    {
      exerciseId: lastInsertRowId as ExerciseId, // Allow here because we know it exists
      date: inTwoDays,
      maxWeight: 90,
      repetitions: 8,
    },
  ]);
};
