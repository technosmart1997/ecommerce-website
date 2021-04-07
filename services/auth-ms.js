const { ExpressApp } = require('../base/base-ms'),
    {createErrorResponse} = require('../utils/error-utils'),
    {comparePassword} = require('./authUtils'),
    {body} = require('express-validator'),
    {createToken} = require('../auth/token'),
    {userUtil} = require('./authUtils'),
    asMain = (require.main === module)


class AuthApp extends ExpressApp {
    constructor(context) {
        super(context);
        this.options = context;
    }

    registerRoutes() {
        super.registerRoutes();
        const invokeAsync = this.invokeAsync.bind(this);
        const checkVaildationResults = this.checkVaildationResults.bind(this);
        this.router.post('/login', AuthApp.validateRequestBody(),checkVaildationResults, invokeAsync(this.handleLogin));
        this.router.post('/register', AuthApp.validateRequestBody(), checkVaildationResults,invokeAsync(this.handleRegister));
        this.router.get('/logout', invokeAsync(this.handleLogout));
    }

    static validateRequestBody () {
        return [
            body('email').exists().isEmail().withMessage('Invalid Email'),
            body('password').exists().trim().isLength({min: 8}).withMessage('Password should be of min 8 chars'),
            body('firstName').optional({nullable: true}).isString().withMessage('Invalid FirstName'),
            body('lastName').optional({nullable: true}).isString().withMessage('Invalid LastName')
        ]
    }

    async handleLogin(req) {
        let doc = req.body;
        try {
            const user = await userUtil('http://localhost:3002','/user/getUser','POST',doc);
            if(!user.active) {
                return await createErrorResponse(401,'user.not.active',"Email Not Verified")
            }
            const isValidPassword = await comparePassword(doc.password, user.password);
            if(!isValidPassword) {
                return await createErrorResponse(500,'password.not.authenticated',"Password Not Authenticated")
            }
            delete user.password;
            const payload = {...user};
            const token = await createToken(payload);
            return {
                status: 200,
                content : {
                    token,
                    ...user
                }
            }
        }catch(err) {
            return await createErrorResponse(err.statusCode, err.error.message);
        }
    }

    async handleRegister(req) {
        let doc = req.body;
        const response = await userUtil('http://localhost:3002','/user/insertUser','POST',doc);
        if(response.statusCode === 200) {
             return {
                 status: 200,
                 content: response.body
             }
        }
        return {
            status: response.statusCode,
            content: response.body
        }
    }

    async handleLogout(req) {
        console.log("On Logout");
    }
}

if(asMain) {
    let context = {
        PORT : 3000
    }
    new AuthApp(context).run();
}
