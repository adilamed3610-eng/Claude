import fs from 'fs';
import path from 'path';

export interface JobSearchCriteria {
  skills?: string[];
  category?: string;
  minBudget?: number;
  maxBudget?: number;
  limit?: number;
}

export interface AutoAcceptRules {
  acceptJobs: boolean;
  minClientRating: number;
  minPayment: number;
}

export interface TaskInstructions {
  [key: string]: string;
}

export interface ResponseTemplates {
  jobAccepted?: string;
  workStarted?: string;
  workCompleted?: string;
}

export interface Config {
  jobSearchCriteria?: JobSearchCriteria;
  autoAcceptRules?: AutoAcceptRules;
  taskInstructions?: TaskInstructions;
  communicationStyle?: {
    autoRespond?: boolean;
    responseTemplates?: ResponseTemplates;
  };
  logging?: {
    enabled?: boolean;
    logFile?: string;
    verbosity?: 'info' | 'debug' | 'error';
  };
}

const CONFIG_FILE = path.join(process.cwd(), 'config.json');
const CONFIG_EXAMPLE_FILE = path.join(process.cwd(), 'config.example.json');

export class ConfigLoader {
  private config: Config = {};

  constructor() {
    this.loadConfig();
  }

  private loadConfig(): void {
    try {
      if (fs.existsSync(CONFIG_FILE)) {
        const data = fs.readFileSync(CONFIG_FILE, 'utf-8');
        this.config = JSON.parse(data);
      } else if (fs.existsSync(CONFIG_EXAMPLE_FILE)) {
        console.log('Using example config. Copy config.example.json to config.json to customize.');
        const data = fs.readFileSync(CONFIG_EXAMPLE_FILE, 'utf-8');
        this.config = JSON.parse(data);
      }
    } catch (error) {
      console.error('Failed to load config:', error);
    }
  }

  getJobSearchCriteria(): JobSearchCriteria {
    return this.config.jobSearchCriteria || {};
  }

  getAutoAcceptRules(): AutoAcceptRules {
    return this.config.autoAcceptRules || {
      acceptJobs: false,
      minClientRating: 4.0,
      minPayment: 0,
    };
  }

  getTaskInstructions(): TaskInstructions {
    return this.config.taskInstructions || {};
  }

  getResponseTemplates(): ResponseTemplates {
    return this.config.communicationStyle?.responseTemplates || {};
  }

  shouldAutoRespond(): boolean {
    return this.config.communicationStyle?.autoRespond ?? false;
  }

  getFullConfig(): Config {
    return this.config;
  }
}

export const configLoader = new ConfigLoader();
