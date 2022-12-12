import { DynamoDBDocument, QueryCommandInput, ScanCommandInput } from '@aws-sdk/lib-dynamodb';
import { Injectable } from '@nestjs/common';
import { marshallDates } from './marshallDates';
import { TCommandInput } from './TCommandInput';
import { unmarshallDates } from './unmarshallDates';

const maxBatchWriteItems = 25;

type TItem = {
  id: string;
};

@Injectable()
export class DynamoDBClient {
  private tableName = '';

  constructor(private readonly dynamoDBClient: DynamoDBDocument) {}

  setTableName(tableName: string) {
    this.tableName = tableName;
  }

  async get<T extends TItem>(id: string): Promise<T | undefined> {
    try {
      const result = await this.dynamoDBClient.get({
        TableName: this.tableName,
        Key: {
          id,
        },
      });
      const item = unmarshallDates(result.Item);

      return item as T;
    } catch (error: any) {
      return undefined;
    }
  }

  async query<T extends TItem>(
    query: Partial<T>,
    indexName?: string,
    filter: Partial<T> = {},
  ): Promise<T[]> {
    return this.recursiveQuery(query, indexName, filter);
  }

  private async recursiveQuery<T extends TItem>(
    query: Partial<T>,
    indexName?: string,
    filter: Partial<T> = {},
    lastEvaluatedKey?: Record<string, any>,
  ): Promise<T[]> {
    const result = await this.dynamoDBClient.query(
      this.createQueryCommandInput(query, filter, indexName, lastEvaluatedKey),
    );

    const items = unmarshallDates(result.Items) as T[];

    if (!result.LastEvaluatedKey) {
      return items;
    }

    const nextItems = await this.recursiveQuery(query, indexName, filter, result.LastEvaluatedKey);
    return [...items, ...nextItems];
  }

  async scan<T extends TItem>(filter: Partial<T> = {}, indexName?: string): Promise<T[]> {
    return this.recursiveScan(filter, indexName);
  }

  private async recursiveScan<T extends TItem>(
    filter: Partial<T> = {},
    indexName?: string,
    lastEvaluatedKey?: Record<string, any>,
  ): Promise<T[]> {
    const result = await this.dynamoDBClient.scan(
      this.createScanCommandInput(filter, indexName, lastEvaluatedKey),
    );

    const items = unmarshallDates(result.Items) as T[];

    if (!result.LastEvaluatedKey) {
      return items;
    }

    const nextItems = await this.recursiveScan(filter, indexName, result.LastEvaluatedKey);
    return [...items, ...nextItems];
  }

  async put<T extends TItem>(item: T): Promise<T> {
    await this.dynamoDBClient.put({
      TableName: this.tableName,
      Item: marshallDates(item),
    });

    const newModel = await this.get<T>(item.id);

    if (newModel) {
      return newModel;
    }

    return item;
  }

  async delete(id: string): Promise<void> {
    await this.dynamoDBClient.delete({
      TableName: this.tableName,
      Key: { id },
    });
  }

  async batchPut<T extends TItem>(items: T[]): Promise<void> {
    if (items.length === 0) {
      return;
    }

    const batches = this.getBatchWriteBatches(items);

    for (const batch of batches) {
      await this.dynamoDBClient.batchWrite({
        RequestItems: {
          [this.tableName]: batch.map((item) => ({
            PutRequest: {
              Item: marshallDates(item),
            },
          })),
        },
      });
    }
  }

  async batchDelete(ids: string[]): Promise<void> {
    if (ids.length === 0) {
      return;
    }

    const batches = this.getBatchWriteBatches(ids);

    for (const batch of batches) {
      await this.dynamoDBClient.batchWrite({
        RequestItems: {
          [this.tableName]: batch.map((id) => ({
            DeleteRequest: {
              Key: { id },
            },
          })),
        },
      });
    }
  }

  private getBatchWriteBatches<T>(items: T[]): T[][] {
    if (items.length <= maxBatchWriteItems) {
      return [items];
    }

    let batches: T[][] = [];
    for (let i = 0; i < items.length; i += maxBatchWriteItems) {
      batches = [...batches, items.slice(i, i + maxBatchWriteItems)];
    }

    return batches;
  }

  private createScanCommandInput(
    filter: Record<string, any>,
    indexName?: string,
    exclusiveStartKey?: Record<string, any>,
  ): ScanCommandInput {
    if (Object.keys(filter).length === 0) {
      return {
        TableName: this.tableName,
      };
    }

    const { expressions, ...input } = this.createCommandInput(filter);

    return {
      TableName: this.tableName,
      IndexName: indexName,
      FilterExpression: `${expressions.join(' and ')}`,
      ExclusiveStartKey: exclusiveStartKey,
      ...input,
    };
  }

  private createQueryCommandInput(
    query: Record<string, any>,
    filter: Record<string, any> = {},
    indexName?: string,
    exclusiveStartKey?: Record<string, any>,
  ): QueryCommandInput {
    if (Object.keys(query).length === 0) {
      throw new Error('Cannot create query command input without a query');
    }

    const { expressions: queryExpressions, ...input } = this.createCommandInput(query);

    const queryCommandInput: QueryCommandInput = {
      TableName: this.tableName,
      IndexName: indexName,
      KeyConditionExpression: queryExpressions.join(' and '),
      ExclusiveStartKey: exclusiveStartKey,
      ...input,
    };

    if (Object.keys(filter).length === 0) {
      return queryCommandInput;
    }

    const {
      expressions: filterExpressions,
      ExpressionAttributeNames: filterNames,
      ExpressionAttributeValues: filterValues,
    } = this.createCommandInput(filter);

    return {
      ...queryCommandInput,
      FilterExpression: filterExpressions.join(' and '),
      ExpressionAttributeNames: { ...queryCommandInput.ExpressionAttributeNames, ...filterNames },
      ExpressionAttributeValues: {
        ...queryCommandInput.ExpressionAttributeValues,
        ...filterValues,
      },
    };
  }

  private createCommandInput(item: Record<string, any>): TCommandInput {
    const expressions: string[] = [];
    const ExpressionAttributeValues: Record<string, any> = {};
    const ExpressionAttributeNames: Record<string, string> = {};

    for (const key in item) {
      const value = item[key];
      if (!item.hasOwnProperty(key) || value === undefined || value === null) {
        continue;
      }

      const placeholder = `:p${key}`;
      const alias = `#a${key}`;
      expressions.push(`${alias} = ${placeholder}`);
      ExpressionAttributeNames[alias] = key;
      ExpressionAttributeValues[placeholder] = item[key];
    }

    return {
      expressions,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
    };
  }
}
