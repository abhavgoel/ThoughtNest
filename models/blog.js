const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    title : {
        type:String ,
        required: true,
    }
})