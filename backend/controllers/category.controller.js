import Category from '../models/category.model.js';
import Expense from '../models/expense.model.js';

// Create default categories for a new user
const createDefaultCategories = async (userId) => {
    const defaultCategories = [
        'entertainment',
        'rent',
        'loan',
        'utility',
        'dining out',
        'shopping',
        'other'
    ];

    try {
        for (let categoryName of defaultCategories) {
            // Check if category already exists
            let existingCategory = await Category.findOne({ name: categoryName });
            
            if (existingCategory) {
                // If category exists, add the user to the users array if not already present
                if (!existingCategory.user.includes(userId)) {
                    existingCategory.user.push(userId);
                    await existingCategory.save();
                }
            } else {
                // If category doesn't exist, create new category with user in array
                await Category.create({
                    name: categoryName,
                    user: [userId]
                });
            }
        }
        console.log(`Default categories created for user: ${userId}`);
    } catch (error) {
        console.error('Error creating default categories:', error);
        throw error;
    }
};

// Get all categories for a specific user
const getUserCategories = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming auth middleware sets req.user
        const categories = await Category.find({ user: { $in: [userId] } });
        
        return res.status(200).json({
            success: true,
            categories
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error fetching categories',
            error: error.message
        });
    }
};

// Create a new category for a user
const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const userId = req.user.id;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Category name is required'
            });
        }

        // Check if category already exists for this user
        const existingCategory = await Category.findOne({ 
            name: name.toLowerCase(), 
            user: { $in: [userId] }
        });

        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: 'Category already exists for this user'
            });
        }

        // Check if category exists globally
        const globalCategory = await Category.findOne({ name: name.toLowerCase() });
        
        if (globalCategory) {
            // Add user to existing category
            if (!globalCategory.user.includes(userId)) {
                globalCategory.user.push(userId);
                await globalCategory.save();
            }
        } else {
            // Create new category with user in array
            await Category.create({
                name: name.toLowerCase(),
                user: [userId]
            });
        }

        return res.status(201).json({
            success: true,
            message: 'Category created successfully'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error creating category',
            error: error.message
        });
    }
};

// Delete a category for a user
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Check if category exists and belongs to user
        const category = await Category.findOne({ 
            _id: id, 
            user: { $in: [userId] }
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found or you do not have permission to delete it'
            });
        }

        // Check if category is being used in any expenses
        const expensesUsingCategory = await Expense.findOne({ 
            category: id, 
            user: userId 
        });

        if (expensesUsingCategory) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete category. It is being used by existing expenses. Please reassign or delete those expenses first.'
            });
        }

        // Remove user from category's user array
        category.user = category.user.filter(user => user.toString() !== userId);
        
        // If no users left, delete the category entirely
        if (category.user.length === 0) {
            await Category.findByIdAndDelete(id);
        } else {
            await category.save();
        }

        return res.status(200).json({
            success: true,
            message: 'Category deleted successfully'
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error deleting category',
            error: error.message
        });
    }
};

export { createDefaultCategories, getUserCategories, createCategory, deleteCategory }; 