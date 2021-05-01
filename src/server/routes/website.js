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

