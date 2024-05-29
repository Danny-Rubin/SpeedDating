const {DynamoDBClient} = require('@aws-sdk/client-dynamodb');
const {
    DeleteCommand,
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    QueryCommand,
    ScanCommand
} = require('@aws-sdk/lib-dynamodb');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const bodyParser = require('body-parser');
const express = require('express');
const jwt = require('jsonwebtoken');
const ddbClient = new DynamoDBClient({region: process.env.TABLE_REGION});
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
const apiHandler = require('./apiHandler.js');

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */


const awsServerlessExpress = require('aws-serverless-express');
const app = require('./app');

/**
 * @type {import('http').Server}
 */
const server = awsServerlessExpress.createServer(app);

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  const token = event.headers.Authorization.substring(7);
  const userId = jwt.decode(token).username;
  const meetingId = event.pathParameters.meetingId;
  const meeting = await getMeeting(meetingId);

  if (userId !== meeting["user1"] && userId !== meeting["user2"]) {
      return {
          statusCode: 401,
          // Uncomment below to enable CORS requests
          headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Headers": "*"
          }
      };
  }
  if ( meeting["user1WantsToExtendMeeting"] && meeting["user2WantsToExtendMeeting"] ) {
      return {
          statusCode: 200,
          // Uncomment below to enable CORS requests
          headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Headers": "*"
          },
          body: JSON.stringify({mutualConsent:true})
      };
  } else {
      return {
          statusCode: 200,
          // Uncomment below to enable CORS requests
          headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Headers": "*"
          },
          body: JSON.stringify({mutualConsent:false})
      };
  }
};


async function getMeeting(session_id) {
  const params = {
      TableName: 'matches-staging', // Replace 'YourTableName' with your actual table name
      Key: {
          'session_id': session_id
      }
  };

  try {
      const data = await ddbDocClient.send(new GetCommand(params));
      return data.Item; // Return the retrieved item
  } catch (err) {
      console.error('Error retrieving profile:', err);
      throw err; // Rethrow the error to be caught by the caller
  }
}


async function setMeeting(session_id,user1,user2,timestamp,user1WantsToExtendMeeting,user2WantsToExtendMeeting) {
  const params = {
      TableName: 'matches-staging',
      Item: {
          'session_id': session_id,
          'user1': user1,
          'user2': user2,
          'generation_timestamp': timestamp,
          'is_active': true,
          'user1WantsToExtendMeeting' : user1WantsToExtendMeeting,
          'user2WantsToExtendMeeting' : user2WantsToExtendMeeting
      }
  };

  try {
      await ddbDocClient.send(new PutCommand(params));
  } catch (err) {
      console.error('Error retrieving profile:', err);
      throw err; // Rethrow the error to be caught by the caller
  }
}

