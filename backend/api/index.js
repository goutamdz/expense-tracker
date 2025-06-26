import 'dotenv/config';
import connectDB from '../DB/connect.js';
import express from 'express';
import userRouter from '../Routes/user.route.js';
import categoryRouter from '../Routes/category.route.js';
import expenseRouter from '../Routes/expense.route.js';
import cors from 'cors';
import serverless from 'serverless-http';

const app=express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

connectDB();

app.get('/',(req,res)=>{
    res.send("Hello World");
})

app.use('/api/v1/user',userRouter);
app.use('/api/v1/category',categoryRouter);
app.use('/api/v1/expense',expenseRouter);

module.exports=app;
module.exports.handler = serverless(app);