import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Part } from './part.entity';
import { Component } from './component.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Part, Component])],
  exports: [TypeOrmModule],
})
export class PartModule {}
