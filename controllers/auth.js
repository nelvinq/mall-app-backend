const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const saltRounds = 10;

router.post('/sign-up', async (req, res) => {
  try {
    const userInDatabase = await User.findOne({ username: req.body.username });
    
    if (userInDatabase) {
      return res.status(409).json({err: 'Username already taken.'});
    }
    
    const hashedPassword = bcrypt.hashSync(req.body.password, saltRounds);

    const user = await User.create({
      username: req.body.username,
      password: hashedPassword,
      role: req.body.role,
    });

    const payload = { username: user.username, role: user.role,_id: user._id };

    const token = jwt.sign(payload, process.env.JWT_SECRET);

    res.status(201).json({message: "Sign-up successful.", token });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.post('/sign-in', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(401).json({ err: 'Invalid credentials.' });
    }

    const isPasswordCorrect = bcrypt.compareSync(
      req.body.password, user.password
    );
    if (!isPasswordCorrect) {
      return res.status(401).json({ err: 'Invalid credentials.' });
    }

    const payload = { username: user.username, role: user.role, _id: user._id };

    const token = jwt.sign(payload, process.env.JWT_SECRET);

    res.status(200).json({ message: "Sign-in successful.", token });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.get("/sign-out", (req, res) => {
  try {
    res.status(200).json({ message: "Sign-out successful." });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
