import {Schema,model,ObjectId} from 'mongoose';

const categorySchema=new Schema({
    name:{
        type:String,
        required:true,
    },
    user:{
        type:[ObjectId],
        ref:'User',
        required:true,
    }
})

const Category=model('Category',categorySchema);

export default Category;