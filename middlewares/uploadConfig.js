const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Criar pasta caso não exista
const uploadsDir = path.join(__dirname, "..", "arquivos_simuladores");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const unique = Date.now() + "-" + Math.round(Math.random() * 1e6);
        cb(null, unique + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 30 * 1024 * 1024 }, // 30 MB
    fileFilter: (req, file, cb) => {
        const allowed = ["image/png", "image/jpeg", "application/pdf"];
        if (allowed.includes(file.mimetype)){
            cb(null, true);
        }else{
            cb(new Error("Tipo de arquivo não permitido"));
        }
    }
});

module.exports = upload;
