const { ExpressApp } = require('../base/base-ms'),
    {createErrorResponse} = require('../utils/error-utils'),
    {authorizeMiddleWare} = require('../middlewares/authorize'),
    {validateJWT} = require('../auth/token'),
    asMain = (require.main === module);

class ProductMs extends ExpressApp {
    constructor(context) {
        super(context);
    }

    registerRoutes() {
        super.registerRoutes();
        const invokeAsync = this.invokeAsync.bind(this);
        const jwtValidator = validateJWT();
        this.router.post('/addProduct',authorizeMiddleWare('ADMIN','VENDOR'),invokeAsync(this.handleAddProduct));
        this.router.get('/getAllProducts',invokeAsync(this.getAllProducts));
        this.router.get('/getAllProducts/:categoryName', invokeAsync(this.getAllProductsByCategory));
        this.router.get('/getProductById/:pid',invokeAsync(this.getProductById));
        this.router.delete('/deleteProductByd/:pid',authorizeMiddleWare('ADMIN','VENDOR'),jwtValidator, invokeAsync(this.deleteProductById));
        this.router.put('/updateProductById', jwtValidator, invokeAsync(this.updateProductById));
    }

    async handleAddProduct(req) {
        const {validatedJWTPayload} = req;
        if(validatedJWTPayload) {
            return {status :200, content : validatedJWTPayload }
        }
        return createErrorResponse(500,'user.not.authenticated','User Not Authenticated');
    }
}

if(asMain) {
    let context = {
        PORT : 3004
    }
    new ProductMs(context).run();
}
