export const EVALUATION_SERVICE_URL = process.env.EVALUATION_SERVICE_URL || 'http://4.224.186.213/evaluation-service';
export const BACKEND_PORT = process.env.BACKEND_PORT || 5000;
export const NODE_ENV = process.env.NODE_ENV || 'development';

export const CLIENT_ID = process.env.CLIENT_ID || '';
export const CLIENT_SECRET = process.env.CLIENT_SECRET || '';
export const ACCESS_TOKEN = process.env.ACCESS_TOKEN || '';

export const ALLOWED_STACKS = ['backend', 'frontend'];
export const ALLOWED_LEVELS = ['debug', 'info', 'warn', 'error'];
export const ALLOWED_PACKAGES = {
  backend: ['cache', 'controller', 'cron_job', 'db', 'domain', 'handler', 'repository', 'route', 'service'],
  frontend: ['api', 'component', 'hook', 'page', 'state', 'style'],
  common: ['auth', 'config', 'middleware', 'utils']
};
