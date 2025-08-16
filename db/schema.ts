import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { Branded } from '@/utils/Brand';
import { index } from 'drizzle-orm/sqlite-core/indexes';

export type ExerciseId = Branded<number, 'ExerciseId'>;
export type HistoryEntryId = Branded<number, 'HistoryEntryId'>;
export type ExerciseData = {
  weight?: Branded<number, 'Kilogramm'>;
  repetitions?: number;
  time?: Branded<number, 'Second'>;
  distance?: Branded<number, 'Meter'>;
}

export const exercises = sqliteTable('exercises', {
  id: integer('id').$type<ExerciseId>().primaryKey({ autoIncrement: true, onConflict: 'abort' }),
  name: text('name').notNull(),
});

export const exercising_history = sqliteTable(
  'exercising_history',
  {
    id: integer('id').$type<HistoryEntryId>().primaryKey({ autoIncrement: true, onConflict: 'abort' }),
    exerciseId: integer('exerciseId').$type<ExerciseId>().references(() => exercises.id),
    exerciseData: text({ mode: 'json' }).$type<ExerciseData>().notNull().default({}),
    date: integer('date', { mode: 'timestamp' }).notNull(),
  },
  table => [index('date_idx').on(table.date)]
);

export type Exercise = typeof exercises.$inferSelect;
export type ExerciseHistoryEntry = typeof exercising_history.$inferSelect;
