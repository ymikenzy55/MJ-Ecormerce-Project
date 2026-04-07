const Redis = require('ioredis');

let redisClient = null;
let isRedisConnected = false;

const connectRedis = async () => {
  try {
    // Parse Upstash Redis REST URL to get host and port
    const redisUrl = new URL(process.env.UPSTASH_REDIS_REST_URL);
    
    redisClient = new Redis({
      host: redisUrl.hostname,
      port: redisUrl.port || 6379,
      password: process.env.UPSTASH_REDIS_REST_TOKEN,
      tls: {
        rejectUnauthorized: false
      },
      retryStrategy: (times) => {
        if (times > 3) {
          console.warn('Redis connection failed after 3 retries. Operating with degraded rate limiting.');
          return null;
        }
        return Math.min(times * 1000, 3000);
      },
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      lazyConnect: true
    });

    await redisClient.connect();

    redisClient.on('connect', () => {
      isRedisConnected = true;
      console.log('✓ Upstash Redis connected successfully');
    });

    redisClient.on('error', (err) => {
      isRedisConnected = false;
      console.error('Redis connection error:', err.message);
      console.warn('Operating with degraded rate limiting functionality');
    });

    redisClient.on('close', () => {
      isRedisConnected = false;
      console.warn('Redis connection closed');
    });

  } catch (error) {
    console.error('Failed to initialize Redis:', error.message);
    console.warn('Operating without rate limiting functionality');
    isRedisConnected = false;
  }
};

const getRedisClient = () => {
  return redisClient;
};

const isRedisAvailable = () => {
  return isRedisConnected && redisClient && redisClient.status === 'ready';
};

module.exports = {
  connectRedis,
  getRedisClient,
  isRedisAvailable
};
