const express = require("express");
const bcryptjs = require("bcryptjs");
const User = require("../models/user.js");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth.js");

const authRouter = express.Router();

authRouter.post("/api/sign-up", async (req, res) => {
    try{
        const {name, email, password} = req.body;

        const existingUser = await User.findOne({email});

        if(existingUser){

            return res.status(403).json({
                msg: "User with the same email already exists!"
            })
        }

        const hashedPassword = await bcryptjs.hash(`${password}`, 8);

        let user = User({
            name,
            email,
            password: hashedPassword
        });

        user = await user.save();
        res.json(user);
    }catch(e){
        res.status(500).json({
            error: e.message
        })
    };
})

authRouter.post("/api/sign-in", async (req, res) =>  {
    try{

        const{email, password} = req.body;

        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({msg: "User with the email address does not exist!"});
        }

        const isMatched = await bcryptjs.compare(password, user.password);

        if(!isMatched){
            return res.status(400).json({
                msg: "Incorrect password!"
            });
        }

        const token = jwt.sign({id: user._id}, "passwordKey");
        res.json({token, ...user._doc});


    }catch(e){
        res.status(500).json({error: e.message});
    }
})

authRouter.post("/tokenIsValid", async (req, res)=>{
    try{
        const token = req.header("x-auth-token");
        if(!token) return res.json(false);


        const verified = jwt.verify(token, "passwordKey");
        if(!verified) return res.json(false);

        const user = await User.findById(verified.id);
        
        if(!user) return res.json(false);

        return res.json(true);

    }catch(e){
        res.status(500).json({error: e.message});
    }
})

authRouter.get("/", auth, async (req, res)=>{
    const user = await User.findById(req.user);
    res.json({...user._doc, token: req.token});
})

module.exports = authRouter;