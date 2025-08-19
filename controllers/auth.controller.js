import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

// Validate environment variables
if (!process.env.JWT_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
  throw new Error("Missing JWT secrets in environment variables.");
}

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

// Utility: Token Generators
const generateAccessToken = (user) => {
  return jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '15m' });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ userId: user.id }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

// Signup Controller
export const signUp = async (req, res) => {
  const { full_name, email, password } = req.body;
  console.log(req.body);
  
  // Simple validation
  if (!full_name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    // Check for existing user
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already in use.' });
    }
    console.log("existingUser:", existingUser);
    

    // Secure password hashing
    const hashedPassword = await bcrypt.hash(password, 12); // Increase salt rounds for better security
    console.log("hashedPassword:", hashedPassword);
    // Create user
    const user = await prisma.user.create({
      data: {
        full_name,
        email,
        password: hashedPassword,
      },
    });
 console.log('User created:', user);
    // Optional: generate and store refresh token
    const refreshToken = generateRefreshToken(user);
    await prisma.session.create({
      data: {
        user_id: user.id,
        refresh_token: refreshToken,
      },
    });
    console.log('Refresh token stored:', refreshToken);

    // Log the user creation
    console.log('User created successfully:', user);

    // Send access and refresh tokens
    const accessToken = generateAccessToken(user);

    res.status(201).json({
      message: 'User created successfully',
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        is_verified: user.is_verified,
      },
    });

  } catch (err) {
    console.error('SignUp Error:', err);
    console.log(err);
    
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
};


// Login
export const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    console.log("User found:", req.body);
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
   
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    
    await prisma.session.create({
      data: {
        user_id: user.id,
        refresh_token: refreshToken,
      },
    });

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        is_verified: user.is_verified,
      },
    });
    console.log('User logged in successfully:', user);
    
  } catch (err) {
    console.error('SignIn Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
