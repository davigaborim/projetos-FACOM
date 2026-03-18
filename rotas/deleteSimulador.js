const express = require("express");
const router = express.Router();
const dbPool = require("../dbConnection");
const fs = require("fs");
const path = require("path");

router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await dbPool.execute(
            "SELECT images, manual, articles FROM simulators WHERE id = ?",
            [id]
        );

        if (result.length === 0) {
            return res.status(404).json({ message: "Simulador não encontrado." });
        }

        const images = JSON.parse(result[0].images || "[]");
        const articles = JSON.parse(result[0].articles || "[]");
        const manual = result[0].manual;

        const basePath = path.join(__dirname, "..", "arquivos_simuladores");

        if (images && images.length > 0) {
            images.forEach(img => {
                const imgPath = path.join(basePath, img);
                if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
            });
        }

        if (manual) {
            const manualPath = path.join(basePath, manual);
            if (fs.existsSync(manualPath)) fs.unlinkSync(manualPath);
        }

        if (articles && articles.length > 0) {
            articles.forEach(article => {
                const articlePath = path.join(basePath, article);
                if (fs.existsSync(articlePath)) {
                    fs.unlinkSync(articlePath);
                }
            });
        }

        await dbPool.execute("DELETE FROM simulators WHERE id = ?", [id]);

        res.status(200).json({ message: "Simulador deletado com sucesso!" });

    } catch (err) {
        if (process.env.NODE_ENV !== "production") {
            console.error(err);
        }
        res.status(500).json({ message: "Erro ao deletar simulador." });
    }
});

module.exports = router;