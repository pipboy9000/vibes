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
                    vibes: vibeId
                }
            }, {
                upsert: true
            })
        });
        console.log(res);
    } catch (err) {
        console.error(err.stack);
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
    saveVibe
};