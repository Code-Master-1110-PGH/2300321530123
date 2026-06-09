/**
 * Example state management using a simple context
 * Demonstrates how to structure state management
 */

import { createContext, useState, useCallback } from 'react';
import Logger from '../common/middleware/logger';

const logger = new Logger();

export interface AppContextType {
  user: any | null;
  setUser: (user: any) => void;
  logs: any[];
  addLog: (log: any) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [logs, setLogs] = useState<any[]>([]);

  const addLog = useCallback((log: any) => {
    setLogs((prev) => [...prev, log]);
  }, []);

  return (
    <AppContext.Provider value={{ user, setUser, logs, addLog }}>
      {children}
    </AppContext.Provider>
  );
};
