/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const {DynamoDBClient} = require('@aws-sdk/client-dynamodb');
const {
    DeleteCommand,
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    UpdateCommand,
    QueryCommand,
    ScanCommand
} = require('@aws-sdk/lib-dynamodb');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const bodyParser = require('body-parser')
const express = require('express')
const jwt = require('jsonwebtoken');
const ddbClient = new DynamoDBClient({region: process.env.TABLE_REGION});
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
const queueMapping = require('./queueMapping.js');
const apiHandler = require('./apiHandler.js');
// Import the AWS SDK
const AWS = require('aws-sdk');

// Set the region
AWS.config.update({region: 'us-east-1'});

// Create an SQS service object
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);

    const token = event.headers.Authorization.substring(7);
    const userId = jwt.decode(token).username;

    if (!userId) {
        return {
            statusCode: 400,
            body: JSON.stringify({message: 'Missing userId in request body'})
        };
    }
    // Print the userId to the console
    console.log("User ID:", userId);

    // Retrieve profile from DynamoDB
    const profile = await getProfile(userId);
    console.log(`user's profile:${profile}`);
    /*
    if (event.body) {
        profile = JSON.parse(event.body);
    } else {
        console.log("No profile data found in the event body.");
        // Handle the case when no profile data is provided
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "No profile data found in the event body." })
        };
    }
    */
    const {location, gender, attraction, dateOfBirth} = profile;


    Object.keys(profile).forEach(key => {
        console.log(`${key}:${profile[key]}`);
    });

    const genderLowerCase = gender.toLowerCase();

    const attractionLowerCase = attraction.toLowerCase();

    const ageRange = determineAgeRange(calculateAge(dateOfBirth));

    const userProfile = `gender_${genderLowerCase}_attraction_${attractionLowerCase}_north_${ageRange}`;
    console.log(userProfile);


    const timestamp = Date.now();
    const useMatchedProfiles = queueMapping[userProfile];
    console.log(useMatchedProfiles)
    if (useMatchedProfiles) {
        for (const matchedProfile of useMatchedProfiles) {
            let keepSearching = true;
            while (keepSearching) {
                console.log(matchedProfile);
                const queueUrl = `https://sqs.us-east-1.amazonaws.com/730335436053/${matchedProfile}.fifo`;
                let receiveMessageParams = {
                    QueueUrl: queueUrl,
                    MaxNumberOfMessages: 1,// Read only one message at a time
                };

                try {
                    const receiveMessageData = await sqs.receiveMessage(receiveMessageParams).promise();
                    // If it returns some message.
                    console.log(receiveMessageData);
                    if (receiveMessageData.Messages && receiveMessageData.Messages.length > 0) {
                        const message = receiveMessageData.Messages[0];
                        console.log("Received message:", message.Body);
                        const messageData = JSON.parse(message.Body);
                        console.log(messageData["session_id"])
                        const deleteMessageParams = {
                            QueueUrl: queueUrl,
                            ReceiptHandle: message.ReceiptHandle
                        };

                        await sqs.deleteMessage(deleteMessageParams).promise();
                        console.log("Message deleted successfully");

                        console.log(messageData["session_id"])
                        const meeting = await getMeeting(messageData["session_id"]);
                        console.log(meeting);
                        console.log(meeting["session_id"]);
                        await deleteMeeting(meeting["session_id"])
                        const user1 = meeting["user1"];
                        const profile1 = await getProfile(user1);
                        try {
                            const {quit_sqs_timestamp} = profile1;
                            const generation_timestamp = messageData["generation_timestamp"]
                            if (quit_sqs_timestamp == null || quit_sqs_timestamp < generation_timestamp) {

                                await setMeeting(meeting["session_id"], meeting["user1"], meeting["generation_timestamp"], userId)

                                return {
                                    statusCode: 200,
                                    // Uncomment below to enable CORS requests
                                    headers: {
                                        "Access-Control-Allow-Origin": "*",
                                        "Access-Control-Allow-Headers": "*"
                                    },
                                    body: JSON.stringify({hasMatch: true, meetingId: meeting["session_id"]})
                                };
                            }
                        } catch (e) {

                            await setMeeting(meeting["session_id"], meeting["user1"], meeting["generation_timestamp"], userId)

                            return {
                                statusCode: 200,
                                // Uncomment below to enable CORS requests
                                headers: {
                                    "Access-Control-Allow-Origin": "*",
                                    "Access-Control-Allow-Headers": "*"
                                },
                                body: JSON.stringify({hasMatch: true, meetingId: meeting["session_id"]})
                            };
                        }

                        // Delete the message from the queue after processing
                    } else {
                        keepSearching = false;
                    }
                } catch (receiveMessageError) {
                    console.log("Error receiving message:", receiveMessageError);
                    keepSearching = false;
                    throw receiveMessageError;
                }
            }
        }
    }

    const meeting_id = await apiHandler.createRoom();
    await setMeeting(meeting_id, userId, timestamp);

    const queueUrl = `https://sqs.us-east-1.amazonaws.com/730335436053/${userProfile}.fifo`;
    const params = {
        MessageBody: JSON.stringify({
            "user_id": `${userId}`,
            'generation_timestamp': timestamp,
            'session_id': meeting_id
        }),
        QueueUrl: queueUrl,
        MessageGroupId: `${timestamp}`,
        MessageDeduplicationId: `${timestamp}` // Required for FIFO queues.
    };

    try {
        const data = await sqs.sendMessage(params).promise();
        console.log("Success");
        console.log(data);
    } catch (err) {
        console.log("Error", err);
        throw err; // or handle error appropriately
    }


    // Wait a bit for the message to arrive in the queue
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second

    return {
        statusCode: 200,
        // Uncomment below to enable CORS requests
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        },
        body: JSON.stringify({hasMatch: false, meetingId: meeting_id})
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
        console.error('Error getProfile:', err);
        throw err; // Rethrow the error to be caught by the caller
    }
}

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
        console.error('Error getMeeting:', err);
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
            'is_active': true
        }
    };

    try {
        await ddbDocClient.send(new PutCommand(params));
    } catch (err) {
        console.error('Error setMeeting:', err);
        throw err; // Rethrow the error to be caught by the caller
    }
}

async function deleteMeeting(session_id) {
    const params = {
        TableName: 'matches-staging',
        Key: {
            'session_id': session_id,
        }
    };

    try {
        await ddbDocClient.send(new DeleteCommand(params));
    } catch (err) {
        console.error('Error deleteMeeting:', err);
        throw err; // Rethrow the error to be caught by the caller
    }
}


function calculateAge(birthDate) {
    console.log(`birthDate: ${birthDate}`);
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    console.log(`birthDateObj: ${birthDateObj}`);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
        age--;
    }
    return age;
}

function determineAgeRange(age) {
    console.log(`age: ${age}`);
    if (age <= 21) {
        return '18-21';
    } else if (age >= 22 && age <= 25) {
        return '22-25';
    } else if (age >= 26 && age <= 32) {
        return '26-32';
    } else {
        return '33';
    }
}

/*
// Example usage
const birthDate = '1990-05-15'; // Format: YYYY-MM-DD
const age = calculateAge(birthDate);
console.log('Age:', age);
*/
