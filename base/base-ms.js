const express = require('express'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    {validationResult} = require('express-validator');

class ExpressApp {
    constructor(context) {
        this.context = context;
        const app = express(),
        router = express.Router();              
        this.PORT = context.PORT;
        this.express = express;
        this.app = app;
        this.router = router;
    }

    run() {
        this.initExpress();
        this.startExpress();
        // return the App
        return this;
    }

    invokeAsync(method) {
        return (req, res, next) => {
            // call the method expected to return promise, resolves to {status, content}
            method.call(this, req, res).then(result => {
               res.status(result.status).send(result.content);
            }).catch(err => {
                console.log(err);
            })   
        }
    }

    checkVaildationResults(req,res,next) {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({errors: errors.array()});
            }
            return next();
    }

    initExpress() {
        const router = this.router,
            app = this.app;
            app.use(bodyParser.json({}));
            app.use(cors());

            // app.use(this.verifyJwt());
            this.registerRoutes();
            app.use('/', router); // Mount The Middleware at path '/'   
            this.registerErrorRoutes(app);
    }

    registerRoutes() {}

    registerErrorRoutes(app) {
        app.use('*' ,(req,res) => {
            res.status(404).json({
                msg : 'Route Not Found'
            })
        })
    }

    startExpress() {
        const app = this.app;
        try {
            app.listen(this.PORT , () => {
                console.log('Server Running On PORT,' , this.PORT);
            })
        }catch(err) {
            console.log('ERROR',err);
        }
    }
}

module.exports = {ExpressApp};