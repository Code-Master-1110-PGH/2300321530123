/**
 * Example service for reference
 * Demonstrates how to structure services in the backend
 */

import Logger from '../../common/middleware/logger';

const logger = new Logger();

export class ExampleService {
  async processData(data: any): Promise<any> {
    try {
      await logger.info('service', 'Processing data', 'backend');

      // Service business logic here

      return { processed: true };
    } catch (error: any) {
      await logger.error('service', `Service error: ${error.message}`, 'backend');
      throw error;
    }
  }
}
