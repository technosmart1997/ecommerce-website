let upstream = {
    'appName' : 'rtscraper',
    'errorMessage' : 'Element Not Found'
}

let status = 200;

// console.log({})

function print(status,upstream = undefined) {  
    return {
        status,
        content: {
            errorCode : 404,
            message : "Hello 124",
            ...(upstream ? {upstream} : {})
        }
    }
}

console.log(print(status,upstream));