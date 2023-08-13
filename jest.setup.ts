// jest.setup.ts
process.env.TASKS_TABLE_NAME = 'Tasks';
process.env.AWS_REGION = 'local';
process.env.DYNAMODB_ENDPOINT = 'http://localhost:8000';
