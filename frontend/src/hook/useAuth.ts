/**
 * Example custom hook for authentication
 * Demonstrates how to structure custom hooks in React
 */

import { useState, useCallback } from 'react';
import Logger from '../common/middleware/logger';
import AuthService from '../common/auth/authService';

interface AuthState {
  accessToken: string | null;
  loading: boolean;
  error: string | null;
}

const logger = new Logger();
const authService = new AuthService();

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    accessToken: null,
    loading: false,
    error: null
  });

  const authenticate = useCallback(async (clientID: string, clientSecret: string) => {
    setState({ accessToken: null, loading: true, error: null });

    try {
      const result = await authService.authenticate(clientID, clientSecret);
      setState({ accessToken: result.access_token, loading: false, error: null });
      await logger.info('hook', 'Authentication successful', 'frontend');
      return result;
    } catch (error: any) {
      const errMsg = error.message || 'Authentication failed';
      setState({ accessToken: null, loading: false, error: errMsg });
      await logger.error('hook', errMsg, 'frontend');
      throw error;
    }
  }, []);

  return {
    ...state,
    authenticate
  };
};
