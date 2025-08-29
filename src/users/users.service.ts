import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRespository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const passwordHash = await this.hashingService.hash(
        createUserDto.password,
      );

      const userData = {
        name: createUserDto.name,
        email: createUserDto.email,
        passwordHash,
      };

      const newUser = this.userRespository.create(userData);
      return await this.userRespository.save(newUser);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('E-mail já cadastrado');
      }
      throw error;
    }
  }

  async findAll() {
    const users = await this.userRespository.find({
      order: {
        id: 'DESC',
      },
    });
    return users;
  }

  async findOne(id: number) {
    const user = await this.userRespository.findOneBy({ id });

    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    tokenPayload: TokenPayloadDto,
  ) {
    const userData = {
      name: updateUserDto?.name,
      password: updateUserDto?.password,
    };

    if (updateUserDto?.password) {
      const passwordHash = await this.hashingService.hash(
        updateUserDto.password,
      );

      userData['passwordHash'] = passwordHash;
    }

    const user = await this.userRespository.preload({
      id,
      ...userData,
    });

    if (!user) throw new NotFoundException('Usuário não encontrado');

    if (user.id !== tokenPayload.sub) {
      throw new ForbiddenException('Você não é essa usuário.');
    }

    return this.userRespository.save(user);
  }

  async remove(id: number, tokenPayload: TokenPayloadDto) {
    const user = await this.userRespository.findOneBy({ id });

    if (!user) throw new NotFoundException('Usuário não encontrado');

    if (user.id !== tokenPayload.sub) {
      throw new ForbiddenException('Você não é essa usuário.');
    }

    return this.userRespository.remove(user);
  }
}
