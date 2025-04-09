import express from 'express';
import { addUser, getUsers, loginUser } from '../controllers/userController.js';

const userrouter = express.Router();

// Routes for user management
userrouter.post('/add', addUser);     // Add a user
userrouter.get('/get', getUsers);        // Get all users
userrouter.post('/login', loginUser);        // User login

export default userrouter;
