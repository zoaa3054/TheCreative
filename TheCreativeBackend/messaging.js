const webPush = require('web-push');
require('dotenv').config();

webPush.setVapidDetails(
    'mailto:easymath85@gmail.com',
    process.env.PUSH_PUBLIC_KEY,
    process.env.PUSH_PRIVATE_KEY
);

module.exports = {
    sendNotification: async (subscription, notifPayload) => {
        try {
            // Ensure notifPayload is a string
            const payload = typeof notifPayload === 'string'
                ? notifPayload
                : JSON.stringify(notifPayload);

            await webPush.sendNotification(subscription, payload);
            console.log('Notification sent successfully');
        } catch (error) {
            console.error('Error sending notification:', error);
        }
    }
};
