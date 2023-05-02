const express = require("express");
const app = express();

require('dotenv').config();

const PORT=process.env.PORT || 4000;
app.use(express.json());

require("./config/database").connect();

// route import and mount

const user=require("./routes/route");
app.use("/api/v1",user);

// server activation

app.listen(PORT,()=>{
    console.log(`App is Listening at ${PORT}`); 
})