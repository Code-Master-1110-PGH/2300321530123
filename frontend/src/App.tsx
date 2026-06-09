import React, { useState, useEffect } from 'react';
import Logger from '../common/middleware/logger';
import AuthService from '../common/auth/authService';
import './App.css';

const App: React.FC = () => {
  const [clientID, setClientID] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [logs, setLogs] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const logger = new Logger();
  const authService = new AuthService();

  const handleAuthenticate = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await authService.authenticate(clientID, clientSecret);
      setAccessToken(result.access_token);
      logger.setAccessToken(result.access_token);
      await logger.info('component', 'Authentication successful', 'frontend');
    } catch (err: any) {
      const errMsg = err.message || 'Authentication failed';
      setError(errMsg);
      await logger.error('component', errMsg, 'frontend');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Affordmed - Full Stack Challenge</h1>
        <p>Roll Number: 2300321530123</p>
      </header>

      <main className="app-main">
        <section className="auth-section">
          <h2>Authentication</h2>
          <div className="form-group">
            <label>Client ID:</label>
            <input
              type="text"
              value={clientID}
              onChange={(e) => setClientID(e.target.value)}
              placeholder="Enter Client ID"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Client Secret:</label>
            <input
              type="password"
              value={clientSecret}
              onChange={(e) => setClientSecret(e.target.value)}
              placeholder="Enter Client Secret"
              disabled={loading}
            />
          </div>

          <button
            onClick={handleAuthenticate}
            disabled={!clientID || !clientSecret || loading}
            className="btn-primary"
          >
            {loading ? 'Authenticating...' : 'Authenticate'}
          </button>

          {error && <div className="error-message">{error}</div>}
          {accessToken && <div className="success-message">✓ Authenticated</div>}
        </section>

        {accessToken && (
          <section className="logs-section">
            <h2>Logs</h2>
            <div className="logs-list">
              {logs.length === 0 ? (
                <p className="no-logs">No logs yet</p>
              ) : (
                logs.map((log, idx) => (
                  <div key={idx} className="log-item">
                    <strong>{log.level.toUpperCase()}</strong> [{log.package}] {log.message}
                  </div>
                ))
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default App;
