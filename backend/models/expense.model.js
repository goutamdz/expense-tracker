import {Schema,model,ObjectId} from 'mongoose';

const expenseSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    amount:{
        type:Number,
        required:true,
    },
    date:{
        type:Date,
        required:true,
    },
    category:{
        type:ObjectId,
        ref:'Category',
        required:true,
    },
    source:{
        type:String,
        enum:['cash', 'debit', 'credit', 'other'],
        required:true,
    },
    user:{
        type:ObjectId,
        ref:'User',
        required:true,
    },
    description:{
        type:String,
    }
}, {
    timestamps: true
})

const Expense=model('Expense',expenseSchema);

export default Expense;