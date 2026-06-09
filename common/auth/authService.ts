import axios, { AxiosInstance } from 'axios';

export interface RegisterPayload {
  email: string;
  rollNumber: string;
  gitHubUsername: string;
  accessCode: string;
  track: 'fullstack' | 'backend' | 'frontend';
}

export interface RegisterResponse {
  clientID: string;
  clientSecret: string;
}

export interface AuthPayload {
  clientID: string;
  clientSecret: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

class AuthService {
  private httpClient: AxiosInstance;
  private evaluationServiceUrl: string;

  constructor(evaluationServiceUrl: string = 'http://4.224.186.213/evaluation-service') {
    this.evaluationServiceUrl = evaluationServiceUrl;
    this.httpClient = axios.create({
      baseURL: evaluationServiceUrl,
      timeout: 10000
    });
  }

  async register(payload: RegisterPayload): Promise<RegisterResponse> {
    try {
      const response = await this.httpClient.post<RegisterResponse>('/register', {
        email: payload.email,
        rollNumber: payload.rollNumber,
        gitHubUsername: payload.gitHubUsername,
        accessCode: payload.accessCode,
        track: payload.track
      });

      return response.data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  async authenticate(clientID: string, clientSecret: string): Promise<AuthResponse> {
    try {
      const response = await this.httpClient.post<AuthResponse>('/auth', {
        clientID,
        clientSecret
      });

      return response.data;
    } catch (error) {
      console.error('Authentication failed:', error);
      throw error;
    }
  }
}

export default AuthService;
