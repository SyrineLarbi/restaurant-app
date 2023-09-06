import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { MongooseModule } from '@nestjs/mongoose';



@Module({
  imports: [
    MongooseModule.forRoot('mongodb://0.0.0.0:27017/RestaurantApp'),
    CategoriesModule, ProductsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
