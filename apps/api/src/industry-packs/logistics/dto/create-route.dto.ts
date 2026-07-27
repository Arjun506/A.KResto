import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsArray } from 'class-validator';

export class CreateRouteDto {
  @ApiProperty({ example: 'vehicle_id_123' })
  @IsString()
  @IsNotEmpty()
  vehicleId: string;

  @ApiProperty({ example: 'driver_employee_id_123' })
  @IsString()
  @IsNotEmpty()
  driverEmployeeId: string;

  @ApiProperty({ example: ['shipment_id_1', 'shipment_id_2'] })
  @IsArray()
  shipmentIds: string[];
}
