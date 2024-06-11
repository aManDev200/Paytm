const express = require('express');
const { Router } = require('express');
const cors = require('cors');
const zod = require('zod');
const router = Router();
const jwt = require('jsonwebtoken');
const { User, Account } = require('../db');
const { validateUserIsThere, authMiddleware } = require('./usermiddleware');
const JWT_SECRET = require('../config');

// Middleware
router.use(cors());
router.use(express.json());

// Zod Schemas
const usernameSchema = zod.string().email();
const passwordSchema = zod.string().min(6);
const firstnameSchema = zod.string().min(3);
const lastnameSchema = zod.string();

// POST /signup
router.post('/signup', validateUserIsThere, async (req, res) => {
    const { username, password, firstname, lastname } = req.body;

    const usernameValidation = usernameSchema.safeParse(username);
    const passwordValidation = passwordSchema.safeParse(password);
    const firstnameValidation = firstnameSchema.safeParse(firstname);
    const lastnameValidation = lastnameSchema.safeParse(lastname);

    if (!usernameValidation.success || !passwordValidation.success || !firstnameValidation.success || !lastnameValidation.success) {
        return res.status(400).json({
            msg: 'The input you provided is incorrect, kindly fill the box again'
        });
    }

    try {
        const response = await User.create({
            username,
            password,
            firstname,
            lastname
        });

        if (response) {
            const response2 = await Account.create({
                userId: response._id,
                balance: 1 + Math.random() * 10000,
            });

            const token = jwt.sign({ userId: response._id }, JWT_SECRET); 

            if (response2) {
                return res.status(201).json({
                    msg: "User Created Successfully",
                    token: token
                });
            }
        }
    } catch (e) {
        return res.status(500).json({
            msg: "Internal Server Error"
        });
    }
});

// POST /signin
router.post('/signin', async (req, res) => {
    const { username, password } = req.body;

    try {
        const response = await User.findOne({ username, password });

        if (response) {
            const token = jwt.sign({ userId: response._id }, JWT_SECRET);
            return res.status(200).json({
                msg: "Genuine User",
                token: token
            });
        } else {
            return res.status(401).json({
                msg: "Invalid username or password"
            });
        }
    } catch (e) {
        return res.status(500).json({
            msg: "Internal Server Error"
        });
    }
});

// PUT / (Update User)
router.put('/', authMiddleware, async (req, res) => {
    const { password, firstname, lastname } = req.body;

    const passwordValidation = passwordSchema.safeParse(password);
    const firstnameValidation = firstnameSchema.safeParse(firstname);
    const lastnameValidation = lastnameSchema.safeParse(lastname);

    if (!passwordValidation.success || !firstnameValidation.success || !lastnameValidation.success) {
        return res.status(400).json({
            msg: "Please provide valid credentials"
        });
    }

    try {
        await User.updateOne({ _id: req.userId }, { password, firstname, lastname });
        return res.json({
            msg: "Updated Successfully"
        });
    } catch (e) {
        return res.status(500).json({
            msg: "Internal Server Error"
        });
    }
});

// GET /bulk
router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    try {
        const users = await User.find({
            $or: [{
                firstname: { "$regex": filter, "$options": "i" }
            }, {
                lastname: { "$regex": filter, "$options": "i" }
            }]
        });

        res.json({
            user: users.map(user => ({
                username: user.username,
                firstname: user.firstname,
                lastname: user.lastname,
                _id: user._id
            }))
        });
    } catch (e) {
        return res.status(500).json({
            msg: "Internal Server Error"
        });
    }
});

module.exports = router;