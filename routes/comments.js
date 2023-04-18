const mongoose = require("mongoose");
const express = require("express");

const commentsRouter = express.Router();

commentsRouter.post("/comments/addComment", async (req, res) => {
    const {userId, description} = req.body;
    console.log({
        userId,
        description
    });
    try {
        res.status(200).json({
            userId,
            description
        })
    } catch (error) {
        res.status(400).send(error);
    }
})

module.exports = commentsRouter;