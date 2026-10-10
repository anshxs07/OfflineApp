const express = require('express')

const {
  createEmergency,
  getEmergencies,
  getEmergencyById,
  updateEmergency,
  deleteEmergency
} = require('../controllers/emergencyController')

const protect = require('../middleware/authMiddleware')

const router = express.Router()


// Create emergency
router.post(
  '/',
  protect,
  createEmergency
)


// Get all my emergencies
router.get(
  '/',
  protect,
  getEmergencies
)


// Get single emergency
router.get(
  '/:id',
  protect,
  getEmergencyById
)


// Update my emergency
router.put(
  '/:id',
  protect,
  updateEmergency
)


// Delete my emergency
router.delete(
  '/:id',
  protect,
  deleteEmergency
)


module.exports = router