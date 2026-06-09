import axios from 'axios';

export type Stack = 'backend' | 'frontend';
export type Level = 'debug' | 'info' | 'warn' | 'error';

export interface LogPayload {
  stack: Stack;
  level: Level;
  package: string;
  message: string;
}

export interface LogResponse {
  logID: string;
  message: string;
}

const ALLOWED_STACKS = ['backend', 'frontend'];
const ALLOWED_LEVELS = ['debug', 'info', 'warn', 'error'];
const ALLOWED_PACKAGES: any = {
  backend: ['cache', 'controller', 'cron_job', 'db', 'domain', 'handler', 'repository', 'route', 'service'],
  frontend: ['api', 'component', 'hook', 'page', 'state', 'style'],
  common: ['auth', 'config', 'middleware', 'utils']
};

class Logger {
  private evaluationServiceUrl: string;
  private accessToken: string = '';

  constructor(evaluationServiceUrl: string = (process.env.REACT_APP_EVALUATION_SERVICE_URL as string) || 'http://4.224.186.213/evaluation-service') {
    this.evaluationServiceUrl = evaluationServiceUrl;
  }

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  private validatePayload(payload: LogPayload) {
    if (!ALLOWED_STACKS.includes(payload.stack)) throw new Error('Invalid stack');
    if (!ALLOWED_LEVELS.includes(payload.level)) throw new Error('Invalid level');
    const allowed = ALLOWED_PACKAGES[payload.stack];
    if (allowed && !allowed.includes(payload.package)) throw new Error('Invalid package');
    if (!payload.message) throw new Error('Message required');
    return true;
  }

  async log(payload: LogPayload): Promise<LogResponse> {
    this.validatePayload(payload);

    const body = {
      stack: payload.stack.toLowerCase(),
      level: payload.level.toLowerCase(),
      package: payload.package.toLowerCase(),
      message: payload.message
    };

    const res = await axios.post(`${this.evaluationServiceUrl}/logs`, body, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    return res.data as LogResponse;
  }

  async info(pkg: string, message: string, stack: Stack = 'frontend') {
    return this.log({ stack, level: 'info', package: pkg, message });
  }

  async error(pkg: string, message: string, stack: Stack = 'frontend') {
    return this.log({ stack, level: 'error', package: pkg, message });
  }
}

export default Logger;
