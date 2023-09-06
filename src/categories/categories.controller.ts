import { Controller, Get, Post, Body, Patch, Param, Delete,Res, HttpStatus,UseInterceptors, UploadedFile, Put } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('categorie')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination:"./upload/Categories",
        filename:(request, file, callback) =>
        callback(null,`${new Date().getTime()}-${file.originalname}`),
      }),
    }),
  )
  async createCategory(@Res() response, @Body() createCategoryDto: CreateCategoryDto, @UploadedFile() file:Express.Multer.File,) {
    try{
      createCategoryDto.image= file.filename;
      const newCategory = await this.categoriesService.createCategory(createCategoryDto);
      return response.status(HttpStatus.CREATED).json({
        message: "Category has been created successfull",
        status: HttpStatus.CREATED,
        data: newCategory,
      });
    } catch (err){
      return response.status(HttpStatus.BAD_REQUEST).json({
        status: 400,
        message: 'Error : Category not created!' + err,
        data: null,
      });
    }
  }

  @Get()
  async findAllCategories(@Res() response) {
    try{
      const categoriesData = await this.categoriesService.getAllCategories();
      return response.status(HttpStatus.OK).json({
        message: 'All Categories fetched successfully!!',
        status: HttpStatus.OK,
        data: categoriesData,
      });
    } catch (err){
      return response.status(err.status).json({
        message: err.response,
        status: HttpStatus.BAD_REQUEST,
        data: null,
      });
    }
  }

  @Get('/:id')
  async findOneCategory(@Res() response, @Param('id') categoryId: string) {
    try {
      const existingCategory = await this.categoriesService.findCategory(categoryId);
      return response.status(HttpStatus.OK).json({
        message: 'Category found',
        data: existingCategory,
        status: HttpStatus.OK,
      });
    } catch (err){
      return response.status(err.status).json({
        message: err.response,
        status: HttpStatus.BAD_REQUEST,
        data: null,
      });
    }
  }

  @Put('/:id')
  @UseInterceptors(
    FileInterceptor('file',{
      storage: diskStorage({
        destination:'./upload/Categories',
        filename:(request,file,callback)=>
        callback(null,`${new Date().getTime()}-${file.originalname}`),
      }),
    }),
  )
  async updateCategory(@Res() response, @Param('id') categoryId: string, @Body() updateCategoryDto: UpdateCategoryDto, @UploadedFile() file:Express.Multer.File,) {
    try{
      if (file==undefined || file ==null){
        updateCategoryDto.image = (await(this.categoriesService.findCategory(categoryId))).image
        const existingCategory = await this.categoriesService.updateCategory(categoryId,updateCategoryDto)
        return response.status(HttpStatus.OK).json({
        message: 'updated Successfully!',
        data: existingCategory,
        status:HttpStatus.OK,
      });
    } else{
      updateCategoryDto.image= file.filename;
      const existingCategory=await this.categoriesService.updateCategory(categoryId,updateCategoryDto);
      return response.status(HttpStatus.OK).json({
        message: 'updated Successfully!',
        data: existingCategory,
        status: HttpStatus.OK,
      });
    }
} catch(err){
  return response.status(err.status).json({
    message: err.response,
    status: HttpStatus.BAD_REQUEST,
    data: null,
  });
 }
 }
 //Delete Category
  @Delete('/:id')
  async removeCategory(@Res() response,@Param('id') categoryId: string) {
   try{
    const deletedCategory  =(await this.categoriesService.removeCategory(categoryId));
    return response.status(HttpStatus.OK).json({
      message: 'Deleted successfully',
      status: HttpStatus.OK,
      data: deletedCategory,
    });
   } catch(err){
    return response.status(HttpStatus.BAD_REQUEST).json({
      message: err.response,
      status: HttpStatus.BAD_REQUEST,
      data:null,
    });
   }
  }
}
