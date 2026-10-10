const express = require('express')

const {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact
} = require('../controllers/contactController')

const protect = require('../middleware/authMiddleware')

const router = express.Router()


/* =========================================
   CONTACT ROUTES
========================================= */

// Create contact
router.post('/', protect, createContact)

// Get all contacts
router.get('/', protect, getContacts)

// Get single contact
router.get('/:id', protect, getContactById)

// Update contact
router.put('/:id', protect, updateContact)

// Delete contact
router.delete('/:id', protect, deleteContact)


module.exports = router