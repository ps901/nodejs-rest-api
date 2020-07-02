const express=require("express");
const router = express.Router();
const mongoose=require("mongoose");
const User=require("../models/user");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");


router.post("/signup",(req,res,next) => {
    
    User.find({email: req.body.email}).exec()
    .then(user=>{
        //we get empty array so we use length
        if(user.length>=1)
        {
            //can use 409 or 422
            return res.status(409).json({
                message: "Email already exist"
            })
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err) {
                    return res.status(500).json({
                        error: err
                    })
                }
                else {
                    const user=new User({
                        _id: mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    })
                    user.save()
                    .then(result => {
                        console.log(result);
                        res.status(201).json({
                            message: "user created"
                        })
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        })
                    })
                }
            })
        }
    })
});

router.post("/login", (req,res,next) => {
    User.find({email: req.body.email}).exec()
    .then(user => {
        if(user.length < 1)
        {
            //can do this but prone to brute force attack
            // return res.status(404).json({
            //     message: "Mail not found, user doesnt exist"
            // })
            return res.status(401).json({
                mmessage: "Authorization failed"
            })
        }
        //user[0] because we use find not findone 
        bcrypt.compare(req.body.password, user[0].password, (err,result)=> {
            if(err)
            {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            if(result)
            {
                //we can put it in callback or use a const
                const token = jwt.sign({
                    email: user[0].email,
                    userId: user[0]._id
                }, 
                process.env.JWT_KEY,
                {
                    expiresIn: "1h"
                })
                return res.status(200).json({
                    message: "Auth Successful",
                    token: token
                })
            }
            res.status(401).json({
                message: "Auth failed"
            })

        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
})

router.delete("/:userId",(req,res,next) => {
    User.remove({_id: req.params.userId}).exec()
    .then(result => {
        res.status(200).json({
            message: "User deleted"
        })
    })

    //doest really work if we delete user again as it doesnt throw err 
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

module.exports=router;


//since there is no session need not put logout
//salting:random string is added to users password to make password more secure
//   so that use of dictionary is not possible. a dictionary is pre calculated pass value
//   for certain basic strings likee password/ qwerty etc
