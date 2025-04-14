self.addEventListener('push', (e) => {
  const data = e.data?.json() || {}; // Safely get JSON data if present

  self.registration.showNotification("New Lecture", {
    body: data.body || 'You have a new notification!',
    icon: '/icons/icon-192x192.png', // optional
  });
});