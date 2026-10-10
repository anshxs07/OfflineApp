const express = require('express')

const {
  getProfile,
  updateProfile,
  deleteAccount
} = require('../controllers/userController')

const protect = require('../middleware/authMiddleware')

const router = express.Router()


// Get logged-in user's profile
router.get(
  '/profile',
  protect,
  getProfile
)


// Update logged-in user's profile
router.put(
  '/profile',
  protect,
  updateProfile
)


// Delete logged-in user's account
router.delete(
  '/profile',
  protect,
  deleteAccount
)


module.exports = router