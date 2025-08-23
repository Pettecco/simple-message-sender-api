import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { UsersModule } from 'src/users/users.module';
import { MessageUtils } from './message.utils';

@Module({
  imports: [TypeOrmModule.forFeature([Message]), UsersModule],
  controllers: [MessageController],
  providers: [
    MessageService,
    {
      provide: MessageUtils,
      useClass: MessageUtils,
    },
  ],
})
export class MessageModule {}
