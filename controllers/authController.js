const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Function to handle user registration
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create a new user instance
    user = new User({
      name,
      email,
      password,
    });

    // Save the user to the database
    await user.save();

    // Create payload for JWT
    const payload = {
      user: {
        id: user.id,
      },
    };

    // Sign and send the JWT token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }, // Token expiration time
      (err, token) => {
        if (err) throw err;
        res.json({ token }); // Send token to the client
      }
    );
  } catch (err) {
    console.error(err.message); // Log error message
    res.status(500).send('Server error'); // Send server error response
  }
};

// Function to handle user login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Create payload for JWT
    const payload = {
      user: {
        id: user.id,
      },
    };

    // Sign and send the JWT token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }, // Token expiration time
      (err, token) => {
        if (err) throw err;
        res.json({ token }); // Send token to the client
      }
    );
  } catch (err) {
    console.error(err.message); // Log error message
    res.status(500).send('Server error'); // Send server error response
  }
};

module.exports = { registerUser, loginUser };
