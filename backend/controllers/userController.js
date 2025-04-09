import User from '../models/User.js';

// Add a new user
export const addUser = async (req, res) => {
    try {
        console.log(req.body)
        const { name, email } = req.body;
        const user = new User({ name, email });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// User Login
export const loginUser = async (req, res) => {
    try {
        const { name, email } = req.body;
        console.log(req.body)
        const user = await User.findOne({ $or: [{ name }, { email }] });
        // console.log(user)
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "Login successful", user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all users
export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

