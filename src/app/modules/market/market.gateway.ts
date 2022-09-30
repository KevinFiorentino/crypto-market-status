
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse, ConnectedSocket } from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  }
})
export class MarketGateway {

  @WebSocketServer()
  server: Server;

  /* @SubscribeMessage('events')
  findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
    return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
  } */

  /* @SubscribeMessage('identity')
  async getMarket(@MessageBody() data: any): Promise<any> {
    return 'market';
  } */

}
