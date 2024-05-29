const jwt = require('jsonwebtoken');

const master_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiIwNGZiZDNlMS1iYzEwLTQ1ZGMtOGUzYi1iNjVkZDk2OGI1MGEiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTcwOTA0NjI2NiwiZXhwIjoxNzA5NjUxMDY2fQ.j7iHx3WsGOtXMwdqHUnB5Rgh30tk1EXNaR8JtflL0is";
const api_key = "04fbd3e1-bc10-45dc-8e3b-b65dd968b50a"
const api_secret = "be67636a781bc361b4935458b059b89605741d40e42cccd145bd36e737aef32a"

const userTokenOptions = {
    expiresIn: '120m',
    algorithm: 'HS256'
};

module.exports =
    {
        generateUserToken,
        createRoom
    }

function generateUserToken(meeting_id, participant_id) {

    const payload = {
        apikey: api_key,
        permissions: [`allow_join`], // `ask_join` || `allow_mod`
        version: 2, //OPTIONAL
        roomId: meeting_id, //OPTIONAL
        participantId: participant_id, //OPTIONAL
    };

    return jwt.sign(payload, api_secret, userTokenOptions);
}

async function createRoom() {

    const options = {
        method: "POST",
        headers: {
            "Authorization": master_token,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
    };
    const url = `https://api.videosdk.live/v2/rooms`;
    const response = await fetch(url, options);
    const data = await response.json();
    console.log(data);
    return data["roomId"];

}
