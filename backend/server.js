const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in the environment variables');
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Error connecting to MongoDB:', err.message);
    if (err.name === 'MongooseServerSelectionError') {
      console.error('Please check your MongoDB URI and ensure your IP is whitelisted in MongoDB Atlas');
    }
    process.exit(1);
  });

const UserSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true, unique: true },
  name: String,
  location: String,
  profilePhoto: String,
  age: Number,
  sex: String,
  preference: String,
  school: String,
  matches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const User = mongoose.model('User', UserSchema);

app.get('/api/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('matches');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/user', async (req, res) => {
  const user = new User(req.body);
  try {
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(400).json({ message: error.message });
  }
});

// New login route
app.post('/api/login', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    
    if (!phoneNumber) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    // Check if user exists
    let user = await User.findOne({ phoneNumber });
    
    if (!user) {
      // If user doesn't exist, create a new one
      user = new User({
        phoneNumber,
        name: "Test User",
        location: "Fakeplace",
        profilePhoto: "",
        age: 99,
        sex: "Yes",
        preference: "Please",
        school: "St. Annford",
        matches: ["66db6aa1e01b88556d4ffe03"]
      });
      await user.save();
    }
    
    // Return user data
    res.json(user);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// New route to update user information
app.put('/api/user/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(400).json({ message: error.message });
  }
});

// New route to add a match
app.post('/api/user/:id/match', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const matchUser = await User.findById(req.body.matchId);

    if (!user || !matchUser) {
      return res.status(404).json({ message: 'User or match not found' });
    }

    if (!user.matches.includes(matchUser._id)) {
      user.matches.push(matchUser._id);
      await user.save();
    }

    res.json(user);
  } catch (error) {
    console.error('Error adding match:', error);
    res.status(400).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));