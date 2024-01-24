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

  async set(key: string, value: string, hours: number): Promise<void> {
    let exp = hours * 60 * 60;
    await this.client.setex(key, exp, value);
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }
}
