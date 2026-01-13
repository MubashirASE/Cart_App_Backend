import { createClient } from 'redis';

const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

try {
    await redisClient.connect();
    console.log('Connected to Redis');
} catch (error) {
    console.error('Could not connect to Redis', error);
}

export default redisClient;
