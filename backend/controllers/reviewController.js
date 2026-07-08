const Review = require('../models/Review');
const BookingRequest = require('../models/BookingRequest');
const TutorProfile = require('../models/TutorProfile');

// @route  POST /api/reviews
// Student submits a review for a booking
const createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;

    // Find the booking and verify it belongs to this student
    const booking = await BookingRequest.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    if (booking.studentId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to review this booking' });
    }
    if (booking.status !== 'accepted' && booking.status !== 'completed') {
      return res.status(400).json({ message: 'Can only review accepted or completed bookings' });
    }

    // Check if a review already exists for this booking
    const existingReview = await Review.findOne({ bookingId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this booking' });
    }

    // Create the review
    const review = await Review.create({
      bookingId,
      studentId: req.user.id,
      tutorId: booking.tutorId,
      rating,
      comment
    });

    // Recalculate the tutor's average rating
    const allReviews = await Review.find({ tutorId: booking.tutorId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await TutorProfile.findOneAndUpdate(
      { userId: booking.tutorId },
      { rating: avgRating.toFixed(1) }
    );

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/reviews/tutor/:tutorId
// Get all reviews for a specific tutor (public)
const getTutorReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ tutorId: req.params.tutorId })
      .populate('studentId', 'name');

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createReview, getTutorReviews };
