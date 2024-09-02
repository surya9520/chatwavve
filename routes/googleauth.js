const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/', async (req, res) => {  // Ensure this matches the route in server.js
  const { idToken } = req.body;

  try {
    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    
    // Check if user exists
    let user = await User.findOne({ googleId: payload.sub });

    if (!user) {
      // If user does not exist, create a new user
      user = new User({
        name: payload.name,
        email: payload.email,
        googleId: payload.sub,
      });
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'default_secret_key', { expiresIn: '1h' });
    
    res.status(200).json({ message: 'Sign-Up successful', token });
  } catch (error) {
    console.error('Error during Google sign-up:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
