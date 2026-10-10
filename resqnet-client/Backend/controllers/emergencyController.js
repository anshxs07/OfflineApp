const Emergency = require('../models/Emergency')


// ==============================
// CREATE EMERGENCY
// ==============================

const createEmergency = async (req, res) => {
  try {
    const {
      type,
      severity,
      description,
      location
    } = req.body

    if (!type) {
      return res.status(400).json({
        success: false,
        message: 'Emergency type is required'
      })
    }

    const emergency = await Emergency.create({
      user: req.user._id,
      type,
      severity: severity || 'MEDIUM',
      description: description || '',
      location: location || ''
    })

    res.status(201).json({
      success: true,
      message: 'Emergency created successfully',
      emergency
    })
  } catch (error) {
    console.error(
      'Create emergency error:',
      error.message
    )

    res.status(500).json({
      success: false,
      message:
        'Server error while creating emergency'
    })
  }
}


// ==============================
// GET ALL MY EMERGENCIES
// ==============================

const getEmergencies = async (req, res) => {
  try {
    const emergencies = await Emergency.find({
      user: req.user._id
    }).sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: emergencies.length,
      emergencies
    })
  } catch (error) {
    console.error(
      'Get emergencies error:',
      error.message
    )

    res.status(500).json({
      success: false,
      message:
        'Server error while fetching emergencies'
    })
  }
}


// ==============================
// GET SINGLE MY EMERGENCY
// ==============================

const getEmergencyById = async (req, res) => {
  try {
    const emergency = await Emergency.findOne({
      _id: req.params.id,
      user: req.user._id
    })

    if (!emergency) {
      return res.status(404).json({
        success: false,
        message: 'Emergency not found'
      })
    }

    res.status(200).json({
      success: true,
      emergency
    })
  } catch (error) {
    console.error(
      'Get emergency error:',
      error.message
    )

    res.status(500).json({
      success: false,
      message:
        'Server error while fetching emergency'
    })
  }
}


// ==============================
// UPDATE MY EMERGENCY
// ==============================

const updateEmergency = async (req, res) => {
  try {
    const {
      type,
      severity,
      description,
      location,
      status
    } = req.body

    const emergency =
      await Emergency.findOne({
        _id: req.params.id,
        user: req.user._id
      })

    if (!emergency) {
      return res.status(404).json({
        success: false,
        message: 'Emergency not found'
      })
    }

    if (type !== undefined) {
      emergency.type = type
    }

    if (severity !== undefined) {
      emergency.severity = severity
    }

    if (description !== undefined) {
      emergency.description = description
    }

    if (location !== undefined) {
      emergency.location = location
    }

    if (status !== undefined) {
      emergency.status = status
    }

    const updatedEmergency =
      await emergency.save()

    res.status(200).json({
      success: true,
      message:
        'Emergency updated successfully',
      emergency: updatedEmergency
    })
  } catch (error) {
    console.error(
      'Update emergency error:',
      error.message
    )

    res.status(500).json({
      success: false,
      message:
        'Server error while updating emergency'
    })
  }
}


// ==============================
// DELETE MY EMERGENCY
// ==============================

const deleteEmergency = async (req, res) => {
  try {
    const emergency =
      await Emergency.findOne({
        _id: req.params.id,
        user: req.user._id
      })

    if (!emergency) {
      return res.status(404).json({
        success: false,
        message: 'Emergency not found'
      })
    }

    await Emergency.findByIdAndDelete(
      req.params.id
    )

    res.status(200).json({
      success: true,
      message:
        'Emergency deleted successfully'
    })
  } catch (error) {
    console.error(
      'Delete emergency error:',
      error.message
    )

    res.status(500).json({
      success: false,
      message:
        'Server error while deleting emergency'
    })
  }
}


module.exports = {
  createEmergency,
  getEmergencies,
  getEmergencyById,
  updateEmergency,
  deleteEmergency
}