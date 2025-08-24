import { forwardRef, Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { UsersModule } from 'src/users/users.module';
import { MessageUtils } from './message.utils';
import { RemoveSpacesRegex } from 'src/common/regex/remove-spaces.regex';
import { OnlyLowerCaseLettersRegex } from 'src/common/regex/only-lowercase-letters.regex';
import {
  ONLY_LOWERCASE_LETTERS_REGEX,
  REMOVE_SPACES_REGEX,
} from './message.contants';

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
    {
      provide: ONLY_LOWERCASE_LETTERS_REGEX,
      useClass: OnlyLowerCaseLettersRegex,
    },
    {
      provide: REMOVE_SPACES_REGEX,
      useClass: RemoveSpacesRegex,
    },
  ],
})
export class MessageModule {}
