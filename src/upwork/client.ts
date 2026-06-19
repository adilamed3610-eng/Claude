import axios, { AxiosInstance } from 'axios';
import { oauth } from '../auth/oauth.js';
import { tokenManager } from '../auth/token-manager.js';
import { logger } from '../utils/logger.js';
import { handleApiError } from '../utils/error-handler.js';

const UPWORK_API_BASE = 'https://api.upwork.com/api';

export class UpworkClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: UPWORK_API_BASE,
      headers: {
        'Accept': 'application/json',
      },
    });

    this.client.interceptors.request.use(async (config) => {
      let token = oauth.getAccessToken();

      if (!token) {
        throw new Error('Not authenticated. Please authenticate first.');
      }

      if (tokenManager.isTokenExpired()) {
        token = await oauth.refreshAccessToken();
      }

      config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
  }

  async getProfile() {
    try {
      logger.debug('Fetching user profile');
      const response = await this.client.get('/hr/v2/users/me');
      logger.info('Profile fetched successfully');
      return response.data;
    } catch (error) {
      logger.error('Failed to get profile', error);
      throw handleApiError(error);
    }
  }

  async searchJobs(params: {
    skills?: string[];
    category?: string;
    minBudget?: number;
    maxBudget?: number;
    limit?: number;
  }) {
    try {
      logger.debug('Searching jobs', params);
      const queryParams = new URLSearchParams();

      if (params.skills) {
        queryParams.append('skills', params.skills.join(','));
      }
      if (params.category) {
        queryParams.append('category', params.category);
      }
      if (params.minBudget) {
        queryParams.append('min_budget', params.minBudget.toString());
      }
      if (params.maxBudget) {
        queryParams.append('max_budget', params.maxBudget.toString());
      }
      if (params.limit) {
        queryParams.append('limit', params.limit.toString());
      }

      const response = await this.client.get(`/profiles/v2/search/jobs?${queryParams}`);
      logger.info(`Found ${response.data?.jobs?.length || 0} jobs`);
      return response.data;
    } catch (error) {
      logger.error('Failed to search jobs', error);
      throw handleApiError(error);
    }
  }

  async getJob(jobId: string) {
    try {
      const response = await this.client.get(`/jobs/v2/${jobId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get job:', error);
      throw error;
    }
  }

  async submitProposal(jobId: string, proposal: {
    coverLetter: string;
    desiredRate?: number;
    desiredRateType?: 'hourly' | 'fixed';
  }) {
    try {
      const response = await this.client.post(`/proposals/v2/contractors/me/offers`, {
        engagement_id: jobId,
        proposal: proposal.coverLetter,
        rate: proposal.desiredRate,
        rate_type: proposal.desiredRateType,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to submit proposal:', error);
      throw error;
    }
  }

  async getContracts() {
    try {
      const response = await this.client.get('/contracts/v2/contracts');
      return response.data;
    } catch (error) {
      console.error('Failed to get contracts:', error);
      throw error;
    }
  }

  async sendMessage(contractId: string, message: string) {
    try {
      const response = await this.client.post(`/messages/v3/${contractId}`, {
        body: message,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }

  async getMessages(contractId: string) {
    try {
      const response = await this.client.get(`/messages/v3/${contractId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get messages:', error);
      throw error;
    }
  }

  async submitDeliverable(contractId: string, deliverable: {
    description: string;
    files?: string[];
  }) {
    try {
      const response = await this.client.post(`/deliverables/v1/${contractId}`, {
        description: deliverable.description,
        files: deliverable.files,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to submit deliverable:', error);
      throw error;
    }
  }
}

export const upworkClient = new UpworkClient();
