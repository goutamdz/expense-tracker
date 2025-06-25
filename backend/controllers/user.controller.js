import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createDefaultCategories } from './category.controller.js';
import { z } from 'zod';

const userSignupZodSchema = z.object({
  name: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(3).max(20),
});

const userLoginZodSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3).max(20),
});

export const getUserProfile = async (req, res) => {
  try{
    const userId = req.user.id;
    const user = await User.findById(userId);
    return res.status(200).json({
      success:true,
      user
    })
  }catch(error){
    return res.status(500).json({
      success:false,
      message:"Internal server error"
    })
  }
}

export const registerUser = async (req, res) => {
  try {
    // Validate input
    const result = userSignupZodSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error.errors[0].message,
      });
    }
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    // Create default categories for the new user
    try {
      await createDefaultCategories(newUser._id);
    } catch (error) {
      // Don't fail the registration if category creation fails
    }

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: { user: newUser },
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    // Validate input
    const result = userLoginZodSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error.errors[0].message,
      });
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found',
      });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: 'Invalid password',
      });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      data: { user },
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};