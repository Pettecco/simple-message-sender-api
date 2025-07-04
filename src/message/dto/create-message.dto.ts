import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateMessageDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(255)
  readonly content: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  readonly from: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  readonly to: string;
}
