const express = require('express');
require("dotenv").config();
const {connectMongo, initializeRole} = require('./dbInit/dbcontext');

connectMongo();
initializeRole();
const app = express();

const PORT = 5000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));