import Redis from 'ioredis';

let client: Redis | null = null;

export function initRedis(url?: string) {
  if (client) return client;
  const redisUrl = url || process.env.REDIS_URL || 'redis://127.0.0.1:6379';
  client = new Redis(redisUrl);
  client.on('error', (e) => console.error('Redis error', e));
  return client;
}

export async function cacheGet(key: string) {
  if (!client) initRedis();
  return client!.get(key);
}

export async function cacheSet(key: string, value: string, ttlSec?: number) {
  if (!client) initRedis();
  if (ttlSec) return client!.set(key, value, 'EX', ttlSec);
  return client!.set(key, value);
}

export async function cacheDel(key: string) {
  if (!client) initRedis();
  return client!.del(key);
}

export async function zadd(key: string, score: number, member: string) {
  if (!client) initRedis();
  return client!.zadd(key, score.toString(), member);
}

export async function zrevrange(key: string, start: number, stop: number) {
  if (!client) initRedis();
  return client!.zrevrange(key, start, stop);
}

export async function incr(key: string) {
  if (!client) initRedis();
  return client!.incr(key);
}

export async function decr(key: string) {
  if (!client) initRedis();
  return client!.decr(key);
}

export default {
  initRedis,
  cacheGet,
  cacheSet,
  cacheDel,
  zadd,
  zrevrange,
  incr,
  decr,
};
