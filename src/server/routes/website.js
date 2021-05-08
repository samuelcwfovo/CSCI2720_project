//---------------------------------------------------
// Cheng Yun Chueng 1155109570
// Wong Kong Wa 1155127049
// Chow Wang Faat 1155115793
// Lau Pak Hei Anson 1155158646
//---------------------------------------------------

var express = require('express');
var router = express.Router();

const path = require('path');

const DIST_DIR = path.join(__dirname, '../../dist');
const HTML_FILE = path.join(DIST_DIR, 'index.html');

router.use(express.static(DIST_DIR));


router.get('/*', (req, res) => {
    res.sendFile(HTML_FILE);
});

module.exports = router;

