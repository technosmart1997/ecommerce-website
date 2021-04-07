const { ExpressApp } = require('../base/base-ms'),
    {createErrorResponse} = require('../utils/error-utils'),
    {validateJWT} = require('../auth/token'),
    asMain = (require.main === module);

class DashboardMs extends ExpressApp {
    constructor(context) {
        super(context);
    }

    registerRoutes() {
        super.registerRoutes();
        const invokeAsync = this.invokeAsync.bind(this);
        const jwtValidator = validateJWT();
        this.router.get('/dashboard',jwtValidator,invokeAsync(this.handleDashboard));
    }

    async handleDashboard(req) {
        const {validatedJWTPayload} = req;
        if(validatedJWTPayload) {
            return {status :200, content : validatedJWTPayload }
        }
        return createErrorResponse(500,'user.not.authenticated','User Not Authenticated');
    }
}

if(asMain) {
    let context = {
        PORT : 3001
    }
    new DashboardMs(context).run();
}
