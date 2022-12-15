import { DynamoDBClient } from './dynamodb.client';

export abstract class BaseRepository<T extends { id: string }> {
  constructor(protected dynamoDBClient: DynamoDBClient, protected readonly tableName: string) {
    dynamoDBClient.setTableName(tableName);
  }

  async upsert(item: T): Promise<T> {
    return await this.dynamoDBClient.put(item);
  }

  async upsertMany(items: T[]): Promise<void> {
    await this.dynamoDBClient.batchPut(items);
  }

  async findOne(filter: Partial<T> = {}): Promise<T | undefined> {
    const items = await this.findMany(filter);

    if (items.length === 0) {
      return;
    }

    return items[0];
  }

  async findMany(filter: Partial<T> = {}): Promise<T[]> {
    return await this.dynamoDBClient.scan(filter);
  }

  async deleteById(id: string): Promise<void> {
    await this.dynamoDBClient.delete(id);
  }
}
