import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException, ConnectedSocket,
  OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect }
from '@nestjs/websockets';
import { BitfinexApiService } from '@shared/services/bitfinex-api.service';
import { Server, Socket } from 'socket.io';
import { OrderBook } from '@shared/interfaces/order-book.interface';
import * as ws from 'ws';

export interface PairsRoom {
  pair: string;
  clients: string[];
  webSocket: ws;            // Socket instance
}

@WebSocketGateway({
  cors: { origin: '*' }
})
export class OrderBookGateway implements OnGatewayInit, OnGatewayDisconnect {

  @WebSocketServer() server: Server;

  // Use this property to persist Pairs (BTCUSD, ETHUSD) with their clients
  // We should use a better system such as REDIS to persist the current status of every pair
  private pairRooms!: PairsRoom[];

  constructor(
    private readonly api: BitfinexApiService
  ) {}

  // Init server
  afterInit(server: any) {
    this.pairRooms = [];
  }

  // After disconnect a client
  handleDisconnect(client: Socket) {
    // Remove client from pairsRoom
    this.pairRooms = this.pairRooms.map((p, i) => {

      const clientIndex = p.clients.findIndex(id => id == client.id)
      if (clientIndex != -1) {
        p.clients.splice(clientIndex, 1);

        // If there aren't clients in the pairsRoom, stop socket
        if (p.clients.length == 0)
          p.webSocket.close();

        return p;
      }
      return p;
    })
      .filter(p => p.clients.length > 0);     // Remove socket if doesn't have clients
  }


  @SubscribeMessage('subscribe_pair')
  async subscribePair(client: Socket, pair: string) {

    // Step 1: Validate pair
    const pairsAvailable = await this.api.getPairsList();

    let validatePair = null;
    if (pairsAvailable.data && pairsAvailable.data[0])
      validatePair = pairsAvailable.data[0].findIndex((p: string) => {
        return p == pair;
      });

    if (!validatePair || validatePair == -1)
      throw new WsException({ event: 'error', message: `The pair ${pair} has not been found.` });


    // Step 2: Join client to room
    client.join(pair);


    // Step 3: Find if room already exist
    const pairActive = this.pairRooms.findIndex((p: PairsRoom) => {
      return p.pair == pair;
    });

    if (pairActive == -1) {
      // Step 4: Create pair in array and socket stream

      // Enable socket for all clients listen the pair
      const w = new ws('wss://api-pub.bitfinex.com/ws/2');

      w.on('message', (msg) => {
        const stream = JSON.parse(msg.toString());

        // Clean messages
        if (stream.event) return;
        if (stream[1] === 'hb') return;

        const orderBook: OrderBook[] = [];
        if (stream[1].length > 10) {            // First message
          stream[1].forEach(e => {
            orderBook.push({
              price: e[0],
              count: e[1],
              amount: e[2]
            });
          });
        } else {                                // Individual message
          orderBook.push({
            price: stream[1][0],
            count: stream[1][1],
            amount: stream[1][2]
          });
        }

        const response = { pair, orderBook };

        this.server.to(pair).emit('listen_orderbook', response);        // Emit information
      });

      // Listen pair and start the stream
      let msg = JSON.stringify({
        event: 'subscribe',
        channel: 'book',
        symbol: `t${pair}`
      });
      w.on('open', () => w.send(msg));

      // Save pair and the first client on the array
      this.pairRooms.push({
        pair: pair,
        clients: [client.id],
        webSocket: w
      });

    } else {
      // Step 4: Update pair if exist and push the new client to listen
      const p = this.pairRooms[pairActive];
      p.clients.push(client.id);
      this.pairRooms.splice(pairActive, 1, p);
    }

  }

}
