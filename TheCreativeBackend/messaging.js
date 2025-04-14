const webPush = require('web-push');

module.exports = {
    sendNotification: async (token, notifBody) => {

        webPush.setVapidDetails('mailto:easymath85@gmail.com', process.env.PUSH_PUBLIC_KEY, process.env.PUSH_PRIVATE_KEY);
        webPush.sendNotification(token, notifBody)
        console.log('Notification sent');
    }
}