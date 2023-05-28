var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require('cors');


var commentairesRouter = require("./routes/commentaires");
var usersRouter = require("./routes/users");
var articlesRouter = require("./routes/articles");
var categoriesRouter = require("./routes/categories");
var authRouter = require("./routes/auth");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({credentials:true ,origin:'http://localhost:3000'}));
app.use(express.static(path.join(__dirname, "public")));





app.use("/auth", authRouter);


//app.use(verifyToken);
app.use("/articles", articlesRouter);
app.use("/commentaires", commentairesRouter);
app.use("/users", usersRouter);
app.use("/categories", categoriesRouter);



module.exports = app;
