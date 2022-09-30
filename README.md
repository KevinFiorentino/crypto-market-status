# Market Status API REST

## Technical interview - Membrane Backend

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

### WebSocket

* `npm run start:dev`
```html
<html>
  <head></head>
  <body>
    <script src="https://cdn.socket.io/4.3.2/socket.io.min.js" integrity="sha384-KAZ4DtjNhLChOB/hxXuKqhMLYvx3b5MlT55xPEiNmREKRzeEm+RVPlTnAn0ajQNs" crossorigin="anonymous"></script>
    <script>
      const socket = io('http://localhost:3000');

      socket.emit('subscribe_pair', 'BTCUSD');            // Send: BTCUSD | ETHUSD

      socket.on('listen_orderbook', function(data) {
        console.log('Data OrderBook', data);
      });
    </script>
  </body>
</html>
```
* `python3 -m http.server`

---

### Swagger - API Rest

* `npm run start:dev`
* `http://localhost:3000/apidocs`

---

### Test

* `npm run test`
