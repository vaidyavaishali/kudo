import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/users.js';
import kudoRoutes from './routes/kudos.js';

dotenv.config();
connectDB();

const app = express();

// Middleware
// app.use(cors()); // Enable CORS for all requests

app.use(cors({
    origin: 'https://kudos-ten-cyan.vercel.app', // Replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
})); // Enable CORS for specific origin

app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

// Routes
app.use('/api/users', userRoutes);
app.use('/api/kudos', kudoRoutes);

// Home route
app.get('/', (req, res) => {
    res.send('Welcome to KudoSpot API');
});

// Handle unknown routes
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'An internal server error occurred' });
});

// Start server
const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });

export default app; // Export the app for testing purposes