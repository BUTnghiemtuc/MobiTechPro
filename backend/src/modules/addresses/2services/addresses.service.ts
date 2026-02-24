import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from '../1models/addresses.entity';
import { User } from '../../users/1models/users.entity';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address)
    private addressesRepository: Repository<Address>,
  ) {}

  async findAll(userId: number): Promise<Address[]> {
    return this.addressesRepository.find({
      where: { user: { id: userId } },
      order: { isDefault: 'DESC', created_at: 'DESC' },
    });
  }

  async findOne(id: number, userId: number): Promise<Address> {
    const address = await this.addressesRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    return address;
  }

  async create(user: User, createAddressDto: Partial<Address>): Promise<Address> {
    const address = this.addressesRepository.create({
      ...createAddressDto,
      user,
    });

    // If this is set as default, unset other defaults
    if (address.isDefault) {
      await this.unsetOtherDefaults(user.id);
    }

    return this.addressesRepository.save(address);
  }

  async update(id: number, userId: number, updateAddressDto: Partial<Address>): Promise<Address> {
    const address = await this.findOne(id, userId);

    // If updating to default, unset other defaults
    if (updateAddressDto.isDefault && !address.isDefault) {
      await this.unsetOtherDefaults(userId);
    }

    Object.assign(address, updateAddressDto);
    return this.addressesRepository.save(address);
  }

  async remove(id: number, userId: number): Promise<void> {
    const address = await this.findOne(id, userId);
    await this.addressesRepository.remove(address);
  }

  async setDefault(id: number, userId: number): Promise<Address> {
    const address = await this.findOne(id, userId);

    // Unset other defaults
    await this.unsetOtherDefaults(userId);

    // Set this as default
    address.isDefault = true;
    return this.addressesRepository.save(address);
  }

  private async unsetOtherDefaults(userId: number): Promise<void> {
    await this.addressesRepository.update(
      { user: { id: userId }, isDefault: true },
      { isDefault: false },
    );
  }
}
