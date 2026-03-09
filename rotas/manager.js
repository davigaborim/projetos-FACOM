const { express } = require("../expressApp");
const router = express.Router();
const bcrypt = require("bcrypt");
const dbPool = require("../dbConnection");

const validateManager = require("../middlewares/validateManager");

const CREATED = 201;
const UNAUTHORIZED = 401;
const SERVER_ERR = 500;

router.post("/cadastrarAdm", validateManager, async (req, res) => {
    try {
        const manager = req.manager;

        //criptografar senha
        const hash = await bcrypt.hash(manager.password, 10);

        await dbPool.query(
            "INSERT INTO managers (name, email, password_hash) VALUES ($1, $2, $3)",
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
        if (err.code === "23505") {
            const match = err.detail.match(/Key \(([^)]+)\)=\(([^)]+)\)/);
            return res.status(UNAUTHORIZED).json({
                message: `${match[1]} ${match[2]} já está cadastrado.`
            });
        }

        console.error("Erro na rota /cadastrarAdm", err);
        res.status(SERVER_ERR).send("Erro ao cadastrar ADM.");
    }
});

//Deletar admin
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

module.exports = router;
