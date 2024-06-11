const express = require('express')
const { Router } = require('express');
const router = Router();
const userRouter = require('./userRouter');
const accountRouter = require('./accountRouter')


router.use("/user",userRouter);
router.use("/account",accountRouter);

module.exports = router;
