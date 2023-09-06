import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ICategory } from './interface/category.interface';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel("categories") private CategoryModel:Model<ICategory>,
  ){}

  //Create a category
  async createCategory(createCategoryDto: CreateCategoryDto): Promise<ICategory> {
    const newCategory = await new this.CategoryModel(createCategoryDto);
    return newCategory.save();
  }

  //get all categories 

  async getAllCategories():Promise<ICategory[]> {
    const categoriesData = await this.CategoryModel.find().populate("products").select('-__v')
    if (!categoriesData || categoriesData.length==0){
      throw new NotFoundException('Categories data not found!');
    }
    return categoriesData;
  }
 //get one category per ID
async findCategory(categoryId: string): Promise<ICategory> {
  const existingCategory = await this.CategoryModel.findById(categoryId).exec();
  if (!existingCategory){
    throw new NotFoundException(`Category ${categoryId} does not exist!`)
  }
    return existingCategory;
  }

  //Update Category

  async updateCategory(categoryId: string, updateCategoryDto: UpdateCategoryDto):Promise<ICategory> {
    const existingCategory = await this.CategoryModel.findByIdAndUpdate(categoryId,updateCategoryDto,{new : true},);
    if(!existingCategory){
      throw new NotFoundException (`Category #${categoryId} not found`)
    }
    return existingCategory;
    }
//delete category
   async removeCategory(categoryId: string): Promise<ICategory> {
    const deleteCategory = await this.CategoryModel.findByIdAndDelete(categoryId);
    if (!deleteCategory){
      throw new NotFoundException (`Category #${categoryId} not found`)
    }
    return deleteCategory;
  }
}
