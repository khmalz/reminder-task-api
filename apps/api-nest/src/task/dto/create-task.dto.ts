import { ArrayNotEmpty, IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsCuid } from 'src/common/validators/is-custom-cuid.constraint';

export class CreateTaskDto {
   @IsString()
   @IsNotEmpty()
   title: string;

   @IsBoolean()
   @IsOptional()
   isCompleted?: boolean;

   @IsArray()
   @ArrayNotEmpty()
   @IsCuid({ each: true })
   categoryIds: string[];
}
