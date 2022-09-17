import { Test, TestingModule } from '@nestjs/testing';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import { Repository } from 'typeorm';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AerolineaAeropuertoService', () => {
  let service: AerolineaAeropuertoService;
  let aerolineaRepository: Repository<AerolineaEntity>;
  let aeropuertoRepository: Repository<AeropuertoEntity>;
  let aerolinea: AerolineaEntity;
  let aeropuertosList: AeropuertoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AerolineaAeropuertoService],
    }).compile();

    service = module.get<AerolineaAeropuertoService>(
      AerolineaAeropuertoService,
    );
    aerolineaRepository = module.get<Repository<AerolineaEntity>>(
      getRepositoryToken(AerolineaEntity),
    );
    aeropuertoRepository = module.get<Repository<AeropuertoEntity>>(
      getRepositoryToken(AeropuertoEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    aeropuertoRepository.clear();
    aerolineaRepository.clear();

    aeropuertosList = [];
    for (let i = 0; i < 5; i++) {
      const aeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
        nombre: faker.company.name(),
        codigo: faker.phone.imei(),
        pais: faker.address.county(),
        ciudad: faker.address.city(),
      });
      aeropuertosList.push(aeropuerto);
    }
    aerolinea = await aerolineaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      fecha_fundacion: faker.date.past(),
      pagina_web: faker.internet.domainName(),
      aeropuertos: aeropuertosList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addAirportAirline should add an airport to a airline', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(),
      codigo: faker.phone.imei(),
      pais: faker.address.county(),
      ciudad: faker.address.city(),
    });

    const newAerolinea: AerolineaEntity = await aerolineaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      fecha_fundacion: faker.date.past(),
      pagina_web: faker.internet.domainName(),
    });

    const result: AerolineaEntity = await service.addAirportToAirline(
      newAerolinea.id,
      newAeropuerto.id,
    );

    expect(result.aeropuertos.length).toBe(1);
    expect(result.aeropuertos[0]).not.toBeNull();
    expect(result.aeropuertos[0].nombre).toBe(newAeropuerto.nombre);
    expect(result.aeropuertos[0].codigo).toBe(newAeropuerto.codigo);
    expect(result.aeropuertos[0].pais).toBe(newAeropuerto.pais);
    expect(result.aeropuertos[0].ciudad).toBe(newAeropuerto.ciudad);
  });

  it('addAirportAirline should thrown exception for an invalid airport', async () => {
    const newAerolinea: AerolineaEntity = await aerolineaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      fecha_fundacion: faker.date.past(),
      pagina_web: faker.internet.domainName(),
    });
    await expect(() =>
      service.addAirportToAirline(newAerolinea.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'El aeropuerto con el id dado no fue encontrado',
    );
  });

  it('addAirportAirline should throw an exception for an invalid airline', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(),
      codigo: faker.phone.imei(),
      pais: faker.address.county(),
      ciudad: faker.address.city(),
    });

    await expect(() =>
      service.addAirportToAirline('0', newAeropuerto.id),
    ).rejects.toHaveProperty(
      'message',
      'La aerolinea con el id dado no fue encontrado',
    );
  });

  it('findAirportsByAirlineIdAirportId should return airport by airline', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    const storedAeropuerto: AeropuertoEntity =
      await service.findAirportFromAirline(aerolinea.id, aeropuerto.id);
    expect(storedAeropuerto).not.toBeNull();
    expect(storedAeropuerto.nombre).toBe(aeropuerto.nombre);
    expect(storedAeropuerto.codigo).toBe(aeropuerto.codigo);
    expect(storedAeropuerto.pais).toBe(aeropuerto.pais);
    expect(storedAeropuerto.ciudad).toBe(aeropuerto.ciudad);
  });

  it('findAirportByAirlineIdAirportId should throw an exception for an invalid airport', async () => {
    await expect(() =>
      service.findAirportFromAirline(aerolinea.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'El aeropuerto con el id dado no fue encontrado',
    );
  });

  it('findAirportsByAirlineIdAirportId should throw an exception for an invalid airline', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    await expect(() =>
      service.findAirportFromAirline('0', aeropuerto.id),
    ).rejects.toHaveProperty(
      'message',
      'La aerolinea con el id dado no fue encontrado',
    );
  });

  it('findAirportsByAirlineIdAirportId should throw an exception for an airport not associated to the airline', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(),
      codigo: faker.phone.imei(),
      pais: faker.address.county(),
      ciudad: faker.address.city(),
    });

    await expect(() =>
      service.findAirportFromAirline(aerolinea.id, newAeropuerto.id),
    ).rejects.toHaveProperty(
      'message',
      'El aeropuerto con el id dado no esta asociado con la aerolina dada',
    );
  });

  it('findAirportsByAirlineId should return airports by airline', async () => {
    const aeropuertos: AeropuertoEntity[] =
      await service.findAirportsFromAirline(aerolinea.id);
    expect(aeropuertos.length).toBe(5);
  });

  it('findAirportsByAirlineId should throw an exception for an invalid Aiplane', async () => {
    await expect(() =>
      service.findAirportsFromAirline('0'),
    ).rejects.toHaveProperty(
      'message',
      'La aerolinea con el id dado no fue encontrado',
    );
  });

  it('associateAirportsAirline should update airports list for a airline', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(),
      codigo: faker.phone.imei(),
      pais: faker.address.county(),
      ciudad: faker.address.city(),
    });

    const updatedAerolinea: AerolineaEntity =
      await service.updateAirportsFromAirline(aerolinea.id, [newAeropuerto]);
    expect(updatedAerolinea.aeropuertos.length).toBe(1);

    expect(updatedAerolinea.aeropuertos[0].nombre).toBe(newAeropuerto.nombre);
    expect(updatedAerolinea.aeropuertos[0].codigo).toBe(newAeropuerto.codigo);
    expect(updatedAerolinea.aeropuertos[0].ciudad).toBe(newAeropuerto.ciudad);
    expect(updatedAerolinea.aeropuertos[0].pais).toBe(newAeropuerto.pais);
  });

  it('associateAeropuertoAirline should throw an exception for an invalid airline', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(),
      codigo: faker.phone.imei(),
      pais: faker.address.county(),
      ciudad: faker.address.city(),
    });

    await expect(() =>
      service.updateAirportsFromAirline('0', [newAeropuerto]),
    ).rejects.toHaveProperty(
      'message',
      'La aerolinea con el id dado no fue encontrado',
    );
  });

  it('associateAirportsAirline should throw an exception for an invalid airport', async () => {
    const newAeropuerto: AeropuertoEntity = aeropuertosList[0];
    newAeropuerto.id = '0';

    await expect(() =>
      service.updateAirportsFromAirline(aerolinea.id, [newAeropuerto]),
    ).rejects.toHaveProperty(
      'message',
      'El aeropuerto con el id dado no fue encontrado',
    );
  });

  it('deleteAirportoAirline should remove an airport from a airline', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];

    await service.deleteAirportFromAirline(aerolinea.id, aeropuerto.id);

    const storedAerolinea: AerolineaEntity = await aerolineaRepository.findOne({
      where: { id: aerolinea.id },
      relations: ['aeropuertos'],
    });
    const deletedAeropuerto: AeropuertoEntity =
      storedAerolinea.aeropuertos.find((a) => a.id === aeropuerto.id);

    expect(deletedAeropuerto).toBeUndefined();
  });

  it('deleteAirportoAirline should thrown an exception for an invalid airport', async () => {
    await expect(() =>
      service.deleteAirportFromAirline(aerolinea.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'El aeropuerto con el id dado no fue encontrado',
    );
  });

  it('deleteAirportoAirline should thrown an exception for an invalid airline', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    await expect(() =>
      service.deleteAirportFromAirline('0', aeropuerto.id),
    ).rejects.toHaveProperty(
      'message',
      'La aerolinea con el id dado no fue encontrado',
    );
  });

  it('deleteAirportoAirline should thrown an exception for an non asocciated aiport', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(),
      codigo: faker.phone.imei(),
      pais: faker.address.county(),
      ciudad: faker.address.city(),
    });

    await expect(() =>
      service.deleteAirportFromAirline(aerolinea.id, newAeropuerto.id),
    ).rejects.toHaveProperty(
      'message',
      'El aeropuerto con el id dado no esta asociado con la aerolina dada',
    );
  });
});
