const jwt = require("jsonwebtoken");

module.exports = function authJWT(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "Token não enviado." });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        if (process.env.NODE_ENV !== "production") {
            console.error("JWT inválido:", err);
        }
        return res.status(401).json({ message: "Token inválido ou expirado." });
    }
};
