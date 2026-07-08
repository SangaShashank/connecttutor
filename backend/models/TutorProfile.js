const mongoose = require('mongoose');

const tutorProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  subjects: {
    type: [String],
    required: true
  },
  mode: {
    type: [String],
    enum: ['home', 'online', 'group'],
    required: true
  },
  hourlyRate: {
    type: Number,
    required: true
  },
  bio: {
    type: String
  },
  qualifications: {
    type: String
  },
  availability: {
    type: String
  },
  rating: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('TutorProfile', tutorProfileSchema);