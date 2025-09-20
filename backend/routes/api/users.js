const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { auth, admin } = require('../../middleware/auth');

// User model
const User = require('../../models/User');

// @route   POST api/users/register
// @desc    Register new user
// @access  Public
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  // Simple validation
  if (!name || !email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  User.findOne({ email }).then(user => {
    if (user) return res.status(400).json({ msg: 'User already exists' });

    // Make the first registered user an admin
    User.countDocuments().then(count => {
      const role = count === 0 ? 'admin' : 'staff';
      const newUser = new User({
        name,
        email,
        password,
        role,
      });

      // Create salt & hash
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser.save().then(user => {
            jwt.sign(
              { id: user.id, role: user.role },
              'your_jwt_secret',
              { expiresIn: 3600 },
              (err, token) => {
                if (err) throw err;
                res.json({
                  token,
                  user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                  },
                });
              }
            );
          });
        });
      });
    });
  });
});

// @route   POST api/users/add-staff
// @desc    Add a staff user
// @access  Private/Admin
router.post('/add-staff', [auth, admin], (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  User.findOne({ email }).then(user => {
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const newUser = new User({
      name,
      email,
      password,
      role: 'staff',
    });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser.save().then(user => {
          res.json({
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            },
          });
        });
      });
    });
  });
});

// @route   GET api/users/auth
// @desc    Get user data
// @access  Private
router.get('/auth', auth, (req, res) => {
  User.findById(req.user.id)
    .select('-password')
    .then(user => res.json(user));
});

// @route   POST api/users/login
// @desc    Login user
// @access  Public
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Simple validation
  if(!email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  User.findOne({ email })
    .then(user => {
      if(!user) return res.status(400).json({ msg: 'User does not exist' });

      // Validate password
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if(!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

          jwt.sign(
            { id: user.id, role: user.role },
            'your_jwt_secret', // replace with a secret from config/env
            { expiresIn: 3600 },
            (err, token) => {
              if(err) throw err;
              res.json({
                token,
                user: {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  role: user.role
                }
              });
            }
          )
        })
    })
});

module.exports = router;
