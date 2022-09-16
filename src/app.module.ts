import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MuseumModule } from './museum/museum.module';
import { AerolineaModule } from './aerolinea/aerolinea.module';
import { AeropuertoModule } from './aeropuerto/aeropuerto.module';

@Module({
  imports: [MuseumModule, AerolineaModule, AeropuertoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
