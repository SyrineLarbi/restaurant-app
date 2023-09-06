import { IsString,IsNotEmpty } from "class-validator";

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    readonly name:string;
   
    @IsString()
    @IsNotEmpty()
    image: string;
}
