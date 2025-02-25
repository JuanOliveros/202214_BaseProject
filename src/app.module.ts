import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AerolineaModule } from './aerolinea/aerolinea.module';
import { AeropuertoModule } from './aeropuerto/aeropuerto.module';
import { AerolineaEntity } from './aerolinea/aerolinea.entity';
import { AeropuertoEntity } from './aeropuerto/aeropuerto.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AerolineaAeropuertoModule } from './aerolinea-aeropuerto/aerolinea-aeropuerto.module';

@Module({
  imports: [
    AerolineaModule,
    AeropuertoModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'aerolinea',
      entities: [AerolineaEntity, AeropuertoEntity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
    }),
    AerolineaAeropuertoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
