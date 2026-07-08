const express = require('express');
const router = express.Router();
const { createReview, getTutorReviews } = require('../controllers/reviewController');
const { protect, requireRole } = require('../middleware/authMiddleware');

router.post('/', protect, requireRole('student'), createReview);
router.get('/tutor/:tutorId', getTutorReviews);

module.exports = router;
