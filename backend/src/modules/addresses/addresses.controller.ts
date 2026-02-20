import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Address } from './addresses.entity';

@Controller('addresses')
@UseGuards(JwtAuthGuard)
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Get()
  findAll(@Request() req): Promise<Address[]> {
    return this.addressesService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req): Promise<Address> {
    return this.addressesService.findOne(+id, req.user.userId);
  }

  @Post()
  create(@Request() req, @Body() createAddressDto: Partial<Address>): Promise<Address> {
    return this.addressesService.create(req.user, createAddressDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateAddressDto: Partial<Address>,
  ): Promise<Address> {
    return this.addressesService.update(+id, req.user.userId, updateAddressDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req): Promise<{ message: string }> {
    await this.addressesService.remove(+id, req.user.userId);
    return { message: 'Address deleted successfully' };
  }

  @Post(':id/default')
  setDefault(@Param('id') id: string, @Request() req): Promise<Address> {
    return this.addressesService.setDefault(+id, req.user.userId);
  }
}
