import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class MenuItemIngredientDto {
  @IsString()
  @IsNotEmpty()
  inventoryItemId!: string;

  @IsNumber()
  @Min(0.01)
  quantity!: number;
}

export class SetMenuItemIngredientsDto {
  @IsArray()
  @ArrayMinSize(0)
  @ValidateNested({ each: true })
  @Type(() => MenuItemIngredientDto)
  ingredients!: MenuItemIngredientDto[];
}
