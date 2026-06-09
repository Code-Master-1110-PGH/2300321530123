import { Pool } from 'pg';
import config from './config';

const pool = new Pool({
  host: config.host,
  port: config.port,
  database: config.database,
  user: config.username,
  password: config.password,
});

pool.on('error', (err) => {
  console.error('Postgres pool error', err);
});

export default pool;
