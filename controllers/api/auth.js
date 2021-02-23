const jwt = require('jsonwebtoken');

const models = require('../../models');
const jwtConfig = require('../../config/jwt.js');

exports.postLogin = (req, res, next) => {
    const user = models.User.findUserByName(req.body.username).then (([user, fieldData]) => {
        if (user.length>0) {
            user = user[0];
            console.log(user);
            
            if (models.User.checkPassword(user, req.body.password)) {
                const token = jwt.sign({ username: req.body.username }, jwtConfig.jwtSecret, jwtConfig.jwtOptions);

                res.json({ Status: "Login successful", token });
            } else {
                res.status(403).json({ Error: { Message: "Incorrect password" }});
            }
        } else {
            res.status(403).json({ Error: { Message: "No such user" }});
        }
    })
}

exports.postSignup = (req, res, next) => {
    models.User.createUser(req.body);
    res.json({ Status: "New user created" });
}

exports.checkJWT = (req, res, next) => {
    if (!req.body.token) {
        res.status(403).json({ Error: { Message: "JWT required"}});
        return;
    }

    try {
        const token = jwt.verify(req.body.token, jwtConfig.jwtSecret);

        if (!token || !token.username) {
            res.status(403).json({ Error: { Message: "Invalid JWT"}});
        } else {
            next();
        }
    } catch (err) {
        console.log('Error verifying JWT:', err.message);
        res.status(403).json({ Error: { Message: "Invalid JWT"}});
    }
}