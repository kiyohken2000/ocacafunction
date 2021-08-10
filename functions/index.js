const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { Expo } = require('expo-server-sdk');
admin.initializeApp();

const db = admin.firestore();
const expo = new Expo();

exports.sendMessage = functions.region('asia-northeast2').firestore
  .document('live/{stream}')
  .onCreate((snap, context) => {
    const newValue = snap.data();
    const createdUser = newValue.createdUser
    const name = createdUser.fullName
    const follower = createdUser.follower
    console.log(newValue)

    for (const elem of follower) {
      const message = []
      const userRef = db.collection('tokens').doc(elem)
      userRef.get().then((doc) => {
        if (doc.exists) {
          const data = doc.data()
          const token = data.token
          message.push({
            to: token,
            sound: 'default',
            title: name,
            body: 'going on the air.'
          })
        } else { null }
      })
    }
  });