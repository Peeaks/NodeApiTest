import { IsString, IsNumber } from 'class-validator'

class CreateProductDto {
  @IsString()
  public name: string

  @IsString()
  public description: string

  @IsNumber()
  public price: number

  @IsString()
  public category: string
}

export default CreateProductDto
