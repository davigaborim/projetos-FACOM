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
        const [result] = await dbPool.execute(
            `SELECT id, name, description, repo_link, images, manual, articles
             FROM simulators 
             ORDER BY name ASC`
        );

        const simuladores = result.map(sim => ({
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
        if (process.env.NODE_ENV !== "production") {
            console.error("Erro ao buscar simuladores:", err);
        }
        res.status(500).json({
            success: false,
            message: "Erro ao buscar simuladores"
        });
    }
});

module.exports = router;
