import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // make sure file has `.js` extension if you're using ESM


const router = express.Router()

const JWT_SECRET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

router.post('/register', async (req, res) => {
  
  try {
    
    const { username, email, password } = req.body
 
    const existingUser = await User.findOne({ $or: [{ email }, { username }] })
   
    if (existingUser) {
      return res.status(400).json({ 
        status:false,
        message: 'User with this email or username already exists' 
      })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = new User({ username, email, password: hashedPassword})

    await user.save()

  
    const token = jwt.sign( { userId: user._id },JWT_SECRET, { expiresIn: '7d' })

    return res.status(201).json({
      status:true,
      message: 'User created successfully',
      data: { token, user }
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status:false, message: 'Server error' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body
   
    const user = await User.findOne({ username});
   
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    return res.status(200).json({
      status:true,
      message: 'Login successfully',
      data: { token, user }
    })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
})

export default router