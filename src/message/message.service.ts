import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Message } from './entities/message.entity';
import { CreateMessageDTO } from './dto/create-message.dto';
import { UpdateMessageDTO } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { PaginationDTO } from 'src/common/dto/pagination.dto';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly usersService: UsersService,
  ) {}

  throwNotFoundError() {
    throw new NotFoundException('message not found');
  }

  findAll(pagination: PaginationDTO) {
    const { limit = 10, offset } = pagination;

    return this.messageRepository.find({
      take: limit, // quantos registros serão exibidos por página
      skip: offset, // quantos registros devem ser pulados
      relations: ['from', 'to'],
      order: {
        id: 'DESC',
      },
      select: {
        from: {
          id: true,
          name: true,
        },
        to: {
          id: true,
          name: true,
        },
      },
    });
  }

  async findOne(id: number) {
    const message = await this.messageRepository.findOne({
      where: { id },
      relations: ['from', 'to'],
      select: {
        from: {
          id: true,
          name: true,
        },
        to: {
          id: true,
          name: true,
        },
      },
    });

    if (message) return message;

    this.throwNotFoundError();
  }

  async create(
    createMessageDto: CreateMessageDTO,
    tokenPayload: TokenPayloadDto,
  ) {
    const { toId, content } = createMessageDto;

    const fromUser = await this.usersService.findOne(tokenPayload.sub);
    const toUser = await this.usersService.findOne(toId);

    const newMessage = {
      content,
      from: fromUser,
      to: toUser,
      isRead: false,
      date: new Date(),
    };

    const message = this.messageRepository.create(newMessage);
    this.messageRepository.save(message);

    return {
      ...message,
      from: {
        id: message.from.id,
        name: message.from.name,
      },
      to: {
        id: message.to.id,
        name: message.to.name,
      },
    };
  }

  async update(
    id: number,
    updateMessageDto: UpdateMessageDTO,
    tokenPayload: TokenPayloadDto,
  ) {
    const message = await this.messageRepository.findOneBy({ id });

    if (message.from.id !== tokenPayload.sub) {
      throw new ForbiddenException('Esse recadi não é seu');
    }

    message.content = updateMessageDto?.content ?? message.content;
    message.isRead = updateMessageDto?.isRead ?? message.isRead;

    this.messageRepository.save(message);
    return message;
  }

  async remove(id: number, tokenPayload: TokenPayloadDto) {
    const message = await this.messageRepository.findOneBy({ id });

    if (message.from.id !== tokenPayload.sub) {
      throw new ForbiddenException('Esse recado não é seu');
    }

    if (!message) {
      return this.throwNotFoundError();
    }

    return this.messageRepository.remove(message);
  }
}
