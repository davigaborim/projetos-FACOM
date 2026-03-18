const { express } = require("../expressApp");
const router = express.Router();
const bcrypt = require("bcrypt");
const dbPool = require("../dbConnection");

const validateManager = require("../middlewares/validateManager");

const CREATED = 201;
const CONFLICT = 409;
const SERVER_ERR = 500;

router.post("/cadastrarAdm", validateManager, async (req, res) => {
    try {
        const manager = req.manager;

        //criptografar senha
        const hash = await bcrypt.hash(manager.password, 12);

        await dbPool.execute(
            "INSERT INTO managers (name, email, password_hash) VALUES (?, ?, ?)",
            [manager.name, manager.email, hash]
        );

        return res.status(CREATED).json({
            message: "Administrador cadastrado com sucesso!",
            admin: {
                name: manager.name,
                email: manager.email
            }
        });

    } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
            return res.status(CONFLICT).json({
                message: "Este email já está cadastrado."
            });
        }

        if (process.env.NODE_ENV !== "production") {
            console.error("Erro na rota /cadastrarAdm", err);
        }

        res.status(SERVER_ERR).send("Erro ao cadastrar administrador.");
    }
});

//Deletar admin

/*
router.delete("/deletar/:id", async (req, res) => {
    try {
        const { id } = req.params;
        
        if (parseInt(id) === req.user.id) {
            return res.status(BAD_REQUEST).json({
                message: "Você não pode deletar sua própria conta!"
            });
        }
        
        const result = await dbPool.query(
            "DELETE FROM managers WHERE id = $1 RETURNING email",
            [id]
        );
        
        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "Administrador não encontrado."
            });
        }
        
        return res.status(200).json({
            message: "Administrador deletado com sucesso!"
        });
        
    } catch (err) {
        console.error("Erro ao deletar admin:", err);
        return res.status(SERVER_ERR).json({
            message: "Erro ao deletar administrador."
        });
    }
});
*/

module.exports = router;
