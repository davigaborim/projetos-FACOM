const { UserManager, DEFAULT_MESSAGE } = require("../myClasses");

module.exports = function validateManager(req, res, next) {
    const manager = new UserManager(
        req.body.name,
        req.body.email,
        req.body.password,
        req.body.passwordRepeat
    );

    manager.validateData();

    if (manager.status !== DEFAULT_MESSAGE) {
        return res.status(400).json({ message: manager.status });
    }

    req.manager = manager;
    next();
};
