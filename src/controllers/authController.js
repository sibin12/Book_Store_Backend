import User from "../models/Users.js";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

export const login = (
    async (req, res) => {
        try {
            const { username, password } = req.body;

            // Check if user exists
            const user = await User.findOne({ username });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Check password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid password' });
            }

            // Generate JWT token
            const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '5h' });
            res.json({ token, user });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }
)

export const signup = (
    async (req, res) => {
        try {
            const { username, password, role, email } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.status(409).json({ message: 'User already exists' });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create new user
            const newUser = new User({ username, password: hashedPassword, role, email });
            await newUser.save();

            res.status(201).json({ message: 'User created successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }
)