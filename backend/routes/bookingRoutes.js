const express = require('express');
const router = express.Router();
const { createBooking, getMyRequests, getIncomingRequests, updateStatus } = require('../controllers/bookingController');
const { protect, requireRole } = require('../middleware/authMiddleware');

router.post('/', protect, requireRole('student'), createBooking);
router.get('/my-requests', protect, requireRole('student'), getMyRequests);
router.get('/incoming', protect, requireRole('tutor'), getIncomingRequests);
router.put('/:id/status', protect, requireRole('tutor'), updateStatus);

module.exports = router;
