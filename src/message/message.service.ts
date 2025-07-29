import { Injectable, NotFoundException } from '@nestjs/common';
import { Message } from './entities/message.entity';
import { CreateMessageDTO } from './dto/create-message.dto';
import { UpdateMessageDTO } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  throwNotFoundError() {
    throw new NotFoundException('message not found');
  }

  findAll() {
    return this.messageRepository.find();
  }

  async findOne(id: number) {
    const message = await this.messageRepository.findOneBy({ id });

    if (message) return message;

    this.throwNotFoundError();
  }

  async create(createMessageDto: CreateMessageDTO) {
    const newMessage = {
      ...createMessageDto,
      isRead: false,
      date: new Date(),
    };

    const message = await this.messageRepository.create(newMessage);

    return this.messageRepository.save(message);
  }

  async update(id: number, updateMessageDto: UpdateMessageDTO) {
    const partialUpdatedMessageDTO = {
      isRead: updateMessageDto?.isRead,
      content: updateMessageDto?.content,
    };

    const message = await this.messageRepository.preload({
      id,
      ...partialUpdatedMessageDTO,
    });

    if (!message) return this.throwNotFoundError();

    return this.messageRepository.save(message);
  }

  async remove(id: number) {
    const message = await this.messageRepository.findOneBy({ id });

    if (!message) {
      return this.throwNotFoundError();
    }

    return this.messageRepository.remove(message);
  }
}
