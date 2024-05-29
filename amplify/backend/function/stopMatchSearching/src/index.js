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
// Import the AWS SDK
const AWS = require('aws-sdk');

// Set the region
AWS.config.update({region: 'us-east-1'});

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

  const profile = await getProfile(userId);

  await setProfile(profile['profileId'], profile['attraction'], profile['dateOfBirth'], profile['gender']
      , profile['location'], profile['phone'], profile['profilePicFile'], profile['social'], Date.now());

  return {
    statusCode: 200,
    // Uncomment below to enable CORS requests
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*"
    },
    body: JSON.stringify({status : 'success'})
  };
};


async function getProfile(userId) {
  const params = {
    TableName: 'profiles-staging', // Replace 'YourTableName' with your actual table name
    Key: {
      'profileId': userId
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


async function setProfile(profileId,attraction,dateOfBirth,gender,location,phone,profilePicFile,social,timestamp) {
  const params = {
    TableName: 'profiles-staging',
    Item: {
      'profileId': profileId,
      'attraction': attraction,
      'dateOfBirth': dateOfBirth,
      'gender': gender,
      'location': location,
      'phone' : phone,
      'profilePicFile' : profilePicFile,
      'social': social,
      'quit_sqs_timestamp':timestamp
    }
  };

  try {
    await ddbDocClient.send(new PutCommand(params));
  } catch (err) {
    console.error('Error retrieving profile:', err);
    throw err; // Rethrow the error to be caught by the caller
  }
}

