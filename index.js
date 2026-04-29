//basic
require('dotenv').config();
const path = require('path');
const { app } = require('./expressApp');
const express = require("express");

const { setupDatabase } = require('./scripts/setDbStuff.js');
setupDatabase();

const loginRoutes = require("./rotas/login.js");
const uploadRoutes = require("./rotas/upload.js");
const managerRoutes = require("./rotas/manager.js");
const listarRoutes = require("./rotas/listarSimuladores.js");
const deleteRoutes = require("./rotas/deleteSimulador.js");
const editRoutes = require("./rotas/editarSimulador.js");
const ArtigosRoutes = require("./rotas/Artigos.js");

const requireAdm = require('./middlewares/requireAdm');
const authJWT = require("./middlewares/authJWT");

app.use("/login", loginRoutes);
app.use("/upload", authJWT, requireAdm, uploadRoutes);
app.use("/manager", authJWT, requireAdm, managerRoutes);
app.use("/deletar", authJWT, requireAdm, deleteRoutes);
app.use("/editar", authJWT, requireAdm, editRoutes);
app.use("/listar", listarRoutes);
app.use("/artigos", ArtigosRoutes);
app.use('/arquivos_simuladores', express.static(path.join(__dirname, 'arquivos_simuladores')));

const frameAncestors = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',').join(' ') : "'none'";

app.use((req, res, next) => {
    res.removeHeader('X-Frame-Options');
    res.setHeader('Content-Security-Policy', `frame-ancestors ${frameAncestors}`);
    next();
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/home.html"));
});

app.get("/login.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public/login.html"));
});

app.get("/upload.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public/upload.html"));
});

app.get("/manager.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public/manager.html"));
});

app.get("/editar.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public/editar.html"));
});

app.get("/deletar.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public/delete.html"));
});

app.get("/artigos.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public/artigos.html"));
});

//servidor
const HOST = '0.0.0.0';
const PORT = 3000; //container port
app.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}`);
});