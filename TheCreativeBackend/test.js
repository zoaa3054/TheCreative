const {sendNotification} = require('./messaging.js');

const payload = JSON.stringify({
    title: "New Notification",
    body: "hello"
})
sendNotification({
    endpoint: 'https://fcm.googleapis.com/fcm/send/cmIJk_dot_w:APA91bEM7Fnadn9JnR_qcF3E6Z6yCx5Mdsjahv0voub3q-GRrECTHJ1L-y-o9-sbYY5WcoD0Sqzrwg8sR-5fTnuH1djQqfO7zpEX_lHiRjMwqhSKWiGu1MA41SiRujrK4m6yKyK09KQq',
    expirationTime: null,
    keys: {
      p256dh: 'BA21VvVAQiOO-yyoCetgf5dVRdOM7x516Oqxj6kPWeUNJSVUvUkPHSvwWgM6EQIF2Z11kXE6SRnJiUXKm_CtPNo',
      auth: 'eCc70s120uttF9VaqcpDDA'
    }
  }, payload);