import { forwardRef, Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { UsersModule } from 'src/users/users.module';
import { MessageUtils } from './message.utils';

@Module({
  imports: [TypeOrmModule.forFeature([Message]), forwardRef(() => UsersModule)],
  controllers: [MessageController],
  providers: [
    MessageService,
    {
      provide: MessageUtils, // Token
      // useValue: new MessageUtilsMock(), // Valor a ser usado
      useClass: MessageUtils,
    },
  ],
  exports: [
    {
      provide: MessageUtils,
      useClass: MessageUtils,
    },
  ],
})
export class MessageModule {}
