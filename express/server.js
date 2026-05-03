import express from 'express'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import cors from 'cors'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import User from './models/User.js'
import Feedback from "./models/Feedback.js"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ MongoDB Connected! Ready to roll 🚀')
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message)
    process.exit(1)
  }
}

connectDB()

// Test route
app.get('/', (req, res) => {
  res.send('👋 Hello World!')
})


// ================= CREATE USER =================
app.post('/api/create', async (req, res) => {
  try {
    const username = req.body.username
    const email = req.body.email
    const password = req.body.password

    if (!username || !email || !password) {
      return res.status(400).json({
        message: '⚠️ Please fill all the fields!',
      })
    }

    // ✅ Check if user already exists (prevents 500 error)
    const existingUser = await User.findOne({ email: email })

    if (existingUser) {
      return res.status(400).json({
        message: '⚠️ User already exists with this email!',
      })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const newUser = new User({
      username: username,
      email: email,
      password: passwordHash,
    })

    await newUser.save()

    return res.status(201).json({
      message: '🎉 User created successfully!',
    })

  } catch (error) {
    console.error('CREATE ERROR:', error) // 👈 shows real error in terminal

    return res.status(500).json({
      message: '💥 Server error',
      error: error.message,
    })
  }
})


// ================= LOGIN USER =================
app.post('/api/login', async (req, res) => {
  try {
    const email = req.body.email
    const password = req.body.password

    if (!email || !password) {
      return res.status(400).json({
        message: '⚠️ Please fill all the fields!',
      })
    }

    const user = await User.findOne({ email: email })

    if (!user) {
      return res.status(400).json({
        message: 'Email does not exist',
      })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({
        message: 'Invalid password',
      })
    }

    const token = jwt.sign(
      {
        id: user._id,
        name: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      }
    )

    return res.status(200).json({
      message: '✅ Login successful',
      token: token,
    })

  } catch (error) {
    console.error('LOGIN ERROR:', error)

    return res.status(500).json({
      message: '💥 Server error',
      error: error.message,
    })
  }
})


// ================= DASHBOARD =================
app.get('/api/dashboard', async (req, res) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({
        message: 'Access Denied',
      })
    }

    const token = authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).json({
        message: 'Access Denied',
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    return res.json({
      message: '🎉 Access Granted!',
      user: decoded,
    })

  } catch (error) {
    return res.status(401).json({
      message: 'Invalid or expired token',
    })
  }
})

// ================= GET USER FEEDBACK =================
app.get("/api/feedback/:email", async (req, res) => {
  try {

    const email = req.params.email

    const user = await User.findOne({ email: email })

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      })
    }

    const feedback = await Feedback.findOne({ userId: user._id })

    return res.json({
      feedback: feedback
    })

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    })
  }
})
// ================= ADD FEEDBACK =================
app.post("/api/feedback", async (req, res) => {
  try {

    const email = req.body.email
    const feedbackText = req.body.feedback

    const user = await User.findOne({ email: email })

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      })
    }

    const existingFeedback = await Feedback.findOne({ userId: user._id })

    if (existingFeedback) {
      return res.status(400).json({
        message: "Feedback already submitted. You can edit it."
      })
    }

    const newFeedback = new Feedback({
      userId: user._id,
      feedback: feedbackText
    })

    await newFeedback.save()

    res.json({
      message: "Feedback submitted successfully"
    })

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    })
  }
})

// ================= EDIT FEEDBACK =================
app.put("/api/feedback", async (req, res) => {
  try {

    const email = req.body.email
    const feedbackText = req.body.feedback

    const user = await User.findOne({ email: email })

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      })
    }

    const feedback = await Feedback.findOneAndUpdate(
      { userId: user._id },
      { feedback: feedbackText },
      { new: true }
    )

    res.json({
      message: "Feedback updated",
      feedback: feedback
    })

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    })
  }
})


app.listen(5000, () => {
  console.log('🟢 Server is running on http://localhost:5000')
})
