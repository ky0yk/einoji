// export enum ErrorCode {
//   DDB_RESOURCE_NOT_FOUND = 'DDB_RESOURCE_NOT_FOUND',
//   DDB_THROUGHPUT_EXCEEDED = 'DDB_THROUGHPUT_EXCEEDED',
//   DDB_VALIDATION_ERROR = 'DDB_VALIDATION_ERROR',
//   DDB_INTERNAL_SERVER_ERROR = 'DDB_INTERNAL_SERVER_ERROR',
//   TASK_NOT_FOUND = 'TASK_NOT_FOUND',
//   TASK_CONVERSION_ERROR = 'TASK_CONVERSION_ERROR',
//   TASK_UNKNOWN_ERROR = 'TASK_UNKNOWN_ERROR',
//   UNKNOWN_ERROR = 'UNKNOWN_ERROR',
//   INVALID_REQUEST = 'INVALID_REQUEST',
// }

export enum ErrorCode {
  // システム例外
  DATABASE_CONNECTION_ERROR = 'SYS001', // データベース接続エラー（DynamoDBへの接続障害）
  SERVICE_DOWNTIME = 'SYS002', // APIサービスダウンタイム (API GatewayやLambdaのダウンタイム)
  EXTERNAL_SERVICE_FAILURE = 'SYS003', // 外部サービスの障害
  LAMBDA_TIMEOUT = 'SYS004', // Lambdaのタイムアウト
  UNKNOWN_ERROR = 'SYS999', // 予期しないエラー

  // アプリケーション例外（回復不可）
  MALFORMED_DATA = 'APP001', // データの破損または予期しないデータ形式

  // アプリケーション例外（回復可）
  INVALID_PAYLOAD = 'APP101', // リクエストペイロードが不完全または不正
  TASK_NOT_FOUND = 'APP102', // 存在しないTODOのIDでの操作
  INVALID_QUERY_PARAMETER = 'APP103', // クエリパラメータが不足または不正
}
