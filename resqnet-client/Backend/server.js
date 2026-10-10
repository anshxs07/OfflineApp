require('dotenv').config()

const express = require('express')
const cors = require('cors')

const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const app = express()
const userRoutes = require('./routes/userRoutes')
const emergencyRoutes = require('./routes/emergencyRoutes')
const contactRoutes = require('./routes/contactRoutes')


// Connect MongoDB
connectDB()

// Middleware
app.use(cors())
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/users',userRoutes)
app.use('/api/emergencies', emergencyRoutes)
app.use('/api/contacts', contactRoutes)
// Test route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'ResQNet API is running'
  })
})

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})