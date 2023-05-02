const bcrypt = require('bcrypt');
const User = require("../model/User");
const jwt = require("jsonwebtoken");

require("dotenv").config();

//  signup route handler

exports.signup = async (req,res)=>{
    try{
        // get data
        const {name,email,password,role}= req.body;
        // check if user already exists
        const existingUser = await User.find({email});
        if(!existingUser){
            return res.status(400).json({
                sucess:false,
                message:'User already Exists',
                
            });
        }

        // secure password
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password,10);
        }catch(error){
            return res.status(500).json({
                sucess:false,
                message:'Error in hashing Password',
            })
        }

        // create entry for user

        const user = await User.create({
            name,email,password:hashedPassword,role
        });
        return res.status(200).json({
            sucess:true,
            message:'User created succesfully',
        })
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'User cannot be registered, pleae try agin later',
        });
    }
}


//  login route handler

exports.login = async (req,res)=>{

    try{
        // data fetch
        const {email,password} = req.body;

        // validation on email and password
        if(!email || !password){
            return res.status(400).json({
                sucess:false,
                message:'Please fill all the details carefully',
            });
        }
        // check for registered user
        let user = await User.findOne({email});

        // if not a registered user
        if(!user){
            return res.status(401).json({
                success:false,
                message:'User is not registered',
            })
        }

        const payload = {
            email:user.email,
            id:user._id,
            role:user.role,
        }

        // verify password and generate a JWT token
        if(await bcrypt.compare(password,user.password)){
            // password match
            
            // token created
            let token = jwt.sign(payload,
                                process.env.JWT_SECRET,
                                {
                                    expiresIn:"2h"
                                });
            
            user = user.toObject();
            user.token = token;
            // console.log(user);
            user.password = undefined;
            // console.log(user);
            const options ={
                expires: new Date(Date.now()+3*24*60*60*100),
                httpOnly:true,
            }

            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,
                message:'User Logged in Successfully',
            })

        }else{
            // password donot match
            return res.status(403).json({
                success:false,
                message:'Incorrect password',
            });
        }


    }catch(error){

        console.log(error);
        return res.status(500).json({
            success:false,
            message:'login failure',
        })
    }

}