const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")

// Páginas

router.get("/", (req, res) => {

    const usuarioLogado = {
        id: req.user_id,
        nome: req.user.nome,
        sobrenome: req.user.sobrenome,
        nomeCompleto: req.user.nomeCompleto,
        email: req.user.email,
        senha: req.user.senha,
        pais: req.user.pais,
        estado: req.user.estado,
        cidade: req.user.cidade,
        escola: req.user.escola,
        faculdade: req.user.faculdade,
        foto: req.user.foto,
        area: req.user.area,
        seguidores: req.user.seguidores
    }

    res.render("usuario/inicio", { usuario: usuarioLogado })

})

module.exports = router