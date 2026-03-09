const jwt = require("jsonwebtoken");

module.exports = function authJWT(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "Token não enviado." });
    }

    const token = authHeader.split(" ")[1]; // "Bearer <token>"

    console.log("Authorization header:", authHeader);
    console.log("Token extraído:", token);
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Token decodificado:", decoded);
        req.user = decoded;

        next();
    } catch (err) {
        console.error("JWT inválido:", err);
        return res.status(401).json({ message: "Token inválido ou expirado." });
    }
};
