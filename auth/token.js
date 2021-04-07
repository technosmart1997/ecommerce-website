const jwt = require('jsonwebtoken'),
    {accessTokenSecret} = require("../secrets");

const createToken = async (payload) => {
   return jwt.sign(payload, accessTokenSecret, {
        algorithm: "HS256",
        expiresIn: 86400 //24h
   })
}

function validateJWT () {
    return (req,res,next) => {
        try {
            let token;
            if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
                token = req.headers.authorization.split(' ')[1];
            }
            const payload = jwt.verify(token, accessTokenSecret);
            if(!payload) {
                res.status(401).send('Unauthenticated');
            }
            req.validatedJWTPayload = payload;
            return next();
        }catch(e) {
            res.status(401).send('Unauthenticated');
        }
    }
}

module.exports = {createToken,validateJWT}