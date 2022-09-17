import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsString,
  IsUrl,
  MaxDate,
} from 'class-validator';
export class AerolineaDto {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  readonly descripcion: string;

  @IsNotEmpty()
  @Type(() => Date)
  @MaxDate(new Date())
  readonly fecha_fundacion: string;

  @IsUrl()
  @IsNotEmpty()
  readonly pagina_web: string;
}
