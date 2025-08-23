import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDTO } from './dto/create-message.dto';
import { UpdateMessageDTO } from './dto/update-message.dto';
import { PaginationDTO } from 'src/common/dto/pagination.dto';
import { MessageUtils } from './message.utils';

// CRUD
// Create -> POST -> Criar um recado
// Read -> GET -> Ler todos os recados
// Read -> GET -> Ler apenas um recado
// Update -> PATCH / PUT -> Atualizar um recado
// Delete -> DELETE -> Apagar um recado

// PATCH é utilizado para atualizar dados de um recurso
// PUT é utilizado para atualizar um recurso inteiro

// DTO - Data Transfer Object -> Objeto de transferência de dados
// DTO -> Objeto simples -> Validar dados / Transformar dados
@Controller('message')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly messageUtils: MessageUtils,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  findAll(@Query() pagination: PaginationDTO) {
    console.log(this.messageUtils.revertString('Petterson'));
    return this.messageService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.messageService.findOne(id);
  }

  @Post()
  create(@Body() createMessageDto: CreateMessageDTO) {
    return this.messageService.create(createMessageDto);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateMessageDto: UpdateMessageDTO) {
    return this.messageService.update(id, updateMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.messageService.remove(id);
  }
}
