const firebase = require('firebase-admin')
const config = require('./config/db_config.json')

firebase.initializeApp({
    credential: firebase.credential.cert(config),
    databaseURL: "https://instagramscrapper-e1bb8.firebaseio.com"
});

let db = firebase.database()

const followedUserData = async(users) => {
    const created_at = await new Date().getTime()
    await db.ref('users/'+users[`name`]).set({
        username: users[`name`],
        created_at: created_at
    })
}

module.exports = {
    followedUserData
}