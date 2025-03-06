const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('../models/user');

const saltRounds = 10;

router.post('/sign-up', async (req, res) => {
  try {
    const userInDatabase = await User.findOne({ username: req.body.username });
    
    if (userInDatabase) {
      return res.status(409).json({error: 'Username already taken.'});
    }
    
    const hashedPassword = await bcrypt.hashSync(req.body.password, saltRounds);

    const user = await User.create({
      username: req.body.username,
      password: hashedPassword,
      role: req.body.role,
    });

    const payload = { username: user.username, role: user.role,_id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({message: "Sign-up successful.", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/sign-in', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const isPasswordCorrect = await bcrypt.compareSync(
      req.body.password, user.password
    );
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const payload = { username: user.username, role: user.role, _id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: "Sign-in successful.", token, user: { username: user.username, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/sign-out", (res) => {
  try {
    res.status(200).json({ message: "Sign-out successful." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
