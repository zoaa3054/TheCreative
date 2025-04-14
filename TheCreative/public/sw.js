self.addEventListener('push', (e)=>{
  console.log(e);
  self.registration.showNotification("New Lecture", {
    body: e,
    icon: '/icons/icon-192x192.png'
  })
})