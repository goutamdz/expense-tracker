import express from 'express';
import {Router} from 'express';
import { getUserCategories, createCategory } from '../controllers/category.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router=Router();

// Get all categories for the authenticated user
router.get('/', authMiddleware, getUserCategories);

// Create a new category for the authenticated user
router.post('/', authMiddleware, createCategory);

export default router;