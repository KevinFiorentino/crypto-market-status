# Crypto Market Status

## See order books, cotizations, and crypto pairs

### Install App

* `npm install`
* `cp .env.sample .env`
* `npm run start:dev`
* http://localhost:3000/

---

### Install with Docker

* `cp .env.sample .env`
* `docker-compose up -d --build`
* http://localhost:3000/

---

### WebSocket OrderBook

- The socket emits cotizations of a pair (BTCUSD | ETHUSD) as long as there is at least a client listening.
- It can emit multiple pairs in parallel.

* `npm run start:dev`
```html
<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <h1>See the console!</h1>
    <script src='https://cdn.socket.io/4.3.2/socket.io.min.js' integrity='sha384-KAZ4DtjNhLChOB/hxXuKqhMLYvx3b5MlT55xPEiNmREKRzeEm+RVPlTnAn0ajQNs' crossorigin='anonymous'></script>
    <script>
      const socket = io('http://localhost:3000');

      socket.emit('subscribe_pair', 'BTCUSD');            // Config pair: BTCUSD | ETHUSD

      socket.on('listen_orderbook', function(data) {
        console.log('Data OrderBook', data);
      });
    </script>
  </body>
</html>
```
* Fast server: `python3 -m http.server`

---

### Swagger - API Rest

* `npm run start:dev`
* `http://localhost:3000/apidocs`
* Or see `postman_collection.json` in the project root

---

### Test

* `npm run test`
