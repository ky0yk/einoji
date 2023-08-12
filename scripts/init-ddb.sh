#!/bin/bash

TABLE_NAME="Task"
ENDPOINT_URL="http://localhost:8000"

# DynamoDB Localが起動するまで待つ
echo "Waiting for DynamoDB Local to start..."
until aws dynamodb list-tables --endpoint-url $ENDPOINT_URL > /dev/null 2>&1; do
    sleep 1
done
echo "DynamoDB Local started."

# テーブルが存在するかチェック
TABLE_EXISTS=$(aws dynamodb describe-table --table-name $TABLE_NAME --endpoint-url $ENDPOINT_URL 2>/dev/null)

# テーブルが存在しない場合のみ作成
if [ -z "$TABLE_EXISTS" ]; then
  aws dynamodb create-table \
      --table-name $TABLE_NAME \
      --attribute-definitions AttributeName=userId,AttributeType=S AttributeName=taskId,AttributeType=S \
      --key-schema AttributeName=userId,KeyType=HASH AttributeName=taskId,KeyType=RANGE \
      --billing-mode PAY_PER_REQUEST \
      --endpoint-url $ENDPOINT_URL
fi

# サンプルデータが存在するかチェック
ITEM_EXISTS=$(awslocal dynamodb get-item --table-name $TABLE_NAME --key '{"userId": {"S": "1a7244c5-06d3-f7e2-560e-f0b5534c8246"}, "taskId": {"S": "ab35fd93-ff35-e366-8340-1b2716b5945e"}}' 2>/dev/null)

# サンプルデータが存在しない場合のみ挿入
if [ -z "$ITEM_EXISTS" ]; then
  aws dynamodb put-item \
      --table-name $TABLE_NAME \
      --item '{
          "userId": {"S": "1a7244c5-06d3-f7e2-560e-f0b5534c8246"},
          "taskId": {"S": "ab35fd93-ff35-e366-8340-1b2716b5945e"},
          "title": {"S": "本を読む"},
          "completed": {"BOOL": false},
          "description": {"S": "技術書を1章読む"},
          "createdAt": {"S": "2021-08-22T14:24:02.071Z"},
          "updatedAt": {"S": "2021-08-22T14:24:02.071Z"}
      }' \
      --endpoint-url $ENDPOINT_URL
fi
