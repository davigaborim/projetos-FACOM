const express = require("express");
const router = express.Router();
const dbPool = require("../dbConnection");

//Converter JSON salvo como string
function parseIfJson(value) {
    if (typeof value === "string") {
        try {
            return JSON.parse(value);
        } catch (e) {
            return value;
        }
    }
    return value;
}

router.get("/listarSimuladores", async (req, res) => {
    try {
        const result = await dbPool.query(
            `SELECT id, name, description, repo_link, images, manual, articles
             FROM simulators 
             ORDER BY name ASC`
        );

        const simuladores = result.rows.map(sim => ({
            ...sim,
            images: parseIfJson(sim.images),
            manual: parseIfJson(sim.manual),
            articles: parseIfJson(sim.articles)
        }));

        res.status(200).json({
            success: true,
            simuladores
        });

    } catch (err) {
        console.error("Erro ao buscar simuladores:", err);
        res.status(500).json({
            success: false,
            message: "Erro ao buscar simuladores"
        });
    }
});


// Buscar por ID
router.get("/listarSimuladores/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await dbPool.query(
            `SELECT id, name, description, repo_link, images, manual, articles
             FROM simulators 
             WHERE id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Simulador não encontrado"
            });
        }

        const sim = result.rows[0];

        res.status(200).json({
            success: true,
            simulador: {
                ...sim,
                images: parseIfJson(sim.images),
                manual: parseIfJson(sim.manual)
            }
        });

    } catch (err) {
        console.error("Erro ao buscar simulador:", err);
        res.status(500).json({
            success: false,
            message: "Erro ao buscar simulador"
        });
    }
});

module.exports = router;
