const mongoose = require('mongoose')

const contactSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    phone: {
      type: String,
      required: true,
      trim: true
    },

    relationship: {
      type: String,
      trim: true,
      default: ''
    },

    type: {
      type: String,
      enum: ['EMERGENCY', 'TRUSTED'],
      default: 'EMERGENCY'
    }
  },
  {
    timestamps: true
  }
)

const Contact = mongoose.model(
  'Contact',
  contactSchema
)

module.exports = Contact