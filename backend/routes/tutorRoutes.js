/*const express = require('express');
const router = express.Router();
const { createProfile, getMyProfile, updateProfile, getTutorById } = require('../controllers/tutorController');
const { protect, requireRole } = require('../middleware/authMiddleware');

router.post('/profile', protect, requireRole('tutor'), createProfile);
router.get('/profile/me', protect, requireRole('tutor'), getMyProfile);
router.put('/profile', protect, requireRole('tutor'), updateProfile);
router.get('/:id', getTutorById); // public, no protect needed

module.exports = router;*/
const express = require('express');
const router = express.Router();
const { createProfile, getMyProfile, updateProfile, getTutorById, searchTutors } = require('../controllers/tutorController');
const { protect, requireRole } = require('../middleware/authMiddleware');

router.post('/profile', protect, requireRole('tutor'), createProfile);
router.get('/profile/me', protect, requireRole('tutor'), getMyProfile);
router.put('/profile', protect, requireRole('tutor'), updateProfile);
router.get('/', searchTutors);       // search route — must come before /:id
router.get('/:id', getTutorById);    // public view by id

module.exports = router;