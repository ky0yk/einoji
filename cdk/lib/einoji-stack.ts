import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as ddb from 'aws-cdk-lib/aws-dynamodb';
import * as apigw from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';

import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

const SYSTEM_NAME = 'einoji';
const ENV_NAME = 'dev';

export class EinojiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const tasksTable = new ddb.Table(this, 'TasksTable', {
      tableName: `${SYSTEM_NAME}-${ENV_NAME}-tasks-table`,
      partitionKey: { name: 'userId', type: ddb.AttributeType.STRING },
      sortKey: { name: 'taskId', type: ddb.AttributeType.STRING },
    });

    const createTaskFn = new NodejsFunction(this, 'CreateTaskFn', {
      functionName: `${SYSTEM_NAME}-${ENV_NAME}-create-task-fn`,
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: '../functions/src/handlers/create-task-handler.ts',
      handler: 'handler',
      environment: {
        TASKS_TABLE_NAME: tasksTable.tableName,
      },
    });
    tasksTable.grantReadWriteData(createTaskFn);

    const getTaskFn = new NodejsFunction(this, 'GetTaskFn', {
      functionName: `${SYSTEM_NAME}-${ENV_NAME}-get-task-fn`,
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: '../functions/src/handlers/get-task-handler.ts',
      handler: 'handler',
      environment: {
        TASKS_TABLE_NAME: tasksTable.tableName,
      },
    });
    tasksTable.grantReadData(getTaskFn);

    const updateTaskFn = new NodejsFunction(this, 'UpdateTaskFn', {
      functionName: `${SYSTEM_NAME}-${ENV_NAME}-update-task-fn`,
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: '../functions/src/handlers/update-task-handler.ts',
      handler: 'handler',
      environment: {
        TASKS_TABLE_NAME: tasksTable.tableName,
      },
    });
    tasksTable.grantReadWriteData(updateTaskFn);

    const deleteTaskFn = new NodejsFunction(this, 'DeleteTaskFn', {
      functionName: `${SYSTEM_NAME}-${ENV_NAME}-delete-task-fn`,
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: '../functions/src/handlers/delete-task-handler.ts',
      handler: 'handler',
      environment: {
        TASKS_TABLE_NAME: tasksTable.tableName,
      },
    });
    tasksTable.grantReadWriteData(deleteTaskFn);

    const api = new apigw.HttpApi(this, 'TaskApiGw', {
      apiName: `${SYSTEM_NAME}-${ENV_NAME}-task-api`,
    });
    api.addRoutes({
      path: '/tasks',
      methods: [apigw.HttpMethod.POST],
      integration: new HttpLambdaIntegration('CreateTaskItg', createTaskFn),
    });
    api.addRoutes({
      path: '/tasks/{id}',
      methods: [apigw.HttpMethod.GET],
      integration: new HttpLambdaIntegration('GetTaskItg', getTaskFn),
    });
    api.addRoutes({
      path: '/tasks/{id}',
      methods: [apigw.HttpMethod.PUT],
      integration: new HttpLambdaIntegration('UpdateTaskItg', updateTaskFn),
    });
    api.addRoutes({
      path: '/tasks/{id}',
      methods: [apigw.HttpMethod.DELETE],
      integration: new HttpLambdaIntegration('DeleteTaskItg', deleteTaskFn),
    });
  }
}