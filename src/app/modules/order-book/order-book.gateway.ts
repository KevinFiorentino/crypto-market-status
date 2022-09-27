
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  }
})
export class OrderBookGateway {

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('order-book')
  async getOrderBook(@MessageBody() data: any): Promise<any> {
    return 'order-book';
  }

}
