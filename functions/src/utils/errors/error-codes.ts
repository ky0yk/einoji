import { HttpStatus } from '../../handlers/base/http/http-status';

export enum ErrorCode {
  // リクエスト例外
  INVALID_PAYLOAD_FORMAT = 'REQ001', // リクエストペイロードが不完全または不正
  INVALID_PAYLOAD_VALUE = 'REQ002', // リクエストペイロードがの値が不正
  INVALID_QUERY_PARAMETER = 'REQ003', // クエリパラメータが不足または不正
  INVALID_PATH_PARAMETER = 'REQ004', // パスパラメータが不足または不正

  // アプリケーション例外（回復可）
  TASK_NOT_FOUND = 'APP001', // 存在しないTODOのIDでの操作
  TASK_UPDATE_RULE_ERROR = 'APP002', // TODOの更新ルール違反

  // アプリケーション例外（回復不可） 必要になったらAPP101から始める

  // システム例外
  DATABASE_CONNECTION_ERROR = 'SYS001', // データベース接続エラー（DynamoDBへの接続障害）
  SERVICE_DOWNTIME = 'SYS002', // APIサービスダウンタイム (API GatewayやLambdaのダウンタイム)
  EXTERNAL_SERVICE_FAILURE = 'SYS003', // 外部サービスの障害
  UNKNOWN_ERROR = 'SYS999', // 予期しないエラー
}

export const errorCodetoStatus = (errorCode: ErrorCode): HttpStatus => {
  switch (errorCode) {
    case ErrorCode.INVALID_PAYLOAD_FORMAT:
    case ErrorCode.INVALID_QUERY_PARAMETER:
    case ErrorCode.INVALID_PATH_PARAMETER:
      return HttpStatus.BAD_REQUEST;

    case ErrorCode.INVALID_PAYLOAD_VALUE:
    case ErrorCode.TASK_UPDATE_RULE_ERROR:
      return HttpStatus.UNPROCESSABLE_ENTITY;

    case ErrorCode.TASK_NOT_FOUND:
      return HttpStatus.NOT_FOUND;

    case ErrorCode.DATABASE_CONNECTION_ERROR:
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
