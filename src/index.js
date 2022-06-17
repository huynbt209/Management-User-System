const express = require('express');
require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");
const path= require('path');
bodyParser = require("body-parser");
const passportConfig = require("./middleware/auth");
const passport = require("passport");
const {connectMongo, initializeRole} = require('./dbInit/dbcontext');
const http = require("http");

const app = express();
const server = http.createServer(app);


global.__basedir = __dirname;
connectMongo();
initializeRole();


app.use(cors({ origin: "*", credentials: false }));
app.use(morgan("dev"));
app.use(express.json());
app.use(passport.initialize());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')))
app.use("assets", express.static("assets"));


const authRouter = require('./routes/auth');
const indexRouter = require('./routes/index');
const adminRouter = require('./routes/admin');
const chatRouter = require('./routes/chat');
const chat = require('./routes/socket');


app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/admin', adminRouter);
app.use('/room', chatRouter);
chat(server);

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));