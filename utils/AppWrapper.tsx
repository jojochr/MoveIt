import { openDatabaseSync, SQLiteProvider } from 'expo-sqlite';
import { ReactNode, Suspense } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '@/drizzle/migrations';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';

export const DATABASE_NAME = 'exercises';

export const AppWrapper = ({ children }: { children?: ReactNode }) => {
  const expo_db = openDatabaseSync(DATABASE_NAME);
  const { success, error } = useMigrations(drizzle(expo_db), migrations);

  if (success) {
    console.info('Successfully applied migrations');
  } else if (error !== undefined) {
    console.error(`Error while running migrations: "${error}"`);
  } else {
    console.trace(`Migrations failed but "error" is "undefined"`);
  }

  return (
    <Suspense fallback={null}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SQLiteProvider databaseName={DATABASE_NAME} options={{ enableChangeListener: true }} useSuspense={true}>
          {children}
        </SQLiteProvider>
      </GestureHandlerRootView>
    </Suspense>
  );
};
