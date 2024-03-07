import { CreateUserDto } from './create-user.dto';
import { Exclude } from 'class-transformer';
import { OmitType } from '@nestjs/swagger';

export class UpdateUserDto extends OmitType(CreateUserDto, [
  'username',
] as const) {
  @Exclude()
  password: string;
}
