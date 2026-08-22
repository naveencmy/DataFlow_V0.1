import User from '../models/User.js';
import { signToken } from '../config/jwt.js';

// POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { loginId, password } = req.body;

    if (!loginId || !password) {
      return res.status(400).json({ success: false, message: 'loginId and password are required.' });
    }

    // Find user by loginId or email (both are valid login identifiers)
    const user = await User.findOne({
      $or: [{ loginId }, { email: loginId.toLowerCase() }],
      isActive: true,
    }).select('+passwordHash');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const token = signToken({ id: user._id, role: user.role });

    res.status(200).json({
      success: true,
      token,
      user: user.toSafeJSON(),
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/me
export const getMe = async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
};

// PUT /api/auth/change-password
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'currentPassword and newPassword are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
    }

    const user = await User.findById(req.user._id).select('+passwordHash');
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect.' });
    }

    user.passwordHash = newPassword; // pre-save hook will hash this
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully.' });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/logout (stateless JWT — client discards token)
export const logout = (req, res) => {
  res.status(200).json({ success: true, message: 'Logged out successfully.' });
};
