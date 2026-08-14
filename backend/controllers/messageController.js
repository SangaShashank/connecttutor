const Message = require('../models/Message');

// @route  GET /api/messages/:bookingId
// Fetch chat history for a specific booking
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ bookingId: req.params.bookingId })
      .populate('senderId', 'name')
      .sort({ createdAt: 1 }); // oldest first, so chat reads top to bottom

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMessages };