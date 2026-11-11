import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeterReading } from './meter-reading.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MeterReading])],
  exports: [TypeOrmModule],
})
export class MeterReadingModule {}
