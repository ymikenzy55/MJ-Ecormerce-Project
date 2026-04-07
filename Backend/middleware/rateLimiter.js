const { getRedisClient, isRedisAvailable } = require('../config/redis');

const RATE_LIMIT_WINDOW = 60; // 60 seconds
const RATE_LIMIT_MAX_REQUESTS = 100;

const rateLimiter = async (req, res, next) => {
  // If Redis is not available, allow request with degraded functionality
  if (!isRedisAvailable()) {
    console.warn('Rate limiter: Redis unavailable, allowing request');
    return next();
  }

  try {
    const redisClient = getRedisClient();
    
    // Identify user by IP address or user ID if authenticated
    const identifier = req.user?.id || req.ip || req.connection.remoteAddress;
    const key = `rate_limit:${identifier}`;

    // Get current request count
    const currentCount = await redisClient.get(key);
    
    if (currentCount && parseInt(currentCount) >= RATE_LIMIT_MAX_REQUESTS) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.',
        retryAfter: RATE_LIMIT_WINDOW
      });
    }

    // Increment counter
    const newCount = await redisClient.incr(key);
    
    // Set expiration on first request
    if (newCount === 1) {
      await redisClient.expire(key, RATE_LIMIT_WINDOW);
    }

    // Add rate limit headers
    res.setHeader('X-RateLimit-Limit', RATE_LIMIT_MAX_REQUESTS);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, RATE_LIMIT_MAX_REQUESTS - newCount));
    res.setHeader('X-RateLimit-Reset', Date.now() + (RATE_LIMIT_WINDOW * 1000));

    next();
  } catch (error) {
    console.error('Rate limiter error:', error.message);
    // Allow request on error to prevent blocking legitimate traffic
    next();
  }
};

module.exports = rateLimiter;
