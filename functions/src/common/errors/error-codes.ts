import { HttpStatus } from '../../handlers/http/http-status';

export enum ErrorCode {
  // アプリケーション例外（回復可）
  INVALID_PAYLOAD = 'APP001', // リクエストペイロードが不完全または不正
  TASK_NOT_FOUND = 'APP002', // 存在しないTODOのIDでの操作
  INVALID_QUERY_PARAMETER = 'APP003', // クエリパラメータが不足または不正

  // アプリケーション例外（回復不可）
  MALFORMED_DATA = 'APP101', // データの破損または予期しないデータ形式

  // システム例外
  DATABASE_CONNECTION_ERROR = 'SYS001', // データベース接続エラー（DynamoDBへの接続障害）
  SERVICE_DOWNTIME = 'SYS002', // APIサービスダウンタイム (API GatewayやLambdaのダウンタイム)
  EXTERNAL_SERVICE_FAILURE = 'SYS003', // 外部サービスの障害
  LAMBDA_TIMEOUT = 'SYS004', // Lambdaのタイムアウト
  UNKNOWN_ERROR = 'SYS999', // 予期しないエラー
}

export const errorCodetoStatus = (errorCode: ErrorCode): HttpStatus => {
  switch (errorCode) {
    case ErrorCode.INVALID_PAYLOAD:
    case ErrorCode.INVALID_QUERY_PARAMETER:
      return HttpStatus.BAD_REQUEST;

    case ErrorCode.TASK_NOT_FOUND:
      return HttpStatus.NOT_FOUND;

    case ErrorCode.MALFORMED_DATA:
    case ErrorCode.DATABASE_CONNECTION_ERROR:
    case ErrorCode.LAMBDA_TIMEOUT:
    case ErrorCode.UNKNOWN_ERROR:
      return HttpStatus.INTERNAL_SERVER_ERROR;

    case ErrorCode.SERVICE_DOWNTIME:
    case ErrorCode.EXTERNAL_SERVICE_FAILURE:
      return HttpStatus.SERVICE_UNAVAILABLE;

    default: {
      const exhaustiveCheck: never = errorCode;
      return exhaustiveCheck;
    }
  }
};
