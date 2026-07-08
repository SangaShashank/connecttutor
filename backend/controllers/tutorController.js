const TutorProfile = require('../models/TutorProfile');
const User = require('../models/User'); // ← NEW: add this import at the top

// @route  POST /api/tutors/profile
// Create a new tutor profile (only for logged-in tutors)
const createProfile = async (req, res) => {
  try {
    const { subjects, mode, hourlyRate, bio, qualifications, availability } = req.body;

    // Check if this tutor already has a profile
    const existingProfile = await TutorProfile.findOne({ userId: req.user.id });
    if (existingProfile) {
      return res.status(400).json({ message: 'Profile already exists. Use update instead.' });
    }

    const profile = await TutorProfile.create({
      userId: req.user.id,
      subjects,
      mode,
      hourlyRate,
      bio,
      qualifications,
      availability
    });

    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/tutors/profile/me
// Get the logged-in tutor's own profile
const getMyProfile = async (req, res) => {
  try {
    const profile = await TutorProfile.findOne({ userId: req.user.id }).populate('userId', 'name email phone location');

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  PUT /api/tutors/profile
// Update the logged-in tutor's profile
const updateProfile = async (req, res) => {
  try {
    const profile = await TutorProfile.findOneAndUpdate(
      { userId: req.user.id },
      req.body,
      { new: true } // returns the updated document, not the old one
    );

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/tutors/:id
// View any tutor's public profile (no auth needed — students browse this)
const getTutorById = async (req, res) => {
  try {
    const profile = await TutorProfile.findById(req.params.id).populate('userId', 'name location');

    if (!profile) {
      return res.status(404).json({ message: 'Tutor not found' });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @route  GET /api/tutors
// Search/filter tutors — public route
const searchTutors = async (req, res) => {
  try {
    const { subject, mode, location, minPrice, maxPrice } = req.query;

    // Step 1: if location filter given, find matching users first
    let userIds;
    if (location) {
      const users = await User.find({ location: new RegExp(location, 'i') });
      userIds = users.map(user => user._id);
    }

    // Step 2: build the tutor profile filter
    const filter = {};
    //if (subject) filter.subjects = subject;
    if (subject) filter.subjects = new RegExp(subject.trim(), 'i');
    if (mode) filter.mode = mode;
    if (userIds) filter.userId = { $in: userIds };
    if (minPrice || maxPrice) {
      filter.hourlyRate = {};
      if (minPrice) filter.hourlyRate.$gte = Number(minPrice);
      if (maxPrice) filter.hourlyRate.$lte = Number(maxPrice);
    }

    const tutors = await TutorProfile.find(filter).populate('userId', 'name location');

    res.json(tutors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//module.exports = { createProfile, getMyProfile, updateProfile, getTutorById };
module.exports = { createProfile, getMyProfile, updateProfile, getTutorById, searchTutors };