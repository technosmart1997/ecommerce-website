const { ExpressApp } = require('../base/base-ms'),
    {mongoUrl} = require('../utils/mongoCreds'),
    {createErrorResponse} = require('../utils/error-utils'),
    {encryptPassword} = require('./authUtils'),
    {initMongoConnect} = require('../utils/mongoDB-util'),
    asMain = (require.main === module);

    async function initResources(context) {
        return await initMongoConnect(context);
    }

    const COLLECTION_NAME = 'USERS';

    class UserOnboardMs extends ExpressApp {

    constructor(context) {
        super(context);
        this.options = context;
        this.db = context.db;
    }

    registerRoutes() {
        super.registerRoutes();
        const invokeAsync = this.invokeAsync.bind(this);
        this.router.get('/user/getUser' ,invokeAsync(this.getUserByEmail));
        this.router.post('/user/insertUser',invokeAsync(this.addNewUser));
        this.router.put('/user/updateUser', invokeAsync(this.updateUser));
        this.router.put('/user/deleteUser', invokeAsync(this.deleteUser));
        this.router.post('/reset-password', invokeAsync(this.handleResetPassword));
    }

    async getUserByEmail(req) {
        const {email} = req.body;
        try {
            let query = email ? {email} : {};
            const user = await this.db.collection(COLLECTION_NAME).findOne(query);
            if(!user) {
                return await createErrorResponse(404,'user.not.found','User Not Found');
            }
            return {
                status: 200,
                content: user
            }
        }catch(err) {
            return await createErrorResponse(500,'error.finding.user','Error Finding User');
        }
    }

    async addNewUser(req) {
        const {email, password, ...rest} = req.body;
        try {
            let query = {email,active:{$in : [false,true]}};
            const user = await this.db.collection(COLLECTION_NAME).findOne(query);
            if(user) {
                return await createErrorResponse(409,'user.email.exists',"Email Already Exists");
            }
            const hashPassword = await encryptPassword(password);
            const chars = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'];
            let token = [Array(4)].map(i=>chars[Math.random()*chars.length|0]).join('');
            let doc = {
                email,
                password : hashPassword,
                confirmToken :token,
                active:false,
                createdOn : new Date(),
                modifiedOn : new Date(),
                confirmEmailAttempts : 0,
                ...rest
            }

            let insertRes = await this.db.collection(COLLECTION_NAME).insertOne(doc);
            if(!insertRes || insertRes.insertedCount !== 1) {
                return await createErrorResponse(500,'error.in.registering',"Error in Registering")
            }
            //
            //         Send Confirmation Email Here
            //
            doc.id = insertRes.insertedId;
            delete doc.password;
            return {
                status : 200,
                content : doc
            }
        }catch(err) {
            return await createErrorResponse(500,'error.creating.user','Error Creating User');
        }
    }

        async handleResetPassword(req) {
            let {email, newPassword} = req.body;
            try {
                let query = {email};
                let hashPassword = await encryptPassword(newPassword);
                let update = {
                    $set : {
                        password : hashPassword
                    }
                }
                let updateRes = await this.db.collection(COLLECTION_NAME).updateOne(query,update,{upsert: true});
                if(updateRes.result.ok!=1) {
                    return await createErrorResponse(500,'password.updation.error',"Error in updating Password")
                }
                return {
                    status : 200,
                    content : 'Password Changed Successfully!!!'
                }
            }catch (err) {
                return await createErrorResponse(500,'password.updation.error',"Error in updating Password")
            }
        }

        async updateUser(req) {
            const {email, ...rest} = req.body;
            try {
                // Update the User
            }catch(err) {
                throw err;
            }
        }

        async deleteUser(req) {
            const {email} = req.body;
            try {
                // Delete the User
            }catch(err) {
                throw err;
            }
        }
}

if(asMain) {
    let context = {
        PORT : 3002,
        options : {
            mongoUrl
        }
    }

    initResources(context).then(result => {
        new UserOnboardMs(context).run();
    }).catch(err => {
        console.log(err);
    })
}
