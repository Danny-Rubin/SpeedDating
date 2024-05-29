const jwt = require('jsonwebtoken');

module.exports =
    {
        getClientIdFromToken
    }



function getClientIdFromToken(token){
    // Decode the token and retrieve client ID
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            console.error('Error verifying JWT:', err);
            return;
        }

        // Extracting client ID from decoded token
        const clientId = decoded.clientId;
        console.log('Client ID:', clientId);
        return clientId
    });
}
