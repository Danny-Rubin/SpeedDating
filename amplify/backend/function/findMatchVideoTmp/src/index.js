/**
 * @type {{generateUserToken: function(*, *): *, createRoom: function(): *}|{generateUserToken?: function(*, *): *, createRoom?: function(): *}}
 */

const apiHandler = require("./apiHandler.js")

// consdata = {
//     "token" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiIwNGZiZDNlMS1iYzEwLTQ1ZGMtOGUzYi1iNjVkZDk2OGI1MGEiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTcwOTA0NjI2NiwiZXhwIjoxNzA5NjUxMDY2fQ.j7iHx3WsGOtXMwdqHUnB5Rgh30tk1EXNaR8JtflL0is",
//     "session_id" : "5fji-hsmg-g0b6"
// };

exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);

    // match logic...
    const meeting_id = await apiHandler.createRoom();
    const user1_token = apiHandler.generateUserToken(meeting_id,"user1");
    const user2_token = apiHandler.generateUserToken(meeting_id, "user2");

    const data = {
        "meeting_id" : meeting_id,
        "user1_token" : user1_token,
        "user2_token" : user2_token
    }
    return {
        statusCode: 200,
        //  Uncomment below to enable CORS requests
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        },
        body: JSON.stringify(data),
    };
};
