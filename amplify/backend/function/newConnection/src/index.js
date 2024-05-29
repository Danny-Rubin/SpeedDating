const {DynamoDBClient} = require('@aws-sdk/client-dynamodb');
const {
    DeleteCommand,
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    QueryCommand,
    ScanCommand
} = require('@aws-sdk/lib-dynamodb');
const jwt = require('jsonwebtoken');
const ddbClient = new DynamoDBClient({region: process.env.TABLE_REGION});
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);


// Import the AWS SDK
const AWS = require('aws-sdk');

// Set the region
AWS.config.update({region: 'us-east-1'});

/**
 * @type {import('http').Server}
 */


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
        return {
            statusCode: 403,
            // Uncomment below to enable CORS requests
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"
            }
        };
    }
    const other = userId == user1 ? user2 : user1;
    const sharedDetails = await getSharedDetails(userId);
    try{
        const {profilesList} = sharedDetails;
        //check if other in profilesList
        const res = profilesList.includes(other);
        return {
            statusCode: 200,
            // Uncomment below to enable CORS requests
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"
            },
            body: JSON.stringify({res: res, profileId: other})

        };
    } catch (err) {
        return {
            statusCode: 200,
            // Uncomment below to enable CORS requests
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"
            },
            body: JSON.stringify({res: false})
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

