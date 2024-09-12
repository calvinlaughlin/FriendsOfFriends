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

const ContactSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String
});

const UserSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true, unique: true },
  firstName: String,
  location: String,
  profilePhoto: String,
  additionalPhotos: [String],
  birthday: Date,
  age: Number,
  gender: String,
  desiredGender: String,
  college: String,
  job: String,
  promptAnswers: { type: Map, of: String },
  closestContacts: [ContactSchema],
  excludedContacts: [ContactSchema],
  matches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  viewedProfiles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
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
  console.log('Received request to create user with data:', req.body);
  try {
    const userData = req.body;
    
    // Calculate age from birthday
    const birthDate = new Date(userData.birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    const newUser = new User({
      phoneNumber: userData.phoneNumber,
      firstName: userData.firstName,
      location: userData.location,
      profilePhoto: userData.profilePhoto,
      additionalPhotos: userData.additionalPhotos,
      birthday: userData.birthday,
      age: age,
      gender: userData.gender,
      desiredGender: userData.desiredGender,
      college: userData.college,
      job: userData.job,
      promptAnswers: userData.promptAnswers,
      closestContacts: userData.closestContacts,
      excludedContacts: userData.excludedContacts,
      viewedProfiles: []
    });

    console.log('Attempting to save new user to database');
    const savedUser = await newUser.save();
    console.log('User saved successfully:', savedUser);
    res.status(201).json(savedUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(400).json({ message: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    
    if (!phoneNumber) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    // Check if user exists
    let user = await User.findOne({ phoneNumber });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Return user data
    res.json(user);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

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

app.delete('/api/user/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Remove this user from other users' matches
    await User.updateMany(
      { matches: req.params.id },
      { $pull: { matches: req.params.id } }
    );

    res.json({ message: 'User deleted successfully', deletedUser });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/users/:id/potential-matches', async (req, res) => {
  try {
    const currentUserId = req.params.id;
    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      return res.status(404).json({ message: 'Current user not found' });
    }

    const potentialMatches = await User.aggregate([
      { $match: { 
        _id: { $ne: new mongoose.Types.ObjectId(currentUserId) },
        gender: currentUser.desiredGender,
        desiredGender: currentUser.gender
      }},
      { $sample: { size: 5 } },
      { $project: {
        _id: 1,
        firstName: 1,
        age: 1,
        location: 1,
        profilePhoto: 1,
        college: 1,
        job: 1,
        promptAnswers: 1,
        additionalPhotos: 1,
        closestContacts: 1
      }}
    ]);

    // Calculate mutual connections
    const potentialMatchesWithMutualConnections = potentialMatches.map(match => {
      const mutualConnections = match.closestContacts.filter(contact => 
        currentUser.closestContacts.some(userContact => 
          userContact.phoneNumber === contact.phoneNumber
        )
      ).length;

      return {
        ...match,
        mutualConnections,
        closestContacts: undefined // Remove closestContacts from the response
      };
    });

    res.json(potentialMatchesWithMutualConnections);
  } catch (error) {
    console.error('Error fetching potential matches:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/test', async (req, res) => {
  try {
    const testUser = new User({ phoneNumber: 'test' });
    await testUser.save();
    await User.deleteOne({ phoneNumber: 'test' });
    res.json({ message: 'Database connection successful' });
  } catch (error) {
    console.error('Database test failed:', error);
    res.status(500).json({ message: 'Database connection failed', error: error.message });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));