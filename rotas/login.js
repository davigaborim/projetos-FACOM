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

router.post("/fazerLogin", validateLogin, async (req, res) => {
    try {
        const login = req.login || req.body;

        if (!login.email || !login.password) {
            return res.status(400).json({ message: "Email ou senha não fornecidos!" });
        }

        console.log("Tentando login:", login.email);

        const exists = (await dbPool.query(
            "SELECT EXISTS (SELECT 1 FROM managers WHERE email = $1)",
            [login.email]
        )).rows[0].exists;

        if (!exists) {
            return res.status(NOT_FOUND).json({ message: "Administrador não encontrado!" });
        }

        const managerQuery = await dbPool.query(
            "SELECT id, name, password_hash FROM managers WHERE email = $1",
            [login.email]
        );

        const manager = managerQuery.rows[0];
        console.log("manager query result:", managerQuery.rows);

        //comparar senha criptografada
        const senhaCorreta = await bcrypt.compare(login.password, manager.password_hash);

        if (!senhaCorreta) {
            return res.status(UNAUTHORIZED).json({ message: "Senha incorreta!" });
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
            return res.status(SERVER_ERR).json({ message: "Erro ao gerar token", error: jwtErr.message });
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

    } catch (err) {
        return res.status(SERVER_ERR).json({ message: "Erro interno.", error: err.message });
    }
});

module.exports = router;