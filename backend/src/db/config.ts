/**
 * Example database configuration
 * Update with your actual database credentials
 */

export interface DbConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

const config: DbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'affordmed',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || ''
};

export default config;
