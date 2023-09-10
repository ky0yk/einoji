import {
  DynamoDBClient,
  CreateTableCommand,
  DeleteTableCommand,
} from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';
import { TaskItem } from '../../src/infrastructure/ddb/schemas/taskItem';

const TABLE_NAME = process.env.TASKS_TABLE_NAME;
const REGION = process.env.AWS_REGION;
const DYNAMODB_ENDPOINT = process.env.DYNAMODB_ENDPOINT;

const localDynamoDB = new DynamoDBClient({
  endpoint: DYNAMODB_ENDPOINT,
  region: REGION,
});
const ddbDocClient = DynamoDBDocumentClient.from(localDynamoDB);

export const putTask = async (item: TaskItem): Promise<void> => {
  const putCommand = new PutCommand({
    TableName: TABLE_NAME,
    Item: item,
  });
  await ddbDocClient.send(putCommand);
};

export const deleteTask = async (sortKey: string): Promise<void> => {
  const deleteCommand = new DeleteCommand({
    TableName: TABLE_NAME,
    Key: {
      userId: '1a7244c5-06d3-47e2-560e-f0b5534c8246',
      taskId: sortKey,
    },
  });
  await ddbDocClient.send(deleteCommand);
};

export const createTable = async (): Promise<void> => {
  const createTableCommand = new CreateTableCommand({
    TableName: TABLE_NAME,
    AttributeDefinitions: [
      {
        AttributeName: 'userId',
        AttributeType: 'S',
      },
      {
        AttributeName: 'taskId',
        AttributeType: 'S',
      },
    ],
    KeySchema: [
      {
        AttributeName: 'userId',
        KeyType: 'HASH',
      },
      {
        AttributeName: 'taskId',
        KeyType: 'RANGE',
      },
    ],
    BillingMode: 'PAY_PER_REQUEST',
  });
  await localDynamoDB.send(createTableCommand);
};

export const deleteTable = async (): Promise<void> => {
  await localDynamoDB.send(new DeleteTableCommand({ TableName: TABLE_NAME }));
};
