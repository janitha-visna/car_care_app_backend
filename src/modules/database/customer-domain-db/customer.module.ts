import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './customer.entity';
import { CustomerPhoneNumber } from './customer-phone-number.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, CustomerPhoneNumber])],
  exports: [TypeOrmModule],
})
export class CustomerModule {}
