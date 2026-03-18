const express = require("express");
const router = express.Router();
const dbPool = require("../dbConnection");
const upload = require("../middlewares/uploadConfig");
const authJWT = require("../middlewares/authJWT.js");

router.post("/", authJWT, (req, res) => {
    upload.fields([
        { name: "images", maxCount: 10 },
        { name: "manual", maxCount: 1 },
        { name: "articles", maxCount: 15 }
    ])(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        try {
            const { name, description, repo_link, no_link } = req.body;
            
            if (!name || !description) {
                return res.status(400).json({ message: "Dados incompletos!" });
            }

            if (no_link !== "true" && (!repo_link || repo_link.trim() === "")) {
                return res.status(400).json({ message: "Informe o link do repositório ou marque que não possui." });
            }

            const imagePaths = (req.files.images || []).map(f => f.filename);
            const manualPath = req.files.manual ? req.files.manual[0].filename : null;
            const articlesPaths = (req.files.articles || []).map(f => f.filename);

            await dbPool.execute(
                `INSERT INTO simulators (name, description, repo_link, images, manual, articles)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [name, description, repo_link, JSON.stringify(imagePaths), manualPath, JSON.stringify(articlesPaths)]
            );

            res.status(201).json({ message: "Simulador cadastrado com sucesso!" });
        } catch (err) {
            if(process.env.NODE_ENV !== "production"){
                console.error(err);
            }
            res.status(500).json({ message: "Erro interno no servidor." });
        }
    });
});

module.exports = router;
