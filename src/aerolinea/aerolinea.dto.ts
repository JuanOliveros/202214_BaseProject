import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
export class AerolineaDto {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  readonly descripcion: string;

  @IsString()
  @IsNotEmpty()
  readonly fecha_fundacion: string;

  @IsUrl()
  @IsNotEmpty()
  readonly pagina_web: string;
}
