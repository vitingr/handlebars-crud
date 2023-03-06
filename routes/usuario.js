const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Postagem")
require("../models/Empresa")
require("../models/Usuario")
require("../models/Vaga")

// Import Models

const Postagem = mongoose.model("postagens")
const Empresa = mongoose.model("empresas")
const Usuario = mongoose.model("usuarios")
const Vaga = mongoose.model("vagas")

// Helpers

const { infoUsuario } = require("../helpers/infoUsuario")

// Funções

// Páginas

router.post("/publicar", (req, res) => {

    const usuarioLogado = infoUsuario(req.user)

    var erros = []

    if (erros.length > 0) {

        req.flash('error_msg', 'Erro!')
        res.redirect("/")

    } else {

        Usuario.findOne({ _id: usuarioLogado.id }).then((usuario) => {


            const novaPostagem = {
                dono: usuarioLogado.id,
                nomeDono: usuario.nomeCompleto,
                conteudo: req.body.feed_text,
                curtidas: 0,
                compartilhamentos: 0
            }

            new Postagem(novaPostagem).save().then(() => {

                console.log("Postagem Criada com Sucesso!")
                req.flash('success_msg', 'Mensagem Publicada com Sucesso!')
                res.redirect("/")

            }).catch((erro) => {

                console.log(`ERRO: ${erro}`)
                req.flash('error_msg', 'ERRO! Houve um problema na criação da postagem...')
                res.redirect("/")

            })

        }).catch((erro) => {

            req.flash('error_msg', 'ERRO! Não foi possível sincronizar sua conta...')
            res.redirect('/')

        })

    }

})

router.get("/editarPerfil", (req, res) => {

    const usuarioLogado = infoUsuario(req.user)

    res.render("usuario/perfil", { usuario: usuarioLogado })

})

module.exports = router