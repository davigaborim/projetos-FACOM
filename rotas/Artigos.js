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

router.get("/simuladores/:id/artigos", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await dbPool.query(
            `SELECT id, name, manual, articles
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

        const simulador = result.rows[0];

        simulador.manual = parseIfJson(simulador.manual);
        simulador.articles = parseIfJson(simulador.articles);

        res.status(200).json({
            success: true,
            simulador
        });

    } catch (err) {
        console.error("Erro ao buscar materiais de apoio:", err);
        res.status(500).json({
            success: false,
            message: "Erro ao buscar pateriais de apoio"
        });
    }
});

module.exports = router;