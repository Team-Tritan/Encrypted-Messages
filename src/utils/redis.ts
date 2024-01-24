import Redis, { RedisOptions } from "ioredis";

export class RedisWrapper {
  private client: Redis;

  constructor() {
    const options: RedisOptions = {
      host: "redis",
      port: 6379,
      password: "redis",
    };

    this.client = new Redis(options);

    this.client.connect(() => {
      console.log("Redis client connected");
    });
  }

  async set(key: string, value: string): Promise<void> {
    // Set the key with an expiration time of 24 hours
    await this.client.setex(key, 24 * 60 * 60, value);
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }
}
