const express = require("express");
const router = express.Router();

const {login,signup} = require("../Controllers/Auth");
const {auth,isStudent,isAdmin} = require("../middlewares/middleware");

router.post("/login",login);
router.post("/signup",signup);
 
// protected test route single middleware
router.get("/test",auth,(req,res)=>{
    res.json({
        success:true,
        message:'Welcome to the Protetcted test route',
    });
});

// Protected Route
router.get("/student",auth,isStudent,(req,res)=>{
    try{
        res.json({
            success:true,
            message:'Welcome to the Protected route for students',
        });
    }
    catch(error){
        return res.status(401).json({
            success:false,
            message:error.message,
        })
    }
});

router.get("/admin",auth,isAdmin,(req,res)=>{
    res.json({
        success:true,
        message:'Welcome to the Protected route for admin',
    });
});

module.exports = router;