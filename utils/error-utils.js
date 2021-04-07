async function createErrorResponse(status, errorCode, message) {
    return {
        status,
        errorCode,
        content: {
            message
        }
    }
}

module.exports = {createErrorResponse};
