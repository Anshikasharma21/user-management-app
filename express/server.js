import express from 'express'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import cors from 'cors'
import dotenv from 'dotenv'
import User from './models/User.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected! Ready to roll 🚀')
  })
  .catch(err => {
    console.log('❌ MongoDB Connection Error:', err)
  })

app.get('/', (req, res) => {
  res.send('👋 Hello World!')
})

app.post('/api/create', async (req, res) => {
  try {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
      return res.status(400).json({
        message: '⚠️ Please fill all the fields!',
      })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const newUser = new User({
      username,
      email,
      password: passwordHash,   // <-- Use hashed password here
    })

    await newUser.save()

    return res.status(201).json({
      message: '🎉 User created successfully!',
    })
  } catch (error) {
    return res.status(500).json({
      message: '💥 Server error',
      error: error.message,
    })
  }
})

app.listen(5000, () => {
  console.log('🟢 Server is running on http://localhost:5000')
})
