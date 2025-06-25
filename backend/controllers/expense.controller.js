import Expense from '../models/expense.model.js';
import Category from '../models/category.model.js';
import { z } from 'zod';
import mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;


// Validation schema for creating/updating expenses
const expenseSchema = z.object({
    title: z.string().min(1, "Title is required").max(100, "Title too long"),
    amount: z.number().positive("Amount must be positive"),
    date: z.string().date("Invalid date format"),
    category: z.string().min(1, "Category is required"),
    source: z.enum(['cash', 'debit', 'credit', 'other'], "Invalid source"),
    description: z.string().optional()
});

// Create a new expense
const createExpense = async (req, res) => {
    try {
        const userId = req.user.id;
        const expenseData = req.body;
        expenseData.amount = Number(expenseData.amount);
        console.log(expenseData);

        // Validate input
        const validation = expenseSchema.safeParse(expenseData);
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: validation.error.errors[0].message
            });
        }

        // Verify category exists and belongs to user
        const category = await Category.findOne({ 
            _id: expenseData.category,
            user: { $in: [userId] }
        });

        if (!category) {
            return res.status(400).json({
                success: false,
                message: 'Invalid category or category not found'
            });
        }

        // Create expense
        const newExpense = await Expense.create({
            ...expenseData,
            user: userId,
            date: new Date(expenseData.date)
        });

        // Populate category details
        await newExpense.populate('category', 'name');

        
        return res.status(201).json({
            success: true,
            message: 'Expense created successfully',
            expense: newExpense
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error creating expense',
            error: error.message
        });
    }
};

// Get all expenses for a user with optional filters
const getExpenses = async (req, res) => {
    try {
        const userId = req.user.id;
        const { 
            page = 1, 
            limit = 10, 
            category, 
            source, 
            startDate, 
            endDate,
            sortBy = 'date',
            sortOrder = 'desc'
        } = req.query;

        // Build filter object
        const filter = { user: userId };
        
        if (category) filter.category = category;
        if (source) filter.source = source;
        if (startDate || endDate) {
            filter.date = {};
            if (startDate) filter.date.$gte = new Date(startDate);
            if (endDate) filter.date.$lte = new Date(endDate);
        }

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Get expenses with pagination
        const expenses = await Expense.find(filter)
            .populate('category', 'name')
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count for pagination
        const total = await Expense.countDocuments(filter);

        return res.status(200).json({
            success: true,
            expenses,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalExpenses: total,
                hasNextPage: skip + expenses.length < total,
                hasPrevPage: parseInt(page) > 1
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error fetching expenses',
            error: error.message
        });
    }
};

// Get a single expense by ID
const getExpenseById = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const expense = await Expense.findOne({ _id: id, user: userId })
            .populate('category', 'name');

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: 'Expense not found'
            });
        }

        return res.status(200).json({
            success: true,
            expense
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error fetching expense',
            error: error.message
        });
    }
};

// Update an expense
const updateExpense = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const updateData = req.body;

        // Validate input
        const validation = expenseSchema.partial().safeParse(updateData);
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: validation.error.errors[0].message
            });
        }

        // Check if expense exists and belongs to user
        const existingExpense = await Expense.findOne({ _id: id, user: userId });
        if (!existingExpense) {
            return res.status(404).json({
                success: false,
                message: 'Expense not found'
            });
        }

        // If category is being updated, verify it exists and belongs to user
        if (updateData.category) {
            const category = await Category.findOne({ 
                _id: updateData.category,
                user: { $in: [userId] }
            });

            if (!category) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid category or category not found'
                });
            }
        }

        // Update expense
        const updatedExpense = await Expense.findByIdAndUpdate(
            id,
            { ...updateData, ...(updateData.date && { date: new Date(updateData.date) }) },
            { new: true, runValidators: true }
        ).populate('category', 'name');

        return res.status(200).json({
            success: true,
            message: 'Expense updated successfully',
            expense: updatedExpense
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error updating expense',
            error: error.message
        });
    }
};

// Delete an expense
const deleteExpense = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const expense = await Expense.findOneAndDelete({ _id: id, user: userId });

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: 'Expense not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Expense deleted successfully'
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error deleting expense',
            error: error.message
        });
    }
};

// Get expense statistics for a user
const getExpenseStats = async (req, res) => {
    try {
        const userId = req.user.id;
        const { startDate, endDate } = req.query;


        const filter = { user: new ObjectId(userId) };
        if (startDate || endDate) {
            filter.date = {};
            if (startDate) filter.date.$gte = new Date(startDate);
            if (endDate) filter.date.$lte = new Date(endDate);
        }

        // Get total expenses
        const totalExpenses = await Expense.aggregate([
            { $match: filter },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        // Get expenses by category
        const expensesByCategory = await Expense.aggregate([
            { $match: filter },
            { $group: { _id: '$category', total: { $sum: '$amount' } } },
            { $sort: { total: -1 } }
        ]);

        // Get expenses by source
        const expensesBySource = await Expense.aggregate([
            { $match: filter },
            { $group: { _id: '$source', total: { $sum: '$amount' } } },
            { $sort: { total: -1 } }
        ]);

        // Get monthly expenses (last 6 months)
        const monthlyExpenses = await Expense.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: {
                        year: { $year: '$date' },
                        month: { $month: '$date' }
                    },
                    total: { $sum: '$amount' }
                }
            },
            { $sort: { '_id.year': -1, '_id.month': -1 } },
            { $limit: 6 }
        ]);

        // Get startDate and endDate of data
        const firstExpense = await Expense.findOne(filter).sort({ date: 1 });
        const lastExpense = await Expense.findOne(filter).sort({ date: -1 });
        const dataStartDate = firstExpense ? firstExpense.date : null;
        const dataEndDate = lastExpense ? lastExpense.date : null;

        return res.status(200).json({
            success: true,
            stats: {
                totalAmount: totalExpenses[0]?.total || 0,
                totalCount: await Expense.countDocuments(filter),
                byCategory: expensesByCategory,
                bySource: expensesBySource,
                monthly: monthlyExpenses,
                startDate: dataStartDate,
                endDate: dataEndDate
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error fetching expense statistics',
            error: error.message
        });
    }
};
export {
    createExpense,
    getExpenses,
    getExpenseById,
    updateExpense,
    deleteExpense,
    getExpenseStats
};