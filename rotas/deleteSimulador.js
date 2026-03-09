const express = require("express");
const router = express.Router();
const dbPool = require("../dbConnection");
const fs = require("fs");
const path = require("path");

router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await dbPool.query(
            "SELECT images, manual, articles FROM simulators WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Simulador não encontrado." });
        }

        const { images, manual, articles } = result.rows[0];

        const basePath = path.join(__dirname, "..", "arquivos_simuladores");

        if (images && images.length > 0) {
            images.forEach(img => {
                const imgPath = path.join(basePath, img);

                console.log("Tentando apagar:", imgPath);
                console.log("Existe?", fs.existsSync(imgPath));

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

        await dbPool.query("DELETE FROM simulators WHERE id = $1", [id]);

        res.status(200).json({ message: "Simulador deletado com sucesso!" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erro ao deletar simulador." });
    }
});

module.exports = router;