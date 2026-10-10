const mongoose = require('mongoose')

const emergencySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    type: {
      type: String,
      enum: [
        'FIRE',
        'MEDICAL',
        'ACCIDENT',
        'FLOOD',
        'OTHER'
      ],
      required: true
    },

    severity: {
      type: String,
      enum: [
        'LOW',
        'MEDIUM',
        'HIGH'
      ],
      default: 'MEDIUM'
    },

    description: {
      type: String,
      trim: true,
      default: ''
    },

    location: {
      type: String,
      trim: true,
      default: ''
    },

    status: {
      type: String,
      enum: [
        'ACTIVE',
        'ACKNOWLEDGED',
        'RESOLVED'
      ],
      default: 'ACTIVE'
    }
  },
  {
    timestamps: true
  }
)

const Emergency = mongoose.model(
  'Emergency',
  emergencySchema
)

module.exports = Emergency