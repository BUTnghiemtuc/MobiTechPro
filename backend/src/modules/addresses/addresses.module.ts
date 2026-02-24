import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressesController } from '../addresses/4controllers/addresses.controller';
import { AddressesService } from '../addresses/2services/addresses.service';
import { Address } from '../addresses/1models/addresses.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Address])],
  controllers: [AddressesController],
  providers: [AddressesService],
  exports: [AddressesService],
})
export class AddressesModule {}
