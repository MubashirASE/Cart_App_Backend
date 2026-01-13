import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import redisClient from '../utils/redisClient.js';

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    store: new RedisStore({
        sendCommand: (...args) => redisClient.sendCommand(args),
    }),
    message: {
        status: 429,
        message: "Too many requests, please try again later."
    }
});

export default limiter;
