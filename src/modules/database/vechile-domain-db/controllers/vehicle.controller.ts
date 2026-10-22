import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import {
  VehicleLookupResponse,
  VehicleLookupService,
} from '../services/vehicle-lookup.service';
import { LookupVehicleQueryDto } from '../dto/lookup-vehicle-query.dto';

@Controller('vehicles')
export class VehicleController {
  constructor(private readonly vehicleLookupService: VehicleLookupService) {}

  /**
   * GET /vehicles/lookup?plate={plate}
   * Searches by license plate prefix and returns { isRegistered, exactMatch, suggestions }.
   * If exactMatch is found, auto-fills category, vehicleType, customer, phoneNumbers, and service prices.
   */
  @Get('lookup')
  @HttpCode(HttpStatus.OK)
  async lookupVehicle(
    @Query() query: LookupVehicleQueryDto,
  ): Promise<VehicleLookupResponse> {
    return this.vehicleLookupService.lookupByPlate(query.plate);
  }
}
