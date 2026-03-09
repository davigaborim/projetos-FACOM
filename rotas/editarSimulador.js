const express = require("express");
const router = express.Router();
const dbPool = require("../dbConnection");
const upload = require("../middlewares/uploadConfig");
const fs = require("fs");
const path = require("path");

router.put("/:id", (req, res) => {
    upload.fields([
        { name: "images", maxCount: 10 },
        { name: "manual", maxCount: 1 },
        { name: "articles", maxCount: 15 }
    ])(req, res, async (err) => {
        if (err){
            return res.status(400).json({ message: err.message });
        }

        const simuladorId = req.params.id;

        try {
            const { name, description, repo_link, keepOldImages, keepOldArticles } = req.body;

            const result = await dbPool.query(
                "SELECT * FROM simulators WHERE id = $1",
                [simuladorId]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ message: "Simulador não encontrado." });
            }

            const atual = result.rows[0];

            const basePath = path.join(__dirname, "..", "arquivos_simuladores");
            let imagensFinais = [];
            let artigosFinais = [];

            //Se não manter imagens antigas, deletar as antigas
            if (keepOldImages !== "true" && atual.images && atual.images.length > 0) {
                atual.images.forEach(img => {
                    const imgPath = path.join(basePath, img);
                    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
                });
            } else if (keepOldImages === "true") {
                imagensFinais = atual.images || [];
            }

            //Novas imagens
            const novasImagens = (req.files.images || []).map(img => img.filename);
            imagensFinais = [...imagensFinais, ...novasImagens];

            //Se tiver novo manual, deletar o antigo
            let manualFinal = atual.manual;
            if (req.files.manual && req.files.manual.length > 0) {
                if (atual.manual) {
                    const manualPath = path.join(basePath, atual.manual);
                    if (fs.existsSync(manualPath)) fs.unlinkSync(manualPath);
                }
                manualFinal = req.files.manual[0].filename;
            }

            //Se não manter os artigos antigos, deleta-los
            if (keepOldArticles !== "true" && atual.articles && atual.articles.length > 0) {
                atual.articles.forEach(article => {
                    const articlePath = path.join(basePath, article);
                    if (fs.existsSync(articlePath)) fs.unlinkSync(articlePath);
                });
            } else if (keepOldArticles === "true") {
                artigosFinais = atual.articles || [];
            }

            //Novos artigos
            const novosArtigos = (req.files.articles || []).map(article => article.filename);
            artigosFinais = [...artigosFinais, ...novosArtigos];

            const repoFinal = repo_link !== undefined ? (repo_link.trim() === "" ? null : repo_link.trim()) : atual.repo_link;

            await dbPool.query(
                `UPDATE simulators
                 SET name = $1,
                     description = $2,
                     repo_link = $3,
                     images = $4,
                     manual = $5,
                     articles = $6
                 WHERE id = $7`,
                [
                    name || atual.name,
                    description || atual.description,
                    repoFinal,
                    imagensFinais,
                    manualFinal,
                    artigosFinais,
                    simuladorId
                ]
            );

            return res.json({ message: "Simulador atualizado com sucesso!" });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Erro interno no servidor." });
        }
    });
});

module.exports = router;
