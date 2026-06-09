import axios from 'axios';

export interface LogPayload {
  stack: 'backend' | 'frontend';
  level: 'debug' | 'info' | 'warn' | 'error';
  package: string;
  message: string;
}

export interface LogResponse {
  logID: string;
  message: string;
}

const ALLOWED_STACKS = ['backend', 'frontend'];
const ALLOWED_LEVELS = ['debug', 'info', 'warn', 'error'];
const ALLOWED_PACKAGES = {
  backend: ['cache', 'controller', 'cron_job', 'db', 'domain', 'handler', 'repository', 'route', 'service'],
  frontend: ['api', 'component', 'hook', 'page', 'state', 'style'],
  common: ['auth', 'config', 'middleware', 'utils']
};

class Logger {
  private httpClient: any;
  private accessToken: string = '';
  private evaluationServiceUrl: string;

  constructor(evaluationServiceUrl: string = 'http://4.224.186.213/evaluation-service') {
    this.evaluationServiceUrl = evaluationServiceUrl;
    this.httpClient = axios.create({
      baseURL: evaluationServiceUrl,
      timeout: 5000
    });
  }

  setAccessToken(token: string): void {
    this.accessToken = token;
  }

  private validatePayload(payload: LogPayload): boolean {
    if (!ALLOWED_STACKS.includes(payload.stack)) {
      throw new Error(`Invalid stack: ${payload.stack}. Allowed: ${ALLOWED_STACKS.join(', ')}`);
    }
    if (!ALLOWED_LEVELS.includes(payload.level)) {
      throw new Error(`Invalid level: ${payload.level}. Allowed: ${ALLOWED_LEVELS.join(', ')}`);
    }

    const allowedPackagesForStack = ALLOWED_PACKAGES[payload.stack as keyof typeof ALLOWED_PACKAGES];
    if (allowedPackagesForStack && !allowedPackagesForStack.includes(payload.package)) {
      throw new Error(
        `Invalid package for ${payload.stack}: ${payload.package}. Allowed: ${allowedPackagesForStack.join(', ')}`
      );
    }

    if (!payload.message || typeof payload.message !== 'string') {
      throw new Error('Message is required and must be a string');
    }

    return true;
  }

  async log(payload: LogPayload): Promise<LogResponse> {
    try {
      this.validatePayload(payload);

      const logPayload = {
        stack: payload.stack.toLowerCase(),
        level: payload.level.toLowerCase(),
        package: payload.package.toLowerCase(),
        message: payload.message
      };

      if (!this.accessToken || this.accessToken.trim().length === 0) {
        console.warn('Logger: no access token set, skipping remote log (local only)');
        return { logID: `local-${Date.now()}`, message: 'skipped remote log' } as LogResponse;
      }

      const response: any = await this.httpClient.post('/logs', logPayload, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data as LogResponse;
    } catch (error) {
      console.error('Failed to send log:', error);
      throw error;
    }
  }

  async debug(pkg: string, message: string, stack: 'backend' | 'frontend' = 'backend'): Promise<LogResponse> {
    return this.log({ stack, level: 'debug', package: pkg, message });
  }

  async info(pkg: string, message: string, stack: 'backend' | 'frontend' = 'backend'): Promise<LogResponse> {
    return this.log({ stack, level: 'info', package: pkg, message });
  }

  async warn(pkg: string, message: string, stack: 'backend' | 'frontend' = 'backend'): Promise<LogResponse> {
    return this.log({ stack, level: 'warn', package: pkg, message });
  }

  async error(pkg: string, message: string, stack: 'backend' | 'frontend' = 'backend'): Promise<LogResponse> {
    return this.log({ stack, level: 'error', package: pkg, message });
  }
}

export default Logger;
