const bcrypt = require('bcrypt'),
    RequestWrapper = require('request-wrapper'),
    http = new RequestWrapper();

const saltRounds = 10;

const encryptPassword = async (password) => {
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password, salt);
}

const comparePassword = async (password, hashPassword) => {
    return await bcrypt.compare(password, hashPassword);
}

const userUtil = async (baseUrl,routeUrl,method, doc) => {
    try {
        return await http.request({
            url: baseUrl + routeUrl,
            method,
            body : {...doc}
        })
    }catch(err) {
        throw new err;
    }
}

module.exports = {
    userUtil,
    encryptPassword,
    comparePassword
}
