import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRespository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const userData = {
        name: createUserDto.name,
        email: createUserDto.email,
        passwordHash: createUserDto.password, // no momento sem criptografia
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

  async update(id: number, updateUserDto: UpdateUserDto) {
    const userData = {
      name: updateUserDto?.name,
      password: updateUserDto?.password,
    };

    const user = await this.userRespository.preload({
      id,
      ...userData,
    });

    if (!user) throw new NotFoundException('Usuário não encontrado');

    return this.userRespository.save(user);
  }

  async remove(id: number) {
    const user = await this.userRespository.findOneBy({ id });

    if (!user) throw new NotFoundException('Usuário não encontrado');

    return this.userRespository.remove(user);
  }
}
