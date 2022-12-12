import { Inject, Injectable, Scope } from '@nestjs/common';
import chalk, { ChalkInstance } from 'chalk';
import { LoggerFormat } from './LoggerFormat';
import { LogLevel } from './LogLevel';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService {
  private context: string | undefined;

  constructor(@Inject('LOGGER_FORMAT') private readonly loggerFormat: LoggerFormat) {}

  info(message: string, data?: Record<string, any>): void {
    this.print('info', message, data);
  }

  warn(message: any, data?: Record<string, any>): void {
    this.print('warn', message, data);
  }

  error(error: string | Error, trace?: string): void {
    if (error instanceof Error) {
      this.print('error', error.message, { stack: error.stack });
    } else {
      this.print('error', error, { stack: trace });
    }
  }

  debug(message: any, data?: Record<string, any>): void {
    this.print('debug', message, data);
  }

  setContext(context: string): void {
    this.context = context;
  }

  private print(level: LogLevel, message: string, data?: Record<string, any>): void {
    const output = this.getFormattedOutput(level, message, data);

    console[level](output);
  }

  private getFormattedOutput(level: LogLevel, message: string, data?: Record<string, any>): string {
    switch (this.loggerFormat) {
      case LoggerFormat.string:
        return this.getString(level, message, data);
      case LoggerFormat.json:
        return this.getJson(level, message, data);
    }
  }

  private getString(level: LogLevel, message: string, data?: Record<string, any>): string {
    const color = this.getColor(level);
    const timestamp = new Date().toLocaleString();
    const lvl = color(level.toUpperCase());
    const context = this.context ? chalk.hex('#FFA500')(` [${this.context}] `) : '';
    const jsonData = data ? `\n${JSON.stringify(data)}` : '';
    const msg = chalk.white(level === 'error' && data?.stack ? data.stack : message);

    return `${timestamp} ${lvl}${context}${msg}${jsonData}`.trim();
  }

  private getJson(level: LogLevel, message: string, data?: Record<string, any>): string {
    return JSON.stringify({
      ...data,
      message,
      status: level,
      context: this.context,
      timestamp: new Date().toISOString(),
    });
  }

  private getColor(level: LogLevel): ChalkInstance {
    switch (level) {
      case 'info':
        return chalk.blue;
      case 'warn':
        return chalk.yellow;
      case 'error':
        return chalk.red;
      case 'debug':
        return chalk.green;
      default:
        return chalk.white;
    }
  }
}
