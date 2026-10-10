const User = require('../models/User')


// ==============================
// GET OWN PROFILE
// ==============================

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(
      req.user._id
    ).select('-password')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.status(200).json({
      success: true,
      user
    })
  } catch (error) {
    console.error(
      'Get profile error:',
      error.message
    )

    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile'
    })
  }
}


// ==============================
// UPDATE OWN PROFILE
// ==============================

const updateProfile = async (req, res) => {
  try {
    const {
      name,
      phone,
      emergencyContact,
      emergencyPhone
    } = req.body

    const user = await User.findById(
      req.user._id
    )

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    if (name !== undefined) {
      user.name = name
    }

    if (phone !== undefined) {
      user.phone = phone
    }

    if (emergencyContact !== undefined) {
      user.emergencyContact = emergencyContact
    }

    if (emergencyPhone !== undefined) {
      user.emergencyPhone = emergencyPhone
    }

    const updatedUser = await user.save()

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',

      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        emergencyContact:
          updatedUser.emergencyContact,
        emergencyPhone:
          updatedUser.emergencyPhone,
        isActive:
          updatedUser.isActive
      }
    })
  } catch (error) {
    console.error(
      'Update profile error:',
      error.message
    )

    res.status(500).json({
      success: false,
      message: 'Server error while updating profile'
    })
  }
}


// ==============================
// DELETE OWN ACCOUNT
// ==============================

const deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(
      req.user._id
    )

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    await User.findByIdAndDelete(
      req.user._id
    )

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    })
  } catch (error) {
    console.error(
      'Delete account error:',
      error.message
    )

    res.status(500).json({
      success: false,
      message: 'Server error while deleting account'
    })
  }
}


module.exports = {
  getProfile,
  updateProfile,
  deleteAccount
}