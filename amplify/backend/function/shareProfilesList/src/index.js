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
  //const userId = "noamatch"
  console.log(userId);
  const sharedDetails = await getSharedDetails(userId);
  try{
    const {profilesList} = sharedDetails;
    let uniqueArray = [...new Set(profilesList)];
    const list = [];
    for(const profile of uniqueArray){
      let profile_ = await getProfile(profile);
      let {dateOfBirth} = profile_;
      profile_.age = calculateAge(dateOfBirth);
      //let updatedJsonString = JSON.stringify(profile_);
      list.push(profile_);
    }
    return {
      statusCode: 200,
      // Uncomment below to enable CORS requests
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*"
      },
      body: JSON.stringify({res: list})
    };
  } catch (err) {
    return {
      statusCode: 200,
      // Uncomment below to enable CORS requests
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*"
      },
      body: JSON.stringify({res: {}})
    };
  }


};


async function getSharedDetails(profileId) {
  console.log(profileId);
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
    console.error('Error retrieving profile:', err);
    throw err; // Rethrow the error to be caught by the caller
  }
}

async function getProfile(userId) {
  console.log(userId);
  const params = {
    TableName: 'profiles-staging', // Replace 'YourTableName' with your actual table name
    Key: {
      'profileId': userId
    }
  };

  try {
    const data = await ddbDocClient.send(new GetCommand(params));
    console.log(data.Item);
    return data.Item; // Return the retrieved item
  } catch (err) {
    console.error('Error getProfile:', err);
    throw err; // Rethrow the error to be caught by the caller
  }
}

function calculateAge(birthDate) {
  const today = new Date();
  const birthDateObj = new Date(birthDate);
  let age = today.getFullYear() - birthDateObj.getFullYear();
  const monthDiff = today.getMonth() - birthDateObj.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
    age--;
  }
  return age;
}