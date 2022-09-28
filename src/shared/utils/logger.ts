import { isProdEnv } from '@/shared/config/env';

export class Logger {
  constructor(private _tag: string, private _isActive = true, private _runOnProduction = false) {}

  log(message: string, ...args: any[]) {
    if (this._isActive && isProdEnv === this._runOnProduction)
      console.log(`[${this._tag}]: ${message}`, ...args);
  }
}
