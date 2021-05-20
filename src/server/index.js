//---------------------------------------------------
// Cheng Yun Chueng 1155109570
// Wong Kong Wa 1155127049
// Chow Wang Faat 1155115793
// Lau Pak Hei Anson 1155158646
//---------------------------------------------------

const express = require('express');
require('dotenv').config();

const app = express();

app.use(require('./routes/api'));

app.use(require('./routes/website'));

app.listen(process.env.PORT);
