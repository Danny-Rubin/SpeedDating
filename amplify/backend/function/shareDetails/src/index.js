const awsServerlessExpress = require('aws-serverless-express');
const app = require('./app');
const {DynamoDBClient} = require('@aws-sdk/client-dynamodb');
const {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  ScanCommand
} = require('@aws-sdk/lib-dynamodb');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const bodyParser = require('body-parser')
const express = require('express')
const jwt = require('jsonwebtoken');
const ddbClient = new DynamoDBClient({region: process.env.TABLE_REGION});
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
const apiHandler = require('./apiHandler.js');

// Import the AWS SDK
const AWS = require('aws-sdk');

// Set the region
AWS.config.update({region: 'us-east-1'});
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
  console.log(token);
  const userId = jwt.decode(token).username;
  //const userId = "user2"
  console.log(userId);
  const meetingId = event.pathParameters.meetingId;
  //const meetingId = "12345"
  console.log(meetingId);
  const meeting = await getMeeting(meetingId);
  console.log(meeting);
  const {user1, user2} = meeting
  console.log(`: ${user1}`);
  console.log(`: ${user2}`);
  //const user1 = meeting["user1"];
  //const user2 = meeting["user2"];
  if (userId !== user1 && userId !== user2) {
    console.log(4);
    return {
      statusCode: 403,
      // Uncomment below to enable CORS requests
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*"
      }
    };
  }
  if (userId == user1){
    const sharedDetails = await getSharedDetails(user2);
    console.log(sharedDetails)
    try {
      const list = sharedDetails["profilesList"]
      list.push(user1);
      const res = await addSharedDetails(user2, list)
    } catch (err){
      const list = [user1];
      const res = await addSharedDetails(user2, list)
    }
    return {
      statusCode: 200,
      // Uncomment below to enable CORS requests
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*"
      }
    };
  }
  if (userId == user2){
    const sharedDetails = await getSharedDetails(user1);
    console.log(sharedDetails)
    try {
      const list = sharedDetails["profilesList"]
      list.push(user2);
      const res = await addSharedDetails(user1, list)
    } catch (err){
      const list = [user2];
      const res = await addSharedDetails(user1, list)
    }
    return {
      statusCode: 200,
      // Uncomment below to enable CORS requests
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*"
      }
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
    console.error('Error retrieving getMeeting:', err);
    throw err; // Rethrow the error to be caught by the caller
  }
}

async function getSharedDetails(profileId) {
  const params = {
    TableName: 'sharedDetails-staging', // Replace 'YourTableName' with your actual table name
    Key: {
      'profileId': profileId,
    }
  };

  try {
    const data = await ddbDocClient.send(new GetCommand(params));
    return data.Item; // Return the retrieved item
  } catch (err) {
    console.error('Error retrieving getSharedDetails:', err);
    throw err; // Rethrow the error to be caught by the caller
  }
}

async function addSharedDetails(profileId, profilesList) {
  const params = {
    TableName: 'sharedDetails-staging',
    Item: {
      'profileId': profileId,
      'profilesList': profilesList
    }
  };

  try {
    await ddbDocClient.send(new PutCommand(params));
  } catch (err) {
    console.error('Error addSharedDetails:', err);
    throw err; // Rethrow the error to be caught by the caller
  }
}