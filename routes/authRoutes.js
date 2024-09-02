const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authenticateToken = require('../middlewares/authMiddleware');

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ message: 'Invalid email or password' });
  
      const isMatch = await user.matchPassword(password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });
  
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'default_secret_key', { expiresIn: '1h' });
  
      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
// Logout route
router.post('/logout', (req, res) => {
    // Invalidate token or handle logout logic
    res.status(200).json({ message: 'Logout successful' });
  });
  
  // Profile route
  router.get('/profile', authenticateToken, (req, res) => {
    res.status(200).json({ message: 'This is a protected route', user: req.user });
  });
  
// Registration route
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
  
    try {
      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required' });
      }
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }
  
      const newUser = new User({ name, email, password });
      await newUser.save();
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

module.exports = router;
