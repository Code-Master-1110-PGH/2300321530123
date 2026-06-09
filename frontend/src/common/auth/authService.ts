import axios from 'axios';

export interface RegisterPayload {
  name: string;
  email: string;
  rollNo: string;
  mobileNo: string;
  gitHubUsername: string;
  accessCode: string;
  track: 'fullstack' | 'backend' | 'frontend';
}

export interface RegisterResponse {
  clientID: string;
  clientSecret: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

class AuthService {
  private evaluationServiceUrl: string;

  constructor(evaluationServiceUrl: string = (process.env.REACT_APP_EVALUATION_SERVICE_URL as string) || 'http://4.224.186.213/evaluation-service') {
    this.evaluationServiceUrl = evaluationServiceUrl;
  }

  async register(payload: RegisterPayload): Promise<RegisterResponse> {
    const res = await axios.post(`${this.evaluationServiceUrl}/register`, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
    return res.data;
  }

  // Accept either (clientID, clientSecret) or a full auth object
  async authenticate(clientIDOrPayload: any, clientSecret?: string): Promise<AuthResponse> {
    let payload: any;
    if (typeof clientIDOrPayload === 'string' && typeof clientSecret === 'string') {
      payload = { clientID: clientIDOrPayload, clientSecret };
    } else {
      payload = clientIDOrPayload;
    }

    const res = await axios.post(`${this.evaluationServiceUrl}/auth`, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
    return res.data;
  }
}

export default AuthService;
