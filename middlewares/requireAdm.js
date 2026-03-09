module.exports = function requireAdm(req, res, next) {
    if (!req.user || req.user.is_adm !== true) {
        return res.status(403).json({ message: "Acesso negado." });
    }
    next();
};
