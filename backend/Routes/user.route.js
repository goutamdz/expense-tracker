import express,{Router} from 'express';
import {z} from 'zod';
import User from '../models/user.model.js';
import {registerUser,loginUser} from '../controllers/user.controller.js';
const router=Router();

const userSignupZodSchema=z.object({
    name:z.string().min(3).max(20),
    email:z.string().email(),
    password:z.string().min(3).max(20),
})

const userLoginZodSchema=z.object({
    email:z.string().email(),
    password:z.string().min(3).max(20)
})

router.get('/',(req,res)=>{
    res.send("Hello World");
})

router.post('/register',async(req,res)=>{
    console.log(req.body);
    let validate=userSignupZodSchema.safeParse(req.body);
    if(!validate.success){
        // console.log(validate.error.errors[0].message);
        return res.status(400).json({
            success:false,
            message:validate.error.errors[0].message,
        })
    }
    registerUser(req,res);
})

router.post('/login',async(req,res)=>{
    let validate=userLoginZodSchema.safeParse(req.body);
    if(!validate.success){
        return res.status(400).json({
            success:false,
            message:validate.error.errors[0].message,
        })
    }
    loginUser(req,res);
})

export default router;