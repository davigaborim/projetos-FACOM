const { express } = require('../expressApp');
const router = express.Router();
const bcrypt = require('bcrypt');
const dbPool = require('../dbConnection');

const validateLogin = require("../middlewares/validateLogin");
const jwt = require("jsonwebtoken");

// HTTP CODES
const UNAUTHORIZED = 401;
const NOT_FOUND = 404;
const SERVER_ERR = 500;

const HASH_LIXO = "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4oK5mJ1Gse";

router.post("/fazerLogin", validateLogin, async (req, res) => {
    try {
        const login = req.login || req.body;

        if (!login.email || !login.password) {
            return res.status(400).json({ message: "Email ou senha não fornecidos!" });
        }

        const [managerQuery] = await dbPool.execute(
            "SELECT id, name, password_hash FROM managers WHERE email = ?",
            [login.email]
        );

        const manager = managerQuery[0] || null;
        const compararHash = manager ? manager.password_hash : HASH_LIXO;

        //comparar senha criptografada
        const senhaCorreta = await bcrypt.compare(login.password, compararHash);

        if (!manager || !senhaCorreta) {
            return res.status(UNAUTHORIZED).json({ message: "Email ou senha incorretos." });
        }

        const tokenPayload = {
            id: manager.id,
            email: login.email,
            name: manager.name,
            is_adm: true
        };

        let token;
        try {
            token = jwt.sign(
                tokenPayload,
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );
        } catch (jwtErr) {
            return res.status(SERVER_ERR).json({ message: "Erro ao gerar token."});
        }

        const responseData = {
            user: {
                id: manager.id,
                email: login.email,
                name: manager.name,
                is_adm: true
            },
            token: token
        };

        return res.status(200)
            .header('Content-Type', 'application/json; charset=utf-8')
            .json(responseData);

    }catch (err){
        return res.status(SERVER_ERR).json({ message: "Erro interno.", ...(process.env.NODE_ENV !== "production" && { error: err.message })
        });
    }
});

module.exports = router;