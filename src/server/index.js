const express = require('express');
require('dotenv').config();

const app = express();

app.use(require('./routes/api'));

app.use(require('./routes/website'));

app.listen(process.env.PORT);
