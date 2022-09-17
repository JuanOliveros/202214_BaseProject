import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
export class AeropuertoDto {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsString()
  @MaxLength(3)
  @IsNotEmpty()
  readonly codigo: string;

  @IsString()
  @IsNotEmpty()
  readonly pais: string;

  @IsString()
  @IsNotEmpty()
  readonly ciudad: string;
}
