import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createDefaultCategories } from './category.controller.js';

const registerUser=async(req,res)=>{
    const {name,email,password}=req.body;
    const user=await User.findOne({email});
    if(user){
        return res.status(400).json({
            success:false,
            message:'User already exists',
        })
    }
    const hashedPassword=await bcrypt.hash(password,10);
    const newUser=await User.create({name,email,password:hashedPassword});
    
    // Create default categories for the new user
    try {
        await createDefaultCategories(newUser._id);
    } catch (error) {
        console.error('Error creating default categories:', error);
        // Don't fail the registration if category creation fails
    }
    
    const token=jwt.sign({id:newUser._id},process.env.JWT_SECRET,{expiresIn:'1d'});
    console.log(token);
    return res.status(201).json({
        success:true,
        message:'User created successfully',
        user:newUser,
        token,
    })
}

const loginUser=async(req,res)=>{
    const {email,password}=req.body;
    const user=await User.findOne({email});
    if(!user){
        return res.status(400).json({
            success:false,
            message:'User not found',
        })
    }
    const isPasswordCorrect=await bcrypt.compare(password,user.password);
    if(!isPasswordCorrect){
        return res.status(400).json({
            success:false,
            message:'Invalid password',
        })
    }
    const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'1d'});
    return res.status(200).json({
        success:true,
        message:'User logged in successfully',
        user,
        token,
    })
}

export {registerUser,loginUser};