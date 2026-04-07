const { getRedisClient, isRedisAvailable } = require('../config/redis');

const CACHE_TTL = 300; // 5 minutes
const PRODUCT_CACHE_KEY = 'products:all';

// Get product cache
const getProductCache = async (key = PRODUCT_CACHE_KEY) => {
  try {
    if (!isRedisAvailable()) {
      return null;
    }

    const redisClient = getRedisClient();
    const cached = await redisClient.get(key);

    if (cached) {
      return JSON.parse(cached);
    }

    return null;
  } catch (error) {
    console.error('Get product cache error:', error);
    return null;
  }
};

// Set product cache
const setProductCache = async (key = PRODUCT_CACHE_KEY, data) => {
  try {
    if (!isRedisAvailable()) {
      return false;
    }

    const redisClient = getRedisClient();
    await redisClient.setex(key, CACHE_TTL, JSON.stringify(data));

    return true;
  } catch (error) {
    console.error('Set product cache error:', error);
    return false;
  }
};

// Invalidate product cache
const invalidateProductCache = async () => {
  try {
    if (!isRedisAvailable()) {
      return false;
    }

    const redisClient = getRedisClient();
    
    // Delete all product-related cache keys
    const keys = await redisClient.keys('products:*');
    if (keys.length > 0) {
      await redisClient.del(...keys);
    }

    return true;
  } catch (error) {
    console.error('Invalidate product cache error:', error);
    return false;
  }
};

module.exports = {
  getProductCache,
  setProductCache,
  invalidateProductCache
};
