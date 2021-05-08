//---------------------------------------------------
// Cheng Yun Chueng 1155109570
// Wong Kong Wa 1155127049
// Chow Wang Faat 1155115793
// Lau Pak Hei Anson 1155158646
//---------------------------------------------------

const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
    if (!req.cookies) { return res.status(401).json({ code: 1, description: "cookies not found" }) }

    const token = req.cookies.token;

    if (!token) { return res.status(401).json({ code: 1, description: "token not found" }) }

    jwt.verify(token, accessTokenSecret, function (err, decoded) {
        if (err) return res.status(401).json({ code: 1, error: err, description: "token can not decode/ verify." });

        if (decoded.userId && decoded.userName) {

            //check is account valid. otherwise auth will pass if account delete in db.
            UserModel.findOne({ 'userName': decoded.userName })
                .exec(function (err, user) {
                    if (err) return res.status(500).json({ code: 0, error: err, description: "db find user error." });
                    if (!user) return res.status(401).json({ code: 1, description: "username not found." });

                    const token = jwt.sign({ userId: decoded.userId, userName: decoded.userName, admin: decoded.admin }, accessTokenSecret, { expiresIn: '1h' })


                    res.cookie('token', token, { maxAge: 900000 });

                    req.decoded = decoded
                    next()
                })
        }

    });
};

module.exports = {authenticateJWT}