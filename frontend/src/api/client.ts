import axios, { AxiosInstance } from 'axios';

class ApiClient {
  private instance: AxiosInstance;
  private accessToken: string = '';

  constructor(baseURL: string = process.env.REACT_APP_API_URL || 'http://localhost:5000') {
    this.instance = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.instance.interceptors.request.use((config) => {
      if (this.accessToken) {
        config.headers.Authorization = `Bearer ${this.accessToken}`;
      }
      return config;
    });

    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized
          console.error('Unauthorized - token may have expired');
        }
        return Promise.reject(error);
      }
    );
  }

  setAccessToken(token: string): void {
    this.accessToken = token;
  }

  async register(email: string, rollNumber: string, gitHubUsername: string, accessCode: string): Promise<any> {
    const response = await this.instance.post('/api/auth/register', {
      email,
      rollNumber,
      gitHubUsername,
      accessCode,
      track: 'fullstack'
    });
    return response.data;
  }

  async authenticate(clientID: string, clientSecret: string): Promise<any> {
    const response = await this.instance.post('/api/auth/authenticate', {
      clientID,
      clientSecret
    });
    return response.data;
  }

  async createLog(stack: string, level: string, pkg: string, message: string): Promise<any> {
    const response = await this.instance.post('/api/logs', {
      stack,
      level,
      package: pkg,
      message
    });
    return response.data;
  }
}

export default new ApiClient();
