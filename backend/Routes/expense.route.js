import express from 'express';
import { Router } from 'express';
import { 
    createExpense, 
    getExpenses, 
    getExpenseById, 
    updateExpense, 
    deleteExpense,
    getExpenseStats
} from '../controllers/expense.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Create a new expense
router.post('/', createExpense);

// Get all expenses with optional filters and pagination
router.get('/', getExpenses);

// Get expense statistics
router.get('/stats', getExpenseStats);

// Get a single expense by ID
router.get('/:id', getExpenseById);

// Update an expense
router.put('/:id', updateExpense);

// Delete an expense
router.delete('/:id', deleteExpense);

export default router;
