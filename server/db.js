const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'vibes';

var connectSettings = {
    useNewUrlParser: true
}

async function newVibe(vibe, uid) {

    var now = Date.now();
    vibe.createdAt = now;
    vibe.createdBy = uid;
    vibe.users = [uid];
    vibe.lastJoined = now;

    let client;

    try {
        client = await MongoClient.connect(url, connectSettings);
        const db = client.db(dbName);
        let r = await db.collection('vibe').insertOne(vibe);
        if (r.insertedCount > 0) {
            return vibe;
        }
    } catch (err) {
        console.log(err.stack);
    }

    // Close connection
    client.close();
};

async function getVibes() {

    var from = Date.now() - 3600000; //last 2 hours

    let client;

    try {
        client = await MongoClient.connect(url, connectSettings);
        db = client.db(dbName);
        let cursor = await db.collection('vibe').find({
            lastJoined: {
                $gt: from
            }
        }).sort({
            createdAt: 1
        });
        var result = cursor.toArray();
        return result;
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    newVibe,
    getVibes
}