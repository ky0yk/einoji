import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as ddb from 'aws-cdk-lib/aws-dynamodb';
import * as apigw from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';

import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

export class EinojiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const taskTable = new ddb.Table(this, 'TaskTable', {
      tableName: 'tasks-table',
      partitionKey: { name: 'userId', type: ddb.AttributeType.STRING },
      sortKey: { name: 'taskId', type: ddb.AttributeType.STRING },
    });

    const getTask = new NodejsFunction(this, 'GetTaskFn', {
      functionName: 'get-task-fn',
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: '../functions/src/handlers/create-task-handler.ts',
      handler: 'handler',
    });
    taskTable.grantReadData(getTask);

    const api = new apigw.HttpApi(this, 'TaskApiGw');
    api.addRoutes({
      path: '/tasks/{taskId}',
      methods: [apigw.HttpMethod.GET],
      integration: new HttpLambdaIntegration('GetTaskItg', getTask),
    });
  }
}
