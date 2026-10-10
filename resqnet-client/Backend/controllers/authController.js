const bcrypt = require('bcryptjs')
const User = require('../models/User')
const generateToken = require('../utils/generateToken')


// =========================
// REGISTER USER
// =========================

const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      emergencyContact,
      emergencyPhone
    } = req.body

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      })
    }

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      emergencyContact: emergencyContact || '',
      emergencyPhone: emergencyPhone || ''
    })

    const token = generateToken(user._id)

    res.status(201).json({
      success: true,
      message: 'User registered successfully',

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      },

      token
    })

  } catch (error) {
    console.error('Register error:', error.message)

    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    })
  }
}


// =========================
// LOGIN USER
// =========================

const loginUser = async (req, res) => {
  try {

    const {
      email,
      password
    } = req.body


    // Validate fields

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      })
    }


    // Find user

    const user = await User.findOne({ email })


    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }


    // Check password

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    )


    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }


    // Generate JWT

    const token = generateToken(user._id)


    // Send response

    res.status(200).json({

      success: true,

      message: 'Login successful',

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      },

      token
    })

  } catch (error) {

    console.error(
      'Login error:',
      error.message
    )

    res.status(500).json({
      success: false,
      message: 'Server error during login'
    })
  }
}


module.exports = {
  registerUser,
  loginUser
}