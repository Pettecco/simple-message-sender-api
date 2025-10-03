import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs/promises';

jest.mock('fs/promises'); // Mocka o módulo fs

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepository: Repository<User>;
  let hashingService: HashingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            save: jest.fn(),
            create: jest.fn(),
            findOneBy: jest.fn(),
            find: jest.fn(),
            preload: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: HashingService,
          useValue: {
            hash: jest.fn(),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    hashingService = module.get<HashingService>(HashingService);
  });

  it('usersService should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        email: 'luiz@email.com',
        name: 'Luiz',
        password: '123456',
      };
      const passwordHash = 'HASHDESENHA';
      const newUser = {
        id: 1,
        name: createUserDto.name,
        email: createUserDto.email,
        passwordHash,
      };

      jest.spyOn(hashingService, 'hash').mockResolvedValue(passwordHash);
      jest.spyOn(userRepository, 'create').mockReturnValue(newUser as any);
      jest.spyOn(userRepository, 'save').mockResolvedValue(newUser as any);

      // Act
      const result = await usersService.create(createUserDto);

      expect(hashingService.hash).toHaveBeenCalledWith(createUserDto.password);

      expect(userRepository.create).toHaveBeenCalledWith({
        name: createUserDto.name,
        passwordHash,
        email: createUserDto.email,
      });

      expect(userRepository.save).toHaveBeenCalledWith(newUser);

      expect(result).toEqual(newUser);
    });

    it('should throw ConflictException when email already exists', async () => {
      jest.spyOn(userRepository, 'save').mockRejectedValue({
        code: '23505',
      });

      await expect(usersService.create({} as any)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw a generic error when an error is thrown', async () => {
      jest
        .spyOn(userRepository, 'save')
        .mockRejectedValue(new Error('Generic error'));

      await expect(usersService.create({} as any)).rejects.toThrow(
        new Error('Generic error'),
      );
    });
  });

  describe('findOne', () => {
    it('should return a user if the user is found', async () => {
      const userId = 1;
      const userFound = {
        id: userId,
        name: 'Luiz',
        email: 'luiz@email.com',
        passwordHash: '123456',
      };

      jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValue(userFound as any);

      const result = await usersService.findOne(userId);

      expect(result).toEqual(userFound);
    });

    it('should throw an error if the user is not found', async () => {
      await expect(usersService.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const usersMock: User[] = [
        {
          id: 1,
          name: 'Luiz',
          email: 'luiz@email.com',
          passwordHash: '123456',
        } as User,
      ];

      jest.spyOn(userRepository, 'find').mockResolvedValue(usersMock);

      const result = await usersService.findAll();

      expect(result).toEqual(usersMock);
      expect(userRepository.find).toHaveBeenCalledWith({
        order: {
          id: 'DESC',
        },
      });
    });
  });

  describe('update', () => {
    it('should update a user if authorized', async () => {
      // Arrange
      const userId = 1;
      const updateUserDto = { name: 'Joana', password: '654321' };
      const tokenPayload = { sub: userId } as any;
      const passwordHash = 'HASHDESENHA';
      const updatedUser = { id: userId, name: 'Joana', passwordHash };

      jest.spyOn(hashingService, 'hash').mockResolvedValueOnce(passwordHash);
      jest
        .spyOn(userRepository, 'preload')
        .mockResolvedValue(updatedUser as any);
      jest.spyOn(userRepository, 'save').mockResolvedValue(updatedUser as any);

      // Act
      const result = await usersService.update(
        userId,
        updateUserDto,
        tokenPayload,
      );

      // Assert
      expect(hashingService.hash).toHaveBeenCalledWith(updateUserDto.password);
      expect(userRepository.preload).toHaveBeenCalledWith({
        id: userId,
        name: updateUserDto.name,
        password: updateUserDto.password,
        passwordHash,
      });
      expect(userRepository.save).toHaveBeenCalledWith(updatedUser);
      expect(result).toEqual(updatedUser);
    });

    it('should throw ForbiddenException if user not authorized', async () => {
      // Arrange
      const userId = 1;
      const tokenPayload = { sub: 2 } as any;
      const updateUserDto = { name: 'Jane Doe' };
      const existingUser = { id: userId, name: 'John Doe' };

      jest
        .spyOn(userRepository, 'preload')
        .mockResolvedValue(existingUser as any);

      await expect(
        usersService.update(userId, updateUserDto, tokenPayload),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException if the user does not exist', async () => {
      // Arrange
      const userId = 1;
      const tokenPayload = { sub: userId } as any;
      const updateUserDto = { name: 'Jane Doe' };

      jest.spyOn(userRepository, 'preload').mockResolvedValue(null);

      // Act e Assert
      await expect(
        usersService.update(userId, updateUserDto, tokenPayload),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a user if authorized', async () => {
      // Arrange
      const userId = 1;
      const tokenPayload = { sub: userId } as any;
      const existingUser = { id: userId, name: 'John Doe' };

      jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValue(existingUser as any);
      jest
        .spyOn(userRepository, 'remove')
        .mockResolvedValue(existingUser as any);

      // Act
      const result = await usersService.remove(userId, tokenPayload);

      // Assert
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: userId });
      expect(userRepository.remove).toHaveBeenCalledWith(existingUser);

      expect(result).toEqual(existingUser);
    });

    it('should throw ForbiddenException if not authorized', async () => {
      // Arrange
      const userId = 1;
      const tokenPayload = { sub: 2 } as any;
      const existingUser = { id: userId, name: 'John Doe' };

      jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValue(existingUser as any);

      await expect(usersService.remove(userId, tokenPayload)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw NotFoundException if the user is not found', async () => {
      const userId = 1;
      const tokenPayload = { sub: userId } as any;

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

      await expect(usersService.remove(userId, tokenPayload)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('uploadPicture', () => {
    it('should save the image correctly and update the user', async () => {
      // Arrange
      const mockFile = {
        originalname: 'test.png',
        size: 2000,
        buffer: Buffer.from('file content'),
      } as Express.Multer.File;

      const mockUser = {
        id: 1,
        name: 'Luiz',
        email: 'luiz@email.com',
      } as User;

      const tokenPayload = { sub: 1 } as any;

      jest.spyOn(usersService, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(userRepository, 'save').mockResolvedValue({
        ...mockUser,
        picture: '1.png',
      });

      const filePath = path.resolve(process.cwd(), 'pictures', '1.png');

      // Act
      const result = await usersService.uploadPicture(mockFile, tokenPayload);

      // Assert
      expect(fs.writeFile).toHaveBeenCalledWith(filePath, mockFile.buffer);
      expect(userRepository.save).toHaveBeenCalledWith({
        ...mockUser,
        picture: '1.png',
      });
      expect(result).toEqual({
        ...mockUser,
        picture: '1.png',
      });
    });

    it('should throw BadRequestException if the file is too small', async () => {
      // Arrange
      const mockFile = {
        originalname: 'test.png',
        size: 500, // Menor que 1024 bytes
        buffer: Buffer.from('small content'),
      } as Express.Multer.File;

      const tokenPayload = { sub: 1 } as any;

      // Act & Assert
      await expect(
        usersService.uploadPicture(mockFile, tokenPayload),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if the user is not found', async () => {
      // Arrange
      const mockFile = {
        originalname: 'test.png',
        size: 2000,
        buffer: Buffer.from('file content'),
      } as Express.Multer.File;

      const tokenPayload = { sub: 1 } as any;

      jest
        .spyOn(usersService, 'findOne')
        .mockRejectedValue(new NotFoundException());

      // Act & Assert
      await expect(
        usersService.uploadPicture(mockFile, tokenPayload),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
