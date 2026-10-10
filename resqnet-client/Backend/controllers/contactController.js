const Contact = require('../models/Contact')


/* =========================================
   CREATE CONTACT
========================================= */

const createContact = async (req, res) => {
  try {
    const {
      name,
      phone,
      relationship,
      type
    } = req.body

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name and phone are required'
      })
    }

    const contact = await Contact.create({
      user: req.user._id,
      name,
      phone,
      relationship: relationship || '',
      type: type || 'EMERGENCY'
    })

    res.status(201).json({
      success: true,
      message: 'Contact added successfully',
      contact
    })
  } catch (error) {
    console.error(
      'Create contact error:',
      error.message
    )

    res.status(500).json({
      success: false,
      message: 'Server error while creating contact'
    })
  }
}


/* =========================================
   GET CONTACTS
========================================= */

const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({
      user: req.user._id
    }).sort({
      createdAt: -1
    })

    res.status(200).json({
      success: true,
      count: contacts.length,
      contacts
    })
  } catch (error) {
    console.error(
      'Get contacts error:',
      error.message
    )

    res.status(500).json({
      success: false,
      message: 'Server error while fetching contacts'
    })
  }
}


/* =========================================
   GET CONTACT BY ID
========================================= */

const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findOne({
      _id: req.params.id,
      user: req.user._id
    })

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      })
    }

    res.status(200).json({
      success: true,
      contact
    })
  } catch (error) {
    console.error(
      'Get contact error:',
      error.message
    )

    res.status(500).json({
      success: false,
      message: 'Server error while fetching contact'
    })
  }
}


/* =========================================
   UPDATE CONTACT
========================================= */

const updateContact = async (req, res) => {
  try {
    const {
      name,
      phone,
      relationship,
      type
    } = req.body

    const contact = await Contact.findOne({
      _id: req.params.id,
      user: req.user._id
    })

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      })
    }

    if (name !== undefined) {
      contact.name = name
    }

    if (phone !== undefined) {
      contact.phone = phone
    }

    if (relationship !== undefined) {
      contact.relationship = relationship
    }

    if (type !== undefined) {
      contact.type = type
    }

    const updatedContact =
      await contact.save()

    res.status(200).json({
      success: true,
      message: 'Contact updated successfully',
      contact: updatedContact
    })
  } catch (error) {
    console.error(
      'Update contact error:',
      error.message
    )

    res.status(500).json({
      success: false,
      message: 'Server error while updating contact'
    })
  }
}


/* =========================================
   DELETE CONTACT
========================================= */

const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findOne({
      _id: req.params.id,
      user: req.user._id
    })

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      })
    }

    await Contact.findByIdAndDelete(
      req.params.id
    )

    res.status(200).json({
      success: true,
      message: 'Contact deleted successfully'
    })
  } catch (error) {
    console.error(
      'Delete contact error:',
      error.message
    )

    res.status(500).json({
      success: false,
      message: 'Server error while deleting contact'
    })
  }
}


module.exports = {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact
}