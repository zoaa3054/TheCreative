alert("khel")
self.addEventListener('push', (e)=>{
  console.log(e);
  self.registration.showNotification("New Lecture", {
    body: e,
  })
})