import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import TodoModel from './Models/Todo.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoURI = process.env.MONGODB_URI;
let isConnected = false; // Track MongoDB connection status

const connectToDB = async () => {
    if (!isConnected) {
        try {
            await mongoose.connect(mongoURI); // Simplified for Mongoose 7.x+
            isConnected = true;
            console.log('Connected to MongoDB');
        } catch (error) {
            console.error('Failed to connect to MongoDB:', error);
        }
    }
};

// Middleware to ensure DB connection
app.use(async (req, res, next) => {
    await connectToDB();
    next();
});

// Health check route
app.get("/", (req, res) => {
    res.send("Server is working!");
});

// Get all todos
app.get('/get', async (req, res) => {
    try {
        const todos = await TodoModel.find();
        res.json(todos);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch todos", details: error });
    }
});

// Update a todo
app.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const updatedTodo = await TodoModel.findByIdAndUpdate(id, { done: true }, { new: true });
        res.json(updatedTodo);
    } catch (error) {
        res.status(500).json({ error: "Failed to update todo", details: error });
    }
});

// Add a new todo
app.post('/add', async (req, res) => {
    const { task } = req.body;
    try {
        const newTodo = await TodoModel.create({ task });
        res.json(newTodo);
    } catch (error) {
        res.status(500).json({ error: "Failed to add todo", details: error });
    }
});

// Delete a todo
app.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedTodo = await TodoModel.findByIdAndDelete(id);
        res.json(deletedTodo);
    } catch (error) {
        res.status(500).json({ error: "Failed to delete todo", details: error });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
