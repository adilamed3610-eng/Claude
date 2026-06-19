import axios from 'axios';
import { tokenManager } from './token-manager.js';

const UPWORK_AUTH_URL = 'https://www.upwork.com/oauth2/authorize';
const UPWORK_TOKEN_URL = 'https://api.upwork.com/oauth2/tokenize';

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export class UpworkOAuth {
  private clientId: string;
  private clientSecret: string;
  private callbackUrl: string;

  constructor() {
    this.clientId = process.env.UPWORK_CLIENT_ID || '';
    this.clientSecret = process.env.UPWORK_CLIENT_SECRET || '';
    this.callbackUrl = process.env.UPWORK_CALLBACK_URL || 'http://localhost:3000/callback';

    if (!this.clientId || !this.clientSecret) {
      throw new Error('UPWORK_CLIENT_ID and UPWORK_CLIENT_SECRET must be set in environment');
    }
  }

  getAuthorizationUrl(state?: string): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: 'code',
      redirect_uri: this.callbackUrl,
      state: state || 'state',
    });

    return `${UPWORK_AUTH_URL}?${params.toString()}`;
  }

  async exchangeCodeForToken(code: string): Promise<void> {
    try {
      const response = await axios.post<TokenResponse>(
        UPWORK_TOKEN_URL,
        {
          grant_type: 'authorization_code',
          code,
          redirect_uri: this.callbackUrl,
          client_id: this.clientId,
          client_secret: this.clientSecret,
        },
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      );

      const { access_token, refresh_token, expires_in } = response.data;
      tokenManager.saveTokens(access_token, refresh_token, expires_in);
    } catch (error) {
      console.error('Failed to exchange code for token:', error);
      throw error;
    }
  }

  async refreshAccessToken(): Promise<string> {
    const refreshToken = tokenManager.getRefreshToken();

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post<TokenResponse>(
        UPWORK_TOKEN_URL,
        {
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: this.clientId,
          client_secret: this.clientSecret,
        }
      );

      const { access_token, refresh_token, expires_in } = response.data;
      tokenManager.saveTokens(access_token, refresh_token, expires_in);
      return access_token;
    } catch (error) {
      console.error('Failed to refresh access token:', error);
      throw error;
    }
  }

  getAccessToken(): string | null {
    return tokenManager.getAccessToken();
  }

  isAuthenticated(): boolean {
    return !!tokenManager.getAccessToken();
  }
}

export const oauth = new UpworkOAuth();
