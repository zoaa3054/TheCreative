const {sendNotification} = require('./messaging.js');

const payload = JSON.stringify({
    title: "New Notification",
    body: "hello"
})
sendNotification({
    endpoint: 'https://wns2-par02p.notify.windows.com/w/?token=BQYAAABZE3roJ0SgP4D4NWks0roZjE%2f%2bT10Wp7GLAOgghmxUB7Tj%2bkYsXNrOfQpzvaw23fouIkVZdrbh2t02ozLXLuercXB9YD3q2T8Ub6PV3pB8O6KK%2fc3lUrD3YZmSkPjs3moB3uJzzlYhz5ROKGoqPjiCsvR9gHyV6HRNocsDPbHaDTUMJ3UhwM%2fe7HPsnnvpUz8sVTrqcKplCVWNTFawUhJVmNwX%2bzSaHvfdMjhGqfxWoc%2bTXKT2yno9UAUO03Y%2bBZyu8G9qQrbez8QJ3xc4%2bWjHsM%2fHYJYLtVYDHABc3zfJLE2x6VxTgxRB5dlRg4OmH75yMGJBONCansIh057qQIQBnJVBPKtHYTRezABFE6i30w%3d%3d',
    expirationTime: null,
    keys: {
      p256dh: 'BNEd6B86YfTmAYaH4WNKxqbR3ivmGJu5JCfUrUsxhqx9HtwsHtWLKVWeP73EhpFTuj1diLSQdGX7NqEtlyNWwrU',
      auth: 'GAmIFHkhHsnY48hpgcJOiA'
    }
  }, payload);