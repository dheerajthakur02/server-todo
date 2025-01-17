import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import TodoModel from './Models/Todo.js'; // Adjust path as needed

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const mongoURI = process.env.MONGODB_URI;

let isConnected = false; // Track MongoDB connection status

const connectToDB = async () => {
    if (!isConnected) {
        try {
            await mongoose.connect(mongoURI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            isConnected = true;
            console.log('Connected to MongoDB');
        } catch (error) {
            console.error('Failed to connect to MongoDB:', error);
        }
    }
};

app.use(async (req, res, next) => {
    await connectToDB();
    next();
});
app.get("/", (req, res) => {
  res.send("server is working");
});
// Define routes
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

export default app;
