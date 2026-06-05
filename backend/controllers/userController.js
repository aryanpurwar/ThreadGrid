import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import User from '../models/User.js';

const sendUser = (res, user) => {
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id)
  });
};

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role = 'customer', adminCode } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email and password are required');
  }

  if (!['customer', 'admin'].includes(role)) {
    res.status(400);
    throw new Error('Invalid account type');
  }

  if (role === 'admin') {
    const expectedAdminCode = process.env.ADMIN_INVITE_CODE || 'threadgrid-admin';

    if (adminCode !== expectedAdminCode) {
      res.status(403);
      throw new Error('Invalid admin invite code');
    }
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(409);
    throw new Error('User already exists');
  }

  const user = await User.create({ name, email, password, role });
  res.status(201);
  sendUser(res, user);
});

export const authUser = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    if (role && user.role !== role) {
      res.status(403);
      throw new Error(`This email is registered as a ${user.role}`);
    }

    sendUser(res, user);
    return;
  }

  res.status(401);
  throw new Error('Invalid email or password');
});

export const getUserProfile = asyncHandler(async (req, res) => {
  res.json(req.user);
});
