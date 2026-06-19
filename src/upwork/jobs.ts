import { upworkClient } from './client.js';
import fs from 'fs';
import path from 'path';

interface JobSearchCriteria {
  skills?: string[];
  category?: string;
  minBudget?: number;
  maxBudget?: number;
  minClientRating?: number;
  limit?: number;
}

interface AcceptanceRules {
  acceptJobs: boolean;
  minClientRating: number;
  minPayment: number;
}

interface JobLog {
  jobId: string;
  title: string;
  budget: number;
  status: 'accepted' | 'rejected' | 'proposed';
  timestamp: number;
  reason?: string;
}

const JOB_LOG_FILE = path.join(process.cwd(), '.job_log.json');

export class JobManager {
  private jobLog: JobLog[] = [];
  private searchCriteria: JobSearchCriteria = {};
  private acceptanceRules: AcceptanceRules = {
    acceptJobs: false,
    minClientRating: 4.0,
    minPayment: 0,
  };

  constructor() {
    this.loadJobLog();
  }

  private loadJobLog(): void {
    try {
      if (fs.existsSync(JOB_LOG_FILE)) {
        const data = fs.readFileSync(JOB_LOG_FILE, 'utf-8');
        this.jobLog = JSON.parse(data);
      }
    } catch (error) {
      console.error('Failed to load job log:', error);
    }
  }

  private saveJobLog(): void {
    fs.writeFileSync(JOB_LOG_FILE, JSON.stringify(this.jobLog, null, 2), 'utf-8');
  }

  setSearchCriteria(criteria: JobSearchCriteria): void {
    this.searchCriteria = { ...this.searchCriteria, ...criteria };
  }

  setAcceptanceRules(rules: Partial<AcceptanceRules>): void {
    this.acceptanceRules = { ...this.acceptanceRules, ...rules };
  }

  async searchJobs() {
    try {
      const jobs = await upworkClient.searchJobs({
        skills: this.searchCriteria.skills,
        category: this.searchCriteria.category,
        minBudget: this.searchCriteria.minBudget,
        maxBudget: this.searchCriteria.maxBudget,
        limit: this.searchCriteria.limit || 10,
      });

      return jobs;
    } catch (error) {
      console.error('Failed to search jobs:', error);
      throw error;
    }
  }

  async acceptJob(jobId: string, coverLetter: string, desiredRate?: number): Promise<boolean> {
    try {
      if (!this.acceptanceRules.acceptJobs) {
        console.log('Auto-accept is disabled');
        return false;
      }

      const job = await upworkClient.getJob(jobId);

      if (job.client?.feedback_count < this.acceptanceRules.minClientRating) {
        console.log(`Client rating ${job.client.feedback_count} is below minimum ${this.acceptanceRules.minClientRating}`);
        this.logJob(jobId, job.title, job.budget, 'rejected', 'Client rating too low');
        return false;
      }

      if (job.budget < this.acceptanceRules.minPayment) {
        console.log(`Job budget ${job.budget} is below minimum ${this.acceptanceRules.minPayment}`);
        this.logJob(jobId, job.title, job.budget, 'rejected', 'Budget too low');
        return false;
      }

      await upworkClient.submitProposal(jobId, {
        coverLetter,
        desiredRate,
      });

      this.logJob(jobId, job.title, job.budget, 'proposed');
      return true;
    } catch (error) {
      console.error(`Failed to accept job ${jobId}:`, error);
      return false;
    }
  }

  private logJob(jobId: string, title: string, budget: number, status: 'accepted' | 'rejected' | 'proposed', reason?: string): void {
    this.jobLog.push({
      jobId,
      title,
      budget,
      status,
      timestamp: Date.now(),
      reason,
    });
    this.saveJobLog();
  }

  getJobLog(): JobLog[] {
    return this.jobLog;
  }

  getSearchCriteria(): JobSearchCriteria {
    return this.searchCriteria;
  }

  getAcceptanceRules(): AcceptanceRules {
    return this.acceptanceRules;
  }
}

export const jobManager = new JobManager();
