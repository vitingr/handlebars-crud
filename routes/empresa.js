const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const { Form } = require("react-router-dom")
const multer = require("multer")
const upload = require("../config/multer")
const fs = require("fs")

const maxFotos = 2

// Require Models 
require("../models/Postagem")
require("../models/Pagina")
require("../models/Usuario")
require("../models/Vaga")
require("../models/Endereco")
require("../models/Notificacao")
require("../models/Formacao")
require("../models/Certificado")
require("../models/Experiencia")

// Import Models
const Postagem = mongoose.model("postagens")
const Pagina = mongoose.model("paginas")
const Usuario = mongoose.model("usuarios")
const Vaga = mongoose.model("vagas")
const Endereco = mongoose.model("enderecos")
const Notificacao = mongoose.model("notificacoes")
const Formacao = mongoose.model("formacoes")
const Certificado = mongoose.model("certificados")
const Experiencia = mongoose.model("experiencias")

// Helpers

const { infoUsuario } = require("../helpers/infoUsuario")
const { NOTIMP } = require("dns")

// Funções

function validarEmail(email) {
    const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return regex.test(email)
}

// Páginas

router.get("/", (req, res) => {

    res.send("Teste")

})

router.get("/minhaPagina", (req, res) => {

    const usuarioLogado = infoUsuario(req.user)

    Pagina.findOne({ dono: usuarioLogado.id }).lean().then((pagina) => {

        res.render("empresa/editarPagina", { usuario: usuarioLogado, pagina: pagina })

    })

})

router.post("/editPagina", upload.fields([
    { name: 'foto_logo', maxCount: 1 },
    { name: 'foto_background', maxCount: 1 }
]), (req, res) => {

    const { nome, website, industria, tamanho_empresa, tipo_empresa, descricao} = req.body

    const { foto_logo, foto_background } = req.files

    var setLogo = ""
    var setBackground = ""

    const usuarioLogado = infoUsuario(req.user)

    var erros = []

    Pagina.findOne({ nome: nome }).then((pagina) => {

        if (!nome || typeof nome == undefined || nome == null) {
            erros.push({ texto: "Adicione um Nome" })
        }
    
        if (nome.length < 2) {
            erros.push({ texto: "Nome muito Pequeno" })
        }
    
        if (nome.length > 35) {
            erros.push({ texto: "Nome muito Grande" })
        }
    
        if (!industria || typeof industria == undefined || industria == null) {
            erros.push({ texto: "Adicione o ramo da sua Empresa" })
        }
    
        if (!tamanho_empresa || typeof tamanho_empresa == undefined || tamanho_empresa == null) {
            erros.push({ texto: "Adicione o tamanho da sua Empresa" })
        }
    
        if (!descricao || typeof descricao == undefined || descricao == null) {
            erros.push({ texto: "Adicione uma descrição da sua Empresa" })
        }
    
        if (erros.length > 0) {
    
            res.render("empresa/editarPagina", { usuario: usuarioLogado, pagina: pagina, erros: erros })
    
        } else {

            if (foto_logo) {

                const logo = req.files.foto_logo[0].path
                setLogo = logo.replace('public', '')
                
            } else {
        
                setLogo = pagina.logo
        
            }
        
            if (foto_background) {
                const background = req.files.foto_background[0].path
                const editBackground = background.replace('public', '')
                var newBackground = "";
                for (var i = 0; i < editBackground.length; i++) if (editBackground[i] !== "\"" && editBackground[i] !== "\\") newBackground += editBackground[i];
                newBackground = newBackground.replace('uploads', '')
                setBackground = `/uploads/${newBackground}`
        
            } else {
        
                setBackground = pagina.background
        
            }
      
            pagina.logo = setLogo
            pagina.background = setBackground
            pagina.nome = nome
            pagina.website = website
            pagina.qtdFuncionarios = tamanho_empresa
            pagina.industria = industria
            pagina.descricao = descricao
    
            pagina.save().then(() => {
    
                req.flash('success_msg', 'SUCESSO! A sua página foi editada.')
                res.redirect("/empresa/minhaPagina")
    
            }).catch((erro) => {
    
                console.log(`erro ${erro}`)
                req.flash('error_msg', 'ERRO! Não foi possível salvar as alterações.')
                res.redirect("/empresa/minhaPagina")
    
            })
    
        }

    }).catch((erro) => {

        console.log(`erro ${erro}`)
        req.flash('error_msg', 'ERRO! Não foi possível encontrar a página.')
        res.redirect("/empresa/minhaPagina")

    })

})

module.exports = router