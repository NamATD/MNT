import { Controller, Get, Param, UseGuards, Query } from '@nestjs/common';
import { ChatService } from '../services/chat.service';
import { AuthGuard } from '@nestjs/passport';
import { Auth, JwtPayload } from 'src/auth/decorators/auth.decorator';

@Controller('chat')
@UseGuards(AuthGuard('jwt'))
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('project/:projectId/messages')
  async getProjectMessages(
    @Param('projectId') projectId: string,
    @Auth() auth: JwtPayload,
    @Query('limit') limit?: number,
  ) {
    const userId = auth._id;
    return this.chatService.getProjectMessages(projectId, userId, limit);
  }
}
