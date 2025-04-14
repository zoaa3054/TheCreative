// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyB4OL5u9dJMi0VwBIqNht1mdju5Pz4m5qk",
  authDomain: "thecreative-8d8e7.firebaseapp.com",
  projectId: "thecreative-8d8e7",
  messagingSenderId: "864394497070",
  appId: "1:864394497070:web:c91a678b9c141f026463bf"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: '/icons/icon-192x192.png',
  });
});