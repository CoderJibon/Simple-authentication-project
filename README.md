## Simple authentication project with node js, express js, mongodb, ejs template engine.

* Include Page:
    * Login Pag
    * Register page
    * Forget Password page
    * Profile Page
    * Profile Edit Page
    * Password Change Page
    * Profile Photo upload Page
    * Gallery Photo upload page
    * Find Friends Page Like Facebook
    * single Friend Profile Page
* Include Features:
    * Login
    * Register
    * Forget Password
    * Email Resent
    * Email Verification
    * Profile Info Edit/update/modify
    * Password Change,
    * Profile Photo Change/update,
    * Gallery Photo upload/Delete/single Photo View
    * Find Friend Follow/UNFollow
    * Single Friend Profile View
    * View Following List
    * View Follower List
    * Logout
* Include Livery:
    * Node
    * express
    * express-ejs-layouts
    * ejs
    * express-session
    * mongodb/mongoose
    * bcryptjs
    * chalk
    * cookie-parser
    * jsonwebtoken
    * multer
    * nodemailer
    * dotenv
    * magnificPopup

## Usage

If are you willing to download and use

```console
npm install 
```
## Server structure

```console
// file import
import express from "express";
import dotenv from "dotenv";
import notFoundPath404 from "./middlewares/notFound.js";
import expressEjslayout from "express-ejs-layouts";
import userRouter from "./routes/userRoutes.js";
import databaseConnection from "./config/db.js";
import chalk from "chalk";
import cookieParser from "cookie-parser";
import session from "express-session";
import { localsMiddlewares } from "./middlewares/localsMiddlewares.js";

//Environment variable
dotenv.config();
const PORT = process.env.PORT || 4040;

//express init
const app = express();

//middleware init
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//express static folder
app.use(express.static("public"));

//session init
app.use(
  session({
    secret: "we love node",
    resave: false,
    saveUninitialized: true,
  })
);

// locals init
app.use(localsMiddlewares);

//ejs init
app.set("view engine", "ejs");
app.use(expressEjslayout);
app.set("layout", "layouts/app");

//express router init
app.use(userRouter);

//server path not found 404
app.use(notFoundPath404);

//server listen
app.listen(PORT, async () => {
  await databaseConnection();
  console.log(chalk.bgCyan.black(`server running on port: ${PORT}`));
});

```
