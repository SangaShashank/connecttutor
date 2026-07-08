const BookingRequest = require('../models/BookingRequest');

// @route  POST /api/bookings
// Student creates a new booking request
const createBooking = async (req, res) => {
  try {
    const { tutorId, subject, preferredMode, message } = req.body;

    const booking = await BookingRequest.create({
      studentId: req.user.id,
      tutorId,
      subject,
      preferredMode,
      message
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/bookings/my-requests
// Student views requests they've sent
const getMyRequests = async (req, res) => {
  try {
    const bookings = await BookingRequest.find({ studentId: req.user.id })
      .populate('tutorId', 'name email phone location');

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/bookings/incoming
// Tutor views requests they've received
const getIncomingRequests = async (req, res) => {
  try {
    const bookings = await BookingRequest.find({ tutorId: req.user.id })
      .populate('studentId', 'name email phone location');

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  PUT /api/bookings/:id/status
// Tutor accepts/rejects a request
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body; // expected: 'accepted' or 'rejected'

    const booking = await BookingRequest.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking request not found' });
    }

    // Security check: only the tutor this request was sent to can update it
    if (booking.tutorId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this request' });
    }

    booking.status = status;
    await booking.save();

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createBooking, getMyRequests, getIncomingRequests, updateStatus };
