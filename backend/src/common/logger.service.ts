// src/common/logger/logger.service.ts
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppLogger extends Logger {
  constructor(context: string) {
    super(context); // context chính là tiền tố: [Controller], [Service], v.v.
  }

  logError(error: any) {
    this.error(error.message ?? error, error.stack);
  }
}
