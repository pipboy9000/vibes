var chalk = require("chalk");

const MongoClient = require("mongodb").MongoClient;
const ObjectID = require('mongodb').ObjectID
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

async function newVibe(vibe, user) {
    var now = Date.now();
    vibe.createdAt = now;
    vibe.createdBy = {
        uid: user.uid,
        name: user.name
    };
    vibe.users = [user.uid];
    vibe.lastJoined = now;
    vibe.comments = [];
    vibe.pictures = [];

    try {
        const db = await getDb();
        let res = await db.collection("vibe").insertOne(vibe);
        await db.collection("user").updateOne({
            fbid: user.uid
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
            fbid: user.uid
        }, {
            $set: {
                location: user.location,
                updatedAt: Date.now()
            }
        }, {
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
                fbid: user.uid,
                name: user.name,
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

async function newComment(comment, user) {
    const db = await getDb();

    //check if user is in the vibe
    var vibe = await db.collection('vibe').findOne(ObjectID(comment.vibeId));
    if (!vibe.users.includes(user.uid)) {
        console.log(chalk.red(uid, " can't comment on vibe if not in it"));
    }

    var c = {
        text: comment.text,
        name: user.name,
        uid: user.uid,
        createdAt: Date.now(),
    }

    //insert comment to vibe
    var res = await db.collection('vibe').findOneAndUpdate(ObjectID(comment.vibeId), {
        $push: {
            comments: c
        }
    }, {
        returnOriginal: false,
        projection: {
            _id: 0,
            comments: 1
        }
    })

    return {
        comments: res.value.comments,
        vibeId: comment.vibeId
    }
}

module.exports = {
    newVibe,
    getVibes,
    getUsers,
    login,
    updateLocation,
    saveToken,
    getTokens,
    newComment
};