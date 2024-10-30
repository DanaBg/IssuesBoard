import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
});

export const getValue = async (key: string): Promise<string | null> => {
    try {
      const value = await redis.get(key);
      return value;
    } catch (error) {
      console.error('Error getting value from Redis:', error);
      throw error;
    }
};
  
  export const setValue = async (key: string, value: string, expiresInSec?: number) => {
    try {
      if(expiresInSec) {
        await redis.set(key, value, 'EX', expiresInSec);
      } else {
        await redis.set(key, value);
      }
    } catch (error) {
      console.error('Error setting value in Redis:', error);
      throw error;
    }
};

export default redis;