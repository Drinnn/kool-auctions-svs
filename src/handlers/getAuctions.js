import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
import errors from 'http-errors';

const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function getAuctions(event, context) {
  const { status } = event.queryStringParameters;
  let auctions;

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    IndexName: 'statusAndEndDate',
    KeyConditionExpression: '#status = :status',
    ExpressionAttributeValues: {
      ':status': status,
    },
    ExpressionAttributeNames: {
      '#status': 'status',
    },
  };

  try {
    const result = await dynamoDB.query(params).promise();

    auctions = result.Items;
  } catch (err) {
    console.err(err);
    throw new errors.InternalServerError(err);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(auctions),
  };
}

export const handler = commonMiddleware(getAuctions);
