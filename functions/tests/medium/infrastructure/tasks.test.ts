import {
  DynamoDBClient,
  CreateTableCommand,
  DeleteTableCommand,
} from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { fetchTaskById } from '../../../src/infrastructure/ddb/tasks';
import { TaskRecord } from '../../../src/domain/taskRecord';

const TABLE_NAME = process.env.TASKS_TABLE_NAME;

describe('fetchTaskById', () => {
  const localDynamoDB = new DynamoDBClient({
    endpoint: 'http://localhost:8000',
    region: 'local',
  });
  const ddbDocClient = DynamoDBDocumentClient.from(localDynamoDB);

  const dummyTaskRecord: TaskRecord = {
    userId: '1a7244c5-06d3-47e2-560e-f0b5534c8246',
    taskId: 'f0f8f5a0-309d-11ec-8d3d-0242ac130003',
    title: 'スーパーに買い物に行く',
    completed: false,
    description: '牛乳と卵を買う',
    createdAt: '2021-06-22T14:24:02.071Z',
    updatedAt: '2021-06-22T14:24:02.071Z',
  };

  beforeAll(async () => {
    // テーブル作成
    const createTableCommand = new CreateTableCommand({
      TableName: TABLE_NAME,
      KeySchema: [
        { AttributeName: 'userId', KeyType: 'HASH' },
        { AttributeName: 'taskId', KeyType: 'RANGE' },
      ],
      AttributeDefinitions: [
        { AttributeName: 'userId', AttributeType: 'S' },
        { AttributeName: 'taskId', AttributeType: 'S' },
      ],
      // ローカルでテストするために必要な設定
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
      },
    });
    await localDynamoDB.send(createTableCommand);

    // ダミーデータ挿入
    const putCommand = new PutCommand({
      TableName: TABLE_NAME,
      Item: dummyTaskRecord,
    });
    await ddbDocClient.send(putCommand);
  });
  afterAll(async () => {
    // テーブル削除
    await localDynamoDB.send(new DeleteTableCommand({ TableName: TABLE_NAME }));
  });

  it('should return the dummy task record by task ID', async () => {
    const taskRecord = await fetchTaskById(dummyTaskRecord.taskId);

    expect(taskRecord).toEqual(dummyTaskRecord);
  });
});
