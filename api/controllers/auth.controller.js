import { prisma } from '../utils/db.js';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { validationResult } from 'express-validator';
import { Prisma } from '@prisma/client';

import  { serialize } from 'cookie';

export const register = async (req, res) => {
    //validate input data
    if (!req.body.username) return res.status(400).send('username Missing')
    if (!req.body.email) return res.status(400).send('email missing')
    if (!req.body.password) return res.status(400).send('password missing')
    
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
       const existingUser = await prisma.user.findUnique({
            where: { email: email }
        }) || await prisma.user.findUnique({
            where: { username: username }
        });
      
        if (existingUser) {
          return res.status(400).json({ message: 'Email or username already exists' });
        }
        const hashedPassword = bcryptjs.hashSync(password, 10);
        const user = await prisma.user.create({
            data: {
                username: username,
                email: email,
                password: hashedPassword,
                last_login: new Date(),
            },
        });
       
        return res.status(201).json("User has been created");
    } catch (error) {
        console.error('Error signing up user:', error);
        return res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!req.body.email) return res.status(400).send('email missing')
    if (!req.body.password) return res.status(400).send('password missing')
    
    //console.log('Login request:', email, password)
  
    try {
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase().trim() },
        });
        //console.log('User: confimation');
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        //console.log('User: ', user.user_id, user.email, user.username, user.role)
        const isPasswordValid = await bcryptjs.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials - incorrect password' });
        }

        //console.log("User logged in: ", user.user_id, user.email, user.username, user.role)
        const token = jwt.sign(
          {
            userId: user.user_id,
            email: user.email,
            role: user.role,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: '1h',
          }
        );

        // Update last login timestamp
        try {
            await prisma.user.update({
              where: { user_id: user.user_id },
              data: { last_login: new Date() },
            }); // Add closing parenthesis here
        } catch (updateError) {
            console.error("Error updating last login:", updateError);
              // Decide if you want to return an error response here or continue
        }

        const cookieOptions = {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
          sameSite: 'strict', // Prevent CSRF attacks
          maxAge: 60 * 60 * 1000, // 1 hours
          path: '/'
        };

        res.setHeader('Set-Cookie', serialize('token', token, cookieOptions));

        return res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                role: user.role,
            },
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          // The .code property can be accessed in a type-safe manner
          if (error.code === 'P2002') {
            console.log('There is a unique constraint violation, a new user cannot be created with this email')
          }
        } else if (error instanceof Prisma.PrismaClientValidationError) {
            return res.status(400).json({ message: 'Invalid data provided.' });
        } else if (error instanceof Prisma.PrismaClientRustPanicError) {
          return res.status(500).json({ message: 'An internal database error occurred.' });
        } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
          return res.status(500).json({ message: 'An unknown error occurred with the database request.' });
        } else if (error instanceof Prisma.PrismaClientInitializationError) {
          return res.status(500).json({ message: 'Failed to initialize database connection.' });
        }
        return res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
    }
};

export const logout = async (req, res) => {
    try {
      if (req.cookies.token) {
        res.clearCookie('token');
        return res.status(200).json({ message: 'Logged out successfully' });
      } else {
        return res.status(400).json({ message: 'No active session found' });
      }
    } catch (error) {
      console.error('Error logging out user:', error);
      return res.status(500).json({ 
        success: false,
        statusCode: 500,
        message: 'Internal Server Error',
        error: error.message 
      });
    }
  };
