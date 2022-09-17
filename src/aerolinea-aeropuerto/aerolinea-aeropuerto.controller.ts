import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AeropuertoDto } from '../aeropuerto/aeropuerto.dto';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';

@Controller('aerolineas')
export class AerolineaAeropuertoController {
  constructor(
    private readonly aerolineaAeropuertoService: AerolineaAeropuertoService,
  ) {}

  @Post(':aerolineaId/aeropuertos/:aeropuertoId')
  async addAirportToAirline(
    @Param('aerolineaId') aerolineaId: string,
    @Param('aeropuertoId') aeropuertoId: string,
  ) {
    return await this.aerolineaAeropuertoService.addAirportToAirline(
      aerolineaId,
      aeropuertoId,
    );
  }

  @Get(':aerolineaId/aeropuertos/:aeropuertoId')
  async findAirportFromAirline(
    @Param('aerolineaId') aerolineaId: string,
    @Param('aeropuertoId') aeropuertoId: string,
  ) {
    return await this.aerolineaAeropuertoService.findAirportFromAirline(
      aerolineaId,
      aeropuertoId,
    );
  }

  @Get(':aerolineaId/aeropuertos')
  async findAirportsFromAirline(@Param('aerolineaId') aerolineaId: string) {
    return await this.aerolineaAeropuertoService.findAirportsFromAirline(
      aerolineaId,
    );
  }

  @Put(':aerolineaId/aeropuertos')
  async updateAirportsFromAirline(
    @Body() aeropuertosDto: AeropuertoDto[],
    @Param('aerolineaId') aerolineaId: string,
  ) {
    const aeropuertos = plainToInstance(AeropuertoEntity, aeropuertosDto);
    return await this.aerolineaAeropuertoService.updateAirportsFromAirline(
      aerolineaId,
      aeropuertos,
    );
  }

  @Delete(':aerolineaId/aeropuertos/:aeropuertoId')
  @HttpCode(204)
  async deleteAirportFromAirline(
    @Param('aerolineaId') aerolineaId: string,
    @Param('aeropuertoId') aeropuertoId: string,
  ) {
    return await this.aerolineaAeropuertoService.deleteAirportFromAirline(
      aeropuertoId,
      aeropuertoId,
    );
  }
}
