const MongoClient = require('mongodb').MongoClient;

async function initMongoConnect(context) {
    let {options} = context;
    let connectUrl = options.mongoUrl;

    const client = await MongoClient.connect(connectUrl,{ useUnifiedTopology: true });
    context.db = client.db();
    return context;
}

module.exports = {initMongoConnect};


