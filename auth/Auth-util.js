const jwt = require('jwt-simple');


class JwtUtil {
    constructor(options) {
        options = options || {};

        if(!options.algorithm) {
            throw new Error('Jwt Algorithm not Provided');
        }
        this.algorithm = options.algorithm;
        if(!options.secretKey) {
            throw new Error('Jwt Secret ket not Provided');
        }
        this.secretKey = options.secretKey;
    }

    encode(payload) {
        if(!payload && !this.algorithm && !this.secretKey) {
            throw new Error('Either Payload, algorithm or secret key is not present');
        }
        return jwt.decode(payload, this.secretKey, this.algorithm);
    }

    decode(jwtString) {
        if(!this.secretKey) {
            throw new Error('Secret Key is not present');
        }

        if(!jwtString) {
            throw new Error('Jwt not Provided');
        }
        return jwt.decode(jwtString,this.secretKey, this.algorithm);
    }
}

module.exports = JwtUtil;
