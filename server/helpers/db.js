const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";
const dbName = "vibes";

var connectSettings = {
    useNewUrlParser: true
};

function getDb() {
    return MongoClient.connect(url, connectSettings).then(client => {
        return client.db(dbName)
    })
}

async function newVibe(vibe, uid) {
    var now = Date.now();
    vibe.createdAt = now;
    vibe.users = [uid];
    vibe.lastJoined = now;

    let client;

    try {
        const db = await getDb();
        let res = await db.collection("vibe").insertOne(vibe);
        await db.collection("user").updateOne({
            fbid: uid
        }, {
            $set: {
                inVibe: res.insertedId
            }
        }, {
            upsert: true
        });

        vibe.id = res.insertedId;
        return vibe;

    } catch (err) {
        console.log(err.stack);
    }

    // Close connection
    client.close();
}

async function getVibes() {
    try {
        const db = await getDb();
        let res = await db.collection("vibe").find({
                lastJoined: {
                    $gt: Date.now() - 3600000 //last 2 hours
                }
            })
            .sort({
                createdAt: 1
            });
        return res.toArray();
    } catch (err) {
        console.log(err);
    }
}

async function updateLocation(user) {
    try {
        user.updatedAt = Date.now();
        db = await getDb();
        return await db.collection("user").findOneAndUpdate({
            fbid: user.fbid
        }, {
            $set: {
                location: user.location,
                updatedAt: Date.now()
            }
        }, {
            upsert: true,
            returnOriginal: false,
            projection: {
                _id: 0,
                fbid: 1,
                name: 1,
                location: 1,
                inVibe: 1,
            }
        }).then(res => {
            return res.value
        });
    } catch (err) {
        console.log(err);
    }
}

async function login(user) {
    try {
        const db = await getDb();
        return db.collection("user").findOneAndUpdate({
            fbid: user.fbid
        }, {
            $set: {
                fbid: user.fbid,
                name: user.name,
                token: user.token,
                location: user.location,
                updatedAt: Date.now()
            }
        }, {
            upsert: true,
            returnOriginal: false,
            projection: {
                _id: 0,
                fbid: 1,
                name: 1,
                location: 1,
                inVibe: 1,
            }
        }).then(res => {
            return res.value
        });
    } catch (err) {
        console.log(err);
    }
}

async function saveToken(token) {
    try {
        const db = await getDb();
        return db.collection("token").save(token);
    } catch (err) {
        console.log(err);
    }
}

async function getTokens() {
    try {
        const db = await getDb();
        return db.collection("token").find({
            createdAt: {
                $gt: Date.now() - (1000 * 60 * 60 * 24 * 10) //in the last 10 days
            }
        })
    } catch (err) {
        console.log(err);
    }
}

async function getUsers() {
    try {
        const db = await getDb();
        let res = await db.collection("user").find({
                updatedAt: {
                    $gt: Date.now() - 1000 * 60 * 90
                }
            })
            .project({
                _id: 0,
                location: 1,
                fbid: 1,
                name: 1,
                inVibe: 1
            });
        return res.toArray();
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    newVibe,
    getVibes,
    getUsers,
    login,
    updateLocation,
    saveToken,
    getTokens
};