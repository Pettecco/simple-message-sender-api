import { Injectable, NotFoundException } from '@nestjs/common';
import { Message } from './entities/message.entity';
import { CreateMessageDTO } from './dto/create-message.dto';
import { UpdateMessageDTO } from './dto/update-message.dto';

@Injectable()
export class MessageService {
  private lastId = 1;
  private messages: Message[] = [
    {
      id: 1,
      content: 'Este é um recado de teste',
      from: 'Joana',
      to: 'João',
      isRead: false,
    },
  ];

  throwNotFoundError() {
    throw new NotFoundException('message not found');
  }

  findAll() {
    return this.messages;
  }

  findOne(id: number) {
    const message = this.messages.find((item) => item.id === id);

    if (message) return message;

    this.throwNotFoundError();
  }

  create(createMessageDto: CreateMessageDTO) {
    this.lastId++;

    const id = this.lastId;
    const newMessage = {
      id,
      ...createMessageDto,
      isRead: false,
      date: new Date(),
    };

    this.messages.push(newMessage);
    return newMessage;
  }

  update(id: string, updateMessageDto: UpdateMessageDTO) {
    const existentMessageIndex = this.messages.findIndex(
      (item) => item.id === Number(id),
    );

    if (existentMessageIndex < 0) {
      this.throwNotFoundError();
    }

    const existentMessage = this.messages[existentMessageIndex];

    this.messages[existentMessageIndex] = {
      ...existentMessage,
      ...updateMessageDto,
    };

    return this.messages[existentMessageIndex];
  }

  remove(id: number) {
    const existentMessageIndex = this.messages.findIndex(
      (item) => item.id === id,
    );

    if (existentMessageIndex < 0) {
      this.throwNotFoundError();
    }

    const message = this.messages[existentMessageIndex];

    this.messages.splice(existentMessageIndex, 1);

    return message;
  }
}
