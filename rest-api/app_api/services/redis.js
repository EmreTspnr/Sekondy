const Redis = require('ioredis');

// Connect to Redis using the REDIS_URL environment variable 
// (or fallback to localhost for local testing outside of Docker)
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

redis.on('connect', () => {
  console.log('Connected to Redis successfully');
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

module.exports = redis;
