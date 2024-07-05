const express = require("express");
const path = require("path");
const userRoute = require("./routes/user");
const connectToMongoDb = require("./dbConnection");

const app = express();
const PORT = 8000;

app.use(express.urlencoded({extended: false}));

app.set("view engine" , "ejs");
app.set("views", path.resolve("./views"));

connectToMongoDb("mongodb://127.0.0.1:27017/thoughtnest").then(() => {
    console.log("MongoDB connected");
});

app.get("/" , (req,res) => {
    res.render("home");
})

app.use("/user",userRoute);

app.listen(PORT, () => {
    console.log(`Server started at PORT: ${PORT}`);
})

