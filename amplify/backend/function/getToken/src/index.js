
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
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);

    const token = event.headers.Authorization.substring(7);
    console.log(token);
    const userId = jwt.decode(token).username;
    console.log(userId);
    const meetingId = event.pathParameters.meetingId;
    console.log(meetingId);
    const meeting = await getMeeting(meetingId);
    console.log(meeting);
    console.log(meeting["user1"]);
    console.log(meeting["user2"]);
    if (userId !== meeting["user1"] && userId !== meeting["user2"]) {
        return {
            statusCode: 403,
            // Uncomment below to enable CORS requests
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"
            }
        };
    }
    if (meeting["user2"] == null) {
        return {
            statusCode: 200,
            // Uncomment below to enable CORS requests
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"
            },
            body: JSON.stringify({hasMatch: false, token: ""})
        };
    } else {
        const token = apiHandler.generateUserToken(meetingId, userId);
        const user1 = meeting["user1"];
        const user2 = meeting["user2"];
        const other = userId == user1 ? user2 : user1;
        return {
            statusCode: 200,
            // Uncomment below to enable CORS requests
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"
            },
            body: JSON.stringify({hasMatch: true, token: token, otherUser: other})
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


async function setMeeting(session_id, user1, timestamp, user2 = null) {
    const params = {
        TableName: 'matches-staging',
        Item: {
            'session_id': session_id,
            'user1': user1,
            'user2': user2,
            'generation_timestamp': timestamp,
            'is_active': true,
            'user1WantsToExtendMeeting' : false,
            'user2WantsToExtendMeeting' : false
        }
    };

    try {
        await ddbDocClient.send(new PutCommand(params));
    } catch (err) {
        console.error('Error retrieving profile:', err);
        throw err; // Rethrow the error to be caught by the caller
    }
}

