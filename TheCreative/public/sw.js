self.addEventListener('push', (e) => {
  const data = e.data.json(); // Safely get JSON data if present

  self.registration.showNotification("New Lecture", {
    title: data.title,
    body: data.body,
    icon: '/icons/icon-192x192.png', // optional
  });
});