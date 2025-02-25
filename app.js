const express = require("express");
const path = require("path");
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const connectToMongoDb = require("./dbConnection");
const { requestLogger } = require("./middlewares/requestLogger");
const cookieParser = require("cookie-parser");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");
const Blog = require("./models/blog");
require("dotenv").config();


const app = express();
const PORT = process.env.PORT || 8000;

//middlewares
app.use(requestLogger("serverlog.txt"));
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

//view engine setup
app.set("view engine" , "ejs");
app.set("views", path.resolve("./views"));

connectToMongoDb(process.env.MONGO_URL).then(() => {
    console.log("MongoDB connected");
});

app.get("/" , async (req,res) => {
    const allBlogs = await Blog.find({});
    const blogsWithSummary = allBlogs.map(blog => {
      const truncatedContent = blog.body.length > 100 ? blog.body.substring(0, 97) + '...' : blog.content;
      return { ...blog.toObject(), summary: truncatedContent };
    });
    res.render("home", {
      user: req.user,
      blogs: blogsWithSummary
    });
});

app.use("/user",userRoute);
app.use("/blog", blogRoute);

app.listen(PORT, () => {
    console.log(`Server started at PORT: ${PORT}`);
})

