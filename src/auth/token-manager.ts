import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

interface StoredToken {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

const TOKENS_FILE = path.join(process.cwd(), '.tokens.json');
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-dev-key-change-in-production';

export class TokenManager {
  private tokens: StoredToken | null = null;

  constructor() {
    this.loadTokens();
  }

  private encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY.padEnd(32)), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  }

  private decrypt(text: string): string {
    const parts = text.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY.padEnd(32)), iv);
    let decrypted = decipher.update(parts[1], 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  private loadTokens(): void {
    try {
      if (fs.existsSync(TOKENS_FILE)) {
        const data = fs.readFileSync(TOKENS_FILE, 'utf-8');
        const parsed = JSON.parse(data);
        this.tokens = {
          accessToken: this.decrypt(parsed.accessToken),
          refreshToken: this.decrypt(parsed.refreshToken),
          expiresAt: parsed.expiresAt,
        };
      }
    } catch (error) {
      console.error('Failed to load tokens:', error);
    }
  }

  saveTokens(accessToken: string, refreshToken: string, expiresIn: number): void {
    this.tokens = {
      accessToken,
      refreshToken,
      expiresAt: Date.now() + expiresIn * 1000,
    };

    const encrypted = {
      accessToken: this.encrypt(accessToken),
      refreshToken: this.encrypt(refreshToken),
      expiresAt: this.tokens.expiresAt,
    };

    fs.writeFileSync(TOKENS_FILE, JSON.stringify(encrypted), 'utf-8');
  }

  getAccessToken(): string | null {
    if (!this.tokens) return null;
    if (this.tokens.expiresAt < Date.now()) return null;
    return this.tokens.accessToken;
  }

  getRefreshToken(): string | null {
    return this.tokens?.refreshToken || null;
  }

  isTokenExpired(): boolean {
    if (!this.tokens) return true;
    return this.tokens.expiresAt < Date.now();
  }

  clearTokens(): void {
    this.tokens = null;
    if (fs.existsSync(TOKENS_FILE)) {
      fs.unlinkSync(TOKENS_FILE);
    }
  }
}

export const tokenManager = new TokenManager();
