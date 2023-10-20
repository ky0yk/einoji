import { HttpStatus } from '../../handlers/base/http/http-status';

export enum ErrorCode {
  // リクエスト例外
  INVALID_PAYLOAD_FORMAT = 'REQ001', // リクエストペイロードが不完全または不正
  INVALID_PAYLOAD_VALUE = 'REQ002', // リクエストペイロードがの値が不正
  INVALID_QUERY_PARAMETER = 'REQ003', // クエリパラメータが不足または不正
  INVALID_PATH_PARAMETER = 'REQ004', // パスパラメータが不足または不正

  // アプリケーション例外（回復可）
  TASK_NOT_FOUND = 'APP001', // 存在しないTASKのIDでの操作
  TASK_UPDATE_RULE_ERROR = 'APP002', // TASKの更新ルール違反

  // アプリケーション例外（回復不可） 必要になったらAPP101から始める

  // ユーザーに関する例外（回復可）
  INVALID_CREDENTIALS = 'USER001', // ユーザー認証情報が不正
  USER_NOT_FOUND = 'USER002', // ユーザーが存在しない
  INVALID_PASSWORD_FORMAT = 'USER003', // パスワードの形式が不正
  INVALID_EMAIL_FORMAT = 'USER004', // Eメールの形式が不正
  USER_EMAIL_EXISTS = 'USER005', // メールアドレスが既に存在する
  USER_NOT_CONFIRMED = 'USER006', // ユーザーが未確認

  // ユーザーに関する例外（回復不可） 必要になったらUSER101から始める

  // システム例外
  EXTERNAL_SERVICE_FAILURE = 'SYS001', // 外部サービスの障害
  UNKNOWN_ERROR = 'SYS999', // 予期しないエラー
}

export const errorCodetoStatus = (errorCode: ErrorCode): HttpStatus => {
  switch (errorCode) {
    case ErrorCode.INVALID_PAYLOAD_FORMAT:
    case ErrorCode.INVALID_QUERY_PARAMETER:
    case ErrorCode.INVALID_PATH_PARAMETER:
      return HttpStatus.BAD_REQUEST;

    case ErrorCode.INVALID_CREDENTIALS:
      return HttpStatus.UNAUTHORIZED;

    case ErrorCode.USER_NOT_CONFIRMED:
      return HttpStatus.FORBIDDEN;

    case ErrorCode.TASK_NOT_FOUND:
    case ErrorCode.USER_NOT_FOUND:
      return HttpStatus.NOT_FOUND;

    case ErrorCode.USER_EMAIL_EXISTS:
      return HttpStatus.CONFLICT;

    case ErrorCode.INVALID_PAYLOAD_VALUE:
    case ErrorCode.TASK_UPDATE_RULE_ERROR:
    case ErrorCode.INVALID_PASSWORD_FORMAT:
    case ErrorCode.INVALID_EMAIL_FORMAT:
      return HttpStatus.UNPROCESSABLE_ENTITY;

    case ErrorCode.UNKNOWN_ERROR:
      return HttpStatus.INTERNAL_SERVER_ERROR;

    case ErrorCode.EXTERNAL_SERVICE_FAILURE:
      return HttpStatus.SERVICE_UNAVAILABLE;

    default: {
      const exhaustiveCheck: never = errorCode;
      return exhaustiveCheck;
    }
  }
};
