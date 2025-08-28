import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { HashingService } from './hashing/hashing.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOneBy({
      email: loginDto.email,
    });

    if (!user) {
      throw new UnauthorizedException('Esse usuário não existe');
    }

    const isPasswordValid = await this.hashingService.compare(
      loginDto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Senha inválida');
    }

    return {
      message: 'Usuário logado!',
    };
  }
}
