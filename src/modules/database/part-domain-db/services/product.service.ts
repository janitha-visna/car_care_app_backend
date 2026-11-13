import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Component } from '../component.entity';
import { MeasurementType } from '../part-measurement-option.entity';

export interface MeasurementOptionDto {
  id: number;
  type: MeasurementType;
  unit: string;
  allowDecimal: boolean;
}

export interface ProductBrandDto {
  id: number;
  name: string;
  measurementOptions: MeasurementOptionDto[];
}

export interface ProductDto {
  id: number;
  name: string;
  brands: ProductBrandDto[];
}

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Component)
    private readonly componentRepository: Repository<Component>,
  ) {}

  async getAllProducts(): Promise<ProductDto[]> {
    const components = await this.componentRepository.find({
      relations: {
        parts: {
          measurementOptions: true,
        },
      },
      order: {
        id: 'ASC',
        parts: {
          id: 'ASC',
          measurementOptions: {
            id: 'ASC',
          },
        },
      },
    });

    return components.map((component) => ({
      id: Number(component.id),
      name: component.name,
      brands: (component.parts ?? []).map((part) => ({
        id: Number(part.id),
        name: part.name,
        measurementOptions: (part.measurementOptions ?? []).map((option) => ({
          id: Number(option.id),
          type: option.type,
          unit: option.unit,
          allowDecimal: option.allowDecimal,
        })),
      })),
    }));
  }
}
