import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as ddb from 'aws-cdk-lib/aws-dynamodb';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

const SYSTEM_NAME = 'einoji';
const ENV_NAME = 'dev';

const USER_POOL_CLIENTID = process.env.USER_POOL_CLIENTID!;

export class EinojiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const userPool = new cognito.UserPool(this, 'UserPool', {
      userPoolName: `${SYSTEM_NAME}-${ENV_NAME}-user-pool`,
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
      },
      autoVerify: {
        email: true,
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: true,
      },
    });

    const userPoolClient = new cognito.UserPoolClient(this, 'UserPoolClient', {
      userPool,
      generateSecret: false,
      authFlows: { userPassword: true },
    });

    new cdk.CfnOutput(this, 'UserPoolClientId', {
      value: userPoolClient.userPoolClientId,
    });

    const tasksTable = new ddb.Table(this, 'TasksTable', {
      tableName: `${SYSTEM_NAME}-${ENV_NAME}-tasks-table`,
      partitionKey: { name: 'userId', type: ddb.AttributeType.STRING },
      sortKey: { name: 'taskId', type: ddb.AttributeType.STRING },
    });

    const createTaskFn = new NodejsFunction(this, 'CreateTaskFn', {
      functionName: `${SYSTEM_NAME}-${ENV_NAME}-create-task-fn`,
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: '../functions/src/handlers/tasks/create-task-handler.ts',
      handler: 'handler',
      environment: {
        TASKS_TABLE_NAME: tasksTable.tableName,
      },
    });
    tasksTable.grantReadWriteData(createTaskFn);

    const getTaskFn = new NodejsFunction(this, 'GetTaskFn', {
      functionName: `${SYSTEM_NAME}-${ENV_NAME}-get-task-fn`,
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: '../functions/src/handlers/tasks/get-task-handler.ts',
      handler: 'handler',
      environment: {
        TASKS_TABLE_NAME: tasksTable.tableName,
      },
    });
    tasksTable.grantReadData(getTaskFn);

    const updateTaskFn = new NodejsFunction(this, 'UpdateTaskFn', {
      functionName: `${SYSTEM_NAME}-${ENV_NAME}-update-task-fn`,
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: '../functions/src/handlers/tasks/update-task-handler.ts',
      handler: 'handler',
      environment: {
        TASKS_TABLE_NAME: tasksTable.tableName,
      },
    });
    tasksTable.grantReadWriteData(updateTaskFn);

    const deleteTaskFn = new NodejsFunction(this, 'DeleteTaskFn', {
      functionName: `${SYSTEM_NAME}-${ENV_NAME}-delete-task-fn`,
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: '../functions/src/handlers/tasks/delete-task-handler.ts',
      handler: 'handler',
      environment: {
        TASKS_TABLE_NAME: tasksTable.tableName,
      },
    });
    tasksTable.grantReadWriteData(deleteTaskFn);

    const createUserFn = new NodejsFunction(this, 'CreateUserFn', {
      functionName: `${SYSTEM_NAME}-${ENV_NAME}-create-user-fn`,
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: '../functions/src/handlers/users/create-user-handler.ts',
      handler: 'handler',
      environment: {
        USER_POOL_CLIENTID: USER_POOL_CLIENTID,
      },
    });

    const authUserFn = new NodejsFunction(this, 'AuthUserFn', {
      functionName: `${SYSTEM_NAME}-${ENV_NAME}-auth-user-fn`,
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: '../functions/src/handlers/users/auth-user-handler.ts',
      handler: 'handler',
      environment: {
        USER_POOL_CLIENTID: USER_POOL_CLIENTID,
      },
    });

    const api = new apigw.RestApi(this, 'TaskApiGw', {
      restApiName: `${SYSTEM_NAME}-${ENV_NAME}-task-api`,
      description: 'Task API',
      deploy: true,
    });

    const authorizer = new apigw.CognitoUserPoolsAuthorizer(
      this,
      'UserPoolAuthorizer',
      {
        cognitoUserPools: [userPool],
        identitySource: 'method.request.header.Authorization',
      },
    );

    const tasksResource = api.root.addResource('tasks');
    const singleTaskResource = tasksResource.addResource('{id}');

    tasksResource.addMethod('POST', new apigw.LambdaIntegration(createTaskFn));
    singleTaskResource.addMethod(
      'GET',
      new apigw.LambdaIntegration(getTaskFn),
      {
        authorizer: authorizer,
      },
    );
    singleTaskResource.addMethod(
      'PUT',
      new apigw.LambdaIntegration(updateTaskFn),
    );
    singleTaskResource.addMethod(
      'DELETE',
      new apigw.LambdaIntegration(deleteTaskFn),
    );

    const usersResource = api.root.addResource('users');
    usersResource.addMethod('POST', new apigw.LambdaIntegration(createUserFn));

    const authResource = usersResource.addResource('auth');
    authResource.addMethod('POST', new apigw.LambdaIntegration(authUserFn));
  }
}
