import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import TodoModel from './Models/Todo.js'; // Adjust path as needed

dotenv.config();

const app = express();
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(express.json());

// const mongoURI = process.env.MONGODB_URI;
const mongoURI='mongodb+srv://dk35118:s3iPBhsEjBPJ6IM3@test-db.hgjf8.mongodb.net/?retryWrites=true&w=majority&appName=test-db';
let isConnected = false; // Track MongoDB connection status

const connectToDB = async () => {
    if (!isConnected) {
        try {
            await mongoose.connect(mongoURI); // Removed deprecated options
            isConnected = true;
            console.log('Connected to MongoDB');
        } catch (error) {
            console.error('Failed to connect to MongoDB:', error);
        }
    }
}

app.use(async (req, res, next) => {
    await connectToDB();
    next();
});

// Define routes
app.get("/", (req, res) => {
    res.send("<h1>Server is working</h1>");
  });

app.get('/get', async (req, res) => {
    try {
        const todos = await TodoModel.find();
        res.json(todos);
    } catch (error) {
        res.status(500).json(error);
    }
});

app.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const updatedTodo = await TodoModel.findByIdAndUpdate(id, { done: true }, { new: true });
        res.json(updatedTodo);
    } catch (error) {
        res.status(500).json(error);
    }
});

app.post('/add', async (req, res) => {
    const { task } = req.body;
    try {
        const newTodo = await TodoModel.create({ task });
        res.json(newTodo);
    } catch (error) {
        res.status(500).json(error);
    }
});

app.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedTodo = await TodoModel.findByIdAndDelete(id);
        res.json(deletedTodo);
    } catch (error) {
        res.status(500).json(error);
    }
});

// Export the app for serverless deployment
export default app;

