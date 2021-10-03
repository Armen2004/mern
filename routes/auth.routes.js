const { Router } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const router = Router();

router.post(
    '/register',
    [
        check('email', 'Incorrect Email').isEmail(),
        check('password', 'Min symbols 6').isLength({ min: 6 }),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Incorrect data in register!'
                })
            }
            const { email, password } = req.body;
            const candidate = await User.findOne({ email });
            if (candidate) {
                return res.status(400).json({ message: 'User exists!' });
            }
            const hashPass = await bcrypt.hash(password, 12);
            const user = new User({ email, password: hashPass });
            await user.save();
            res.status(201).json({ message: 'User created!' });
        } catch (e) {
            console.log('Error: ', e);
            res.status(500).json({ message: 'Please try again...!' })
        }
    }
);

router.post(
    '/login',
    [
        check('email', 'Enter correct Email').normalizeEmail().isEmail(),
        check('password', 'Enter password').exists(),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Incorrect data in login!'
                })
            }
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: 'User did not exist!' });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Password is incorrect!' });
            }
            const token = jwt.sign(
                { userId: user.id },
                config.get('jwtSecret'),
                { expiresIn: '1h' }
            );
            res.json({ token, userId: user.id });
        } catch (e) {
            res.status(500).json({ message: 'Please try again...!' })
        }
    }
);

module.exports = router;
