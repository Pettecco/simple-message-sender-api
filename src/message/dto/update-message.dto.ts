import { PartialType } from '@nestjs/mapped-types';
import { CreateMessageDTO } from './create-message.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateMessageDTO extends PartialType(CreateMessageDTO) {
  @IsBoolean()
  @IsOptional()
  readonly isRead?: boolean;
}
