var chalk = require("chalk");

const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID
const url = process.env.MONGO_URL || "mongodb://localhost:27017";
const dbName = "vibes";
let connectionInstance = null;

var connectSettings = {
    useNewUrlParser: true
};

async function getDb() {
    if (connectionInstance) return connectionInstance;
    let client = await MongoClient.connect(url, connectSettings);
    connectionInstance = client.db(dbName);
    return connectionInstance;
}

async function saveVibe(vibe) {
    try {
        const db = await getDb();
        let res = await db.collection("vibe").insertOne(vibe);
        var vibeId = res.insertedId.toString();
        vibe.usersHistory.forEach(fbid => {
            db.collection("album").update({
                _id: fbid
            }, {
                $push: {
                    vibes: {
                        id: vibeId,
                        title: vibe.title,
                        createdAt: vibe.createdAt
                    }
                }
            }, {
                upsert: true
            });
        });
    } catch (err) {
        console.error(err.stack);
    }
}

async function saveFutureVibe(vibe) {
    const db = await getDb();
    let res = await db.collection("future-vibes").insertOne(vibe);
    var vibeId = res.insertedId.toString();
    return vibeId;
}

async function saveCacheState(users, vibes) {
    try {
        let cacheObj = {id:1, users, vibes};
        const db = await getDb();
        let res = await db.collection("cache").update({id:1}, cacheObj, {upsert:true});
        return res;
    } catch (err) {
        console.error(err.stack);
    }
}

async function loadCacheState() {
    try {
        const db = await getDb();
        let res = await db.collection("cache").findOne({id:1});
        return res;
    } catch (err) {
        console.error(err.stack);
    }
}

async function getFutureVibes() {
    try {
        const db = await getDb();
        let res = await db.collection("future-vibes").find();
        return res;
    } catch (err) {
        console.error(err.stack);
    }
}

async function removeFutureVibe(_id) {
    try {
        const db = await getDb();
        let res = await db.collection("future-vibes").deleteOne({_id: new ObjectID(_id)});
        return res;
    } catch (err) {
        console.error(err.stack);
    }
}

async function getAlbum(fbid) {
    try {
        const db = await getDb();
        let res = await db.collection("album").findOne({
            _id: fbid
        });
        return res;
    } catch (err) {
        console.error(err);
    }
}

// async function newVibe(vibe, user) {
//     var now = Date.now();
//     vibe.createdAt = now;
//     vibe.createdBy = {
//         fbid: user.fbid,
//         name: user.name
//     };
//     vibe.users = [user.fbid];
//     vibe.lastJoined = now;
//     vibe.comments = [];
//     vibe.pictures = [];

//     try {
//         const db = await getDb();
//         let res = await db.collection("vibe").insertOne(vibe);

//         //remove user from old vibe if necessary
//         var dbUser = await db.collection("user").findOne({
//             fbid: user.fbid
//         });

//         //if user was already in a vibe when creating the new vibe, remove the user from previous vibe
//         if (dbUser.inVibe) {
//             await db.collection("vibe").updateOne({
//                 "_id": dbUser.inVibe
//             }, {
//                 $pull: {
//                     users: user.fbid
//                 }
//             })
//         }

//         await db.collection("user").updateOne({
//             fbid: user.fbid
//         }, {
//             $set: {
//                 inVibe: res.insertedId
//             }
//         }, {
//             upsert: true
//         });

//         vibe.id = res.insertedId;
//         return vibe;

//     } catch (err) {
//         console.log(err.stack);
//     }
// }

// async function getVibes() {
//     try {
//         const db = await getDb();
//         let res = await db.collection("vibe").find({
//                 lastJoined: {
//                     $gt: Date.now() - 3600000 //last 2 hours
//                 }
//             })
//             .sort({
//                 createdAt: 1
//             });
//         return res.toArray();
//     } catch (err) {
//         console.log(err);
//     }
// }

// async function updateLocation(user) {
//     try {
//         user.updatedAt = Date.now();
//         db = await getDb();
//         return await db.collection("user").findOneAndUpdate({
//             fbid: user.fbid
//         }, {
//             $set: {
//                 location: user.location,
//                 updatedAt: Date.now()
//             }
//         }, {
//             returnOriginal: false,
//             projection: {
//                 _id: 0,
//                 fbid: 1,
//                 name: 1,
//                 location: 1,
//                 inVibe: 1,
//             }
//         }).then(res => {
//             return res.value
//         });
//     } catch (err) {
//         console.log(err);
//     }
// }

// async function login(user) {
//     try {
//         const db = await getDb();
//         return db.collection("user").findOneAndUpdate({
//             fbid: user.fbid
//         }, {
//             $set: {
//                 fbid: user.fbid,
//                 name: user.name,
//                 updatedAt: Date.now()
//             }
//         }, {
//             upsert: true,
//             returnOriginal: false,
//             projection: {
//                 _id: 0,
//                 fbid: 1,
//                 name: 1,
//                 location: 1,
//                 inVibe: 1,
//             }
//         }).then(res => {
//             return res.value
//         });
//     } catch (err) {
//         console.log(err);
//     }
// }


// async function getUsers() {
//     try {
//         const db = await getDb();
//         let res = await db.collection("user").find({
//                 updatedAt: {
//                     $gt: Date.now() - 1000 * 60 * 90
//                 }
//             })
//             .project({
//                 _id: 0,
//                 location: 1,
//                 fbid: 1,
//                 name: 1,
//                 inVibe: 1
//             });
//         return res.toArray();
//     } catch (err) {
//         console.log(err);
//     }
// }

// async function newComment(comment, user) {
//     const db = await getDb();

//     //check if user is in the vibe
//     var vibe = await db.collection('vibe').findOne(ObjectID(comment.vibeId));
//     if (!vibe.users.includes(user.fbid)) {
//         console.log(chalk.red(user.fbid, " can't comment on vibe if not in it"));
//         return;
//     }

//     var c = {
//         text: comment.text,
//         name: user.name,
//         fbid: user.fbid,
//         createdAt: Date.now(),
//     }

//     //insert comment to vibe
//     var res = await db.collection('vibe').findOneAndUpdate({
//         "_id": ObjectID(comment.vibeId)
//     }, {
//         $push: {
//             comments: c
//         }
//     }, {
//         returnOriginal: false,
//         projection: {
//             _id: 1,
//             comments: 1
//         }
//     })

//     return {
//         comments: res.value.comments,
//         vibeId: res.value._id.toString()
//     }
// }

// module.exports = {
//     newVibe,
//     getVibes,
//     getUsers,
//     login,
//     updateLocation,
//     newComment
// };

module.exports = {
    saveVibe,
    saveFutureVibe,
    getFutureVibes,
    removeFutureVibe,
    getAlbum,
    saveCacheState,
    loadCacheState
};