import { WebSocketGateway, SubscribeMessage, WebSocketServer, ConnectedSocket, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('joinRoom')
  handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() data: { userId: string; projectId: string }): void {
    client.join(`project_${data.projectId}`);
    client.to(`project_${data.projectId}`).emit('userJoined', { userId: data.userId });
    console.log('Client joinRoom:', data);
  }

  @SubscribeMessage('sendMessage')
  handleMessage(@MessageBody() data: { projectId: string; userId: string; message: string }): void {
    console.log('New message:', data);
    this.server.to(`project_${data.projectId}`).emit('newMessage', {
      userId: data.userId,
      message: data.message,
      timestamp: new Date(),
      
    });
  }
}