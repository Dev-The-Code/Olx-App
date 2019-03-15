var dataCacheName = 'olx-apps';
var cacheName = 'olx-hachathon';
var filesToCache = [
    '/',
    '/index.html',
    '/login.html',
    '/register.html',
    'product_details.html',
    '/createAd.html',
    `addFav.html`,
    '/chat.html',
    '/chatBox.html',
    '/myaccount.html',
    'assets/css/style.css',
    'assets/css/bootstrap.min.css',
    'assets/css/bootstrap-responsive.min.css',
    'assets/img/chat.png',
    'assets/img/homelogo.png',
    'assets/img/olx-logo.png',
    'assets/img/send.png',
    'assets/img/white_leather.png',
    'assets/js/app.js',
    'assets/js/bootstrap.min.js',
    'assets/js/jquery.js',
];

// self.addEventListener('install', function (e) {
//     console.log('[ServiceWorker] Install');
//     e.waitUntil(
//         caches.open(cacheName).then(function (cache) {
//             console.log('[ServiceWorker] Caching app shell');
//             return cache.addAll(filesToCache);
//         })
//     );
// });
// self.addEventListener('activate', function (e) {
//     console.log('[ServiceWorker] Activate');
//     e.waitUntil(
//         caches.keys().then(function (keyList) {
//             return Promise.all(keyList.map(function (key) {
//                 if (key !== cacheName && key !== dataCacheName) {
//                     // console.log('[ServiceWorker] Removing old cache', key);
//                     return caches.delete(key);
//                 }
//             }));
//         })
//     );
//     return self.clients.claim();
// });


// self.addEventListener('fetch', function (e) {
//     // console.log('[Service Worker] Fetch', e.request.url);
//     e.respondWith(
//         caches.match(e.request).then(function (response) {
//             return response || fetch(e.request);
//         })
//     );
// });


self.addEventListener('install', function (e) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('activate', function (e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (key !== cacheName && key !== dataCacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', function (e) {
    console.log('[Service Worker] Fetch', e.request.url);
    e.respondWith(
        // caches.open(dataCacheName).then(function (cache) {
        //     return fetch(e.request).then(function (response) {
        //         cache.put(e.request.url, response.clone());
        //         return response  || fetch(e.request);;
        //     });
        // })
        caches.match(e.request).then(function (response) {
            return response || fetch(e.request);
        })
    );
});


// self.addEventListener('fetch', function(e) {
//     console.log('[ServiceWorker] Fetch', e.request.url);
//     e.respondWith(
//       caches.match(e.request).then(function(response) {
//         return response || fetch(e.request);
//       })
//     );
//   });



console.log('... Service Worker File Running ...');

// Listner for Push Notification
self.addEventListener('push', function (event) {
  console.log('Received a push message', event.data.json().notification);
  var notification = event.data.json().notification;
//   var title = notification.title;
  var body = notification.body;
  var url = notification.click_action;
  var icon = 'assets/img/mgsIcon.jpg';

  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      icon: icon,
      data: url,
    })
  );

});

// on Notification Click do whatever you want...
// self.addEventListener('notificationclick', function (event) {
//   console.log('On notification click: ', event.notification);
//   event.notification.close();
//   clients.openWindow(event.notification.data);
// });














// 'use strict';

// console.log('... Service Worker File Running ...');

// // Listner for Push Notification
// self.addEventListener('push', function (event) {
//   console.log('Received a push message', event);

//   var notification = event.data.json().notification
//   console.log(notification)
//   var title = notification.title || 'Yay a message.';
//   var body = notification.body || 'We have received a push message.';
//   var icon = '/images/icon-192x192.png';
//   // var tag = 'simple-push-demo-notification-tag';

//   event.waitUntil(
//     self.registration.showNotification(title, {
//       body: body,
//       icon: icon,
//       // tag: tag
//     })
//   );

// });

// // on Notification Click do whatever you want...
// self.addEventListener('notificationclick', function (event) {

//   console.log('On notification click: ', event.notification);
//   // Android doesn’t close the notification when you click on it
//   // See: http://crbug.com/463146
//   event.notification.close();

//   // This looks to see if the current is already open and
//   // focuses if it is
//   event.waitUntil(clients.matchAll({
//     type: 'window'
//   }).then(function (clientList) {
//     for (var i = 0; i < clientList.length; i++) {
//       var client = clientList[i];
//       if (client.url === '/' && 'focus' in client) {
//         return client.focus();
//       }
//     }
//     if (clients.openWindow) {
//       return clients.openWindow('/');
//     }
//   }));

// });

