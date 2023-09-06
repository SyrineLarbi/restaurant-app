import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, SchemaTypes, Types } from "mongoose";

@Schema({timestamps:true})
export class Category extends Document {
    @Prop({required:true, unique:true })
    name : string;
   
    @Prop({required: true})
    image: string;
   
    // @Prop([{type :SchemaTypes.ObjectId, ref:"Products"}])
    // products:Types.ObjectId[];
}
//to add images and Products


export const CategorySchema = SchemaFactory.createForClass(Category);