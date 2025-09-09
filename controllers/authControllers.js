const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Activity } = require('../models');
require('dotenv').config();

const register = async (req, res) => {
  try {
    const { firstname, lastname, dob, nationality, residence, phone, email, password, role } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      firstname,
      lastname,
      dob,
      nationality,
      residence,
      phone,
      email,
      password: hashedPassword,
      role: role || 'buyer',
    });

    await Activity.create({
      userId: newUser.id,
      type: 'Account',
      action: 'Registered',
      detail: `Created account as ${newUser.role}`,
    });

    const token = jwt.sign(
      { id: newUser.id, role: newUser.role, isAdmin: newUser.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        email: newUser.email,
        role: newUser.role,
        isAdmin: newUser.isAdmin,
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    await Activity.create({
      userId: user.id,
      type: 'Account',
      action: 'Login',
      detail: 'Logged in successfully',
    });

    const token = jwt.sign(
      { id: user.id, role: user.role, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        isAdmin: user.isAdmin,
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'firstname', 'lastname', 'email', 'role', 'isAdmin', 'createdAt'],
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const updatedPassword = password ? await bcrypt.hash(password, 10) : user.password;

    await user.update({
      firstname: firstname || user.firstname,
      lastname: lastname || user.lastname,
      email: email || user.email,
      password: updatedPassword,
    });

    await Activity.create({
      userId: user.id,
      type: 'Profile',
      action: 'Updated',
      detail: 'Updated profile details',
    });

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        isAdmin: user.isAdmin,
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await user.destroy();

    await Activity.create({
      userId: req.user.id,
      type: 'Account',
      action: 'Deleted',
      detail: 'User account deleted',
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Current password is incorrect' });

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedNewPassword });

    await Activity.create({
      userId: req.user.id,
      type: 'Account',
      action: 'Password Change',
      detail: 'User changed password',
    });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to change password', error: error.message });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  deleteUser,
  changePassword,
};
