
function authorizeRole(allowedRoles,roleAssigned) {
    return roleAssigned.some(role => allowedRoles.has(role));
}

const authorizeMiddleWare = (...roles) => {
    const allowedRoles = new Set(roles);
    return (req,res,next) => {
        if(!req.session || !req.session.user || !req.session.user.roles) {
            return res.status(401).send('Unauthenticated');
        }
        if(!authorizeRole(allowedRoles,req.session.user.roles)) {
            return res.status(401).send('Forbidden');
        }
        return next();
    }
}

module.exports = {authorizeMiddleWare};


