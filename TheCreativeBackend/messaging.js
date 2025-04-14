module.exports = {
    sendNotification: async (token, notifBody) => {
        const FCM_SERVER_KEY = 'AIzaSyB4OL5u9dJMi0VwBIqNht1mdju5Pz4m5qk';
      
        await fetch('https://fcm.googleapis.com/fcm/send',{
            method:"POST",
            headers: {
                Authorization: `key=${FCM_SERVER_KEY}`,
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                to: token,
                notification: {
                    title: 'New Lecture',
                    body: notifBody,
                }
            })
        });
      
        console.log('Notification sent');
      }
}