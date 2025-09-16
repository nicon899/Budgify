import { SQLiteProvider } from 'expo-sqlite';

export function AppDatabaseProvider({ children }: { children: React.ReactNode }) {
  return (
    <SQLiteProvider
      databaseName="budgifyDB.db"
      assetSource={{ assetId: require('../assets/budgifyDB.db') }}
      onInit={async (db) => {
        await db.execAsync('PRAGMA foreign_keys = ON;');
      }}
    >
      {children}
    </SQLiteProvider>
  );
}