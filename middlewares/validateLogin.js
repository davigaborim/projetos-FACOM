const { Login, DEFAULT_MESSAGE } = require("../myClasses");

module.exports = function validateLogin(req, res, next) {
    const login = new Login(req.body.email, req.body.password);
    login.validateData();

    if (login.status !== DEFAULT_MESSAGE) {
        return res.status(400).json({ message: login.status });
    }

    req.login = login;
    next();
};
