import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ProjectService } from '../project/services/project.service';
import { JwtService } from '@nestjs/jwt';
import { ForbiddenException, Injectable } from '@nestjs/common';
import * as cookie from 'cookie';
import { AppLogger } from 'src/common/logger.service';
import { JwtPayload } from 'src/auth/decorators/auth.decorator';
import { Types } from 'mongoose';

interface UserSocket extends Socket {
  userId?: string;
  role?: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@Injectable()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private readonly logger = new AppLogger(ChatGateway.name);
  constructor(
    private projectService: ProjectService,
    private jwtService: JwtService,
  ) {}

  handleConnection(client: UserSocket) {
    const rawCookie = client.handshake.headers.cookie || '';
    const cookies = cookie.parse(rawCookie);
    const token = cookies['access_token'];

    if (token) {
      try {
        const payload: JwtPayload = this.jwtService.verify(token);
        client.userId = payload._id;
        client.role = payload.role;
        console.log(
          `User ${client.userId} has connected with client ${client.id}`,
        );
      } catch (error) {
        this.logger.logError(error);
        client.disconnect();
        throw new ForbiddenException();
      }
    }
  }

  handleDisconnect(client: UserSocket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinProject')
  async handleJoinProject(
    client: UserSocket,
    projectId: string,
  ): Promise<void> {
    if (!client.userId) {
      client.emit('error', { message: 'Unauthorized' });
      return;
    }

    try {
      const id = new Types.ObjectId(client.userId);
      const project = await this.projectService.getProject(projectId);
      const isUserExistsOnProject = project.members.some((m) => m.equals(id));
      if (isUserExistsOnProject) {
        const roomName = `project-${projectId}`;
        // ✅ Nếu client đã ở trong room thì không cần join lại
        if (client.rooms.has(roomName)) {
          client.emit('joined', {
            projectId,
            message: `You're already in the project chat`,
          });
          return;
        }
        // Tham gia room mới
        await client.join(`project-${projectId}`);
        console.log(`User ${client.userId} joined project ${projectId}`);

        // Thông báo cho user
        client.emit('joined', {
          projectId,
          message: `You've joined the project chat`,
        });

        // Thông báo cho các users khác trong room
        client.to(`project-${projectId}`).emit('userJoined', {
          userId: client.userId,
          role: client.role,
        });
      } else {
        client.emit('error', { message: 'Project not found or access denied' });
      }
    } catch (error) {
      console.error('Error joining project:', error);
      client.emit('error', { message: 'Failed to join project chat' });
    }
  }

  @SubscribeMessage('leaveProject')
  async handleLeaveProject(
    client: UserSocket,
    projectId: string,
  ): Promise<void> {
    await client.leave(`project-${projectId}`);
    console.log(`User ${client.userId} left project ${projectId}`);

    // Thông báo cho các users khác trong room
    client.to(`project-${projectId}`).emit('userLeft', {
      userId: client.userId,
      role: client.role,
    });
  }

  @SubscribeMessage('sendMessage')
  handleMessage(
    client: UserSocket,
    payload: { projectId: string; content: string },
  ): void {
    if (!client.userId) {
      client.emit('error', { message: 'Unauthorized' });
      return;
    }

    const { projectId, content } = payload;
    const message = {
      content,
      sender: {
        id: client.userId,
        role: client.role,
      },
      timestamp: new Date().toISOString(),
    };

    console.log(`Received message in project ${projectId}:`, message);

    // Gửi tin nhắn tới tất cả clients trong room này
    this.server.to(`project-${projectId}`).emit('message', message);
  }
}
