import fs from 'fs';
import path from 'path';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  data?: any;
}

export class Logger {
  private logLevel: LogLevel = LogLevel.INFO;
  private logFile: string | null = null;
  private logs: LogEntry[] = [];

  constructor(level: LogLevel = LogLevel.INFO, logFile?: string) {
    this.logLevel = level;
    if (logFile) {
      this.logFile = path.join(process.cwd(), logFile);
      this.ensureLogFile();
    }
  }

  private ensureLogFile(): void {
    if (this.logFile && !fs.existsSync(this.logFile)) {
      fs.writeFileSync(this.logFile, '');
    }
  }

  private writeLog(entry: LogEntry): void {
    this.logs.push(entry);

    if (this.logFile) {
      const logLine = `[${entry.timestamp}] ${entry.level}: ${entry.message}${
        entry.data ? ' ' + JSON.stringify(entry.data) : ''
      }\n`;
      fs.appendFileSync(this.logFile, logLine, 'utf-8');
    }
  }

  debug(message: string, data?: any): void {
    if (this.logLevel <= LogLevel.DEBUG) {
      this.writeLog({
        timestamp: new Date().toISOString(),
        level: 'DEBUG',
        message,
        data,
      });
    }
  }

  info(message: string, data?: any): void {
    if (this.logLevel <= LogLevel.INFO) {
      this.writeLog({
        timestamp: new Date().toISOString(),
        level: 'INFO',
        message,
        data,
      });
    }
  }

  warn(message: string, data?: any): void {
    if (this.logLevel <= LogLevel.WARN) {
      console.warn(`[WARN] ${message}`, data);
      this.writeLog({
        timestamp: new Date().toISOString(),
        level: 'WARN',
        message,
        data,
      });
    }
  }

  error(message: string, error?: any): void {
    if (this.logLevel <= LogLevel.ERROR) {
      console.error(`[ERROR] ${message}`, error);
      this.writeLog({
        timestamp: new Date().toISOString(),
        level: 'ERROR',
        message,
        data: error instanceof Error ? error.message : error,
      });
    }
  }

  getLogs(level?: LogLevel): LogEntry[] {
    if (level !== undefined) {
      return this.logs.filter((log) => LogLevel[log.level as keyof typeof LogLevel] >= level);
    }
    return this.logs;
  }

  clearLogs(): void {
    this.logs = [];
  }
}

export const logger = new Logger(LogLevel.INFO, '.log');
