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

        Usuario.find().lean().then((usuarios => {

            var seguidores = []
            const paginaId = pagina._id.toString()

            usuarios.forEach(usuario => {

                if (usuario.paginas.includes(paginaId)) {
                    seguidores.push(usuario)
                } else {
                    console.log('Esse usuário não segue você')
                }
            })

            Vaga.find({empresa: pagina._id}).lean().then((vagas) => {

                if (vagas) {
    
                    res.render("empresa/editarPagina", { usuario: usuarioLogado, pagina: pagina, vagas: vagas, seguidores: seguidores })
    
                } else {
    
                    res.render("empresa/editarPagina", { usuario: usuarioLogado, pagina: pagina, seguidores: seguidores })
    
                }
    
            })

        }))

    }).catch((erro) => {

        req.flash('error_msg', 'É necessário possuir uma página para acessar aqui.')
        res.redirect("/usuario/")

    })

})

router.post("/editPagina", upload.fields([
    { name: 'foto_logo', maxCount: 1 },
    { name: 'foto_background', maxCount: 1 }
]), (req, res) => {

    const { nome, website, industria, tamanho_empresa, tipo_empresa, descricao } = req.body

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

            console.log(erros)
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
            pagina.tipo = tipo_empresa
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

router.post("/novaVaga", (req, res) => {

    const usuarioLogado = infoUsuario(req.user)

    console.log("A")

    const erros = []

    if (!req.body.cargo || req.body.cargo == null || req.body.cargo == undefined || req.body.cargo == "") {
        erros.push({ texto: "Informe o nome do cargo." })
    }

    if (req.body.cargo.length > 60) {
        erros.push({ texto: "Adicione um nome menor para o cargo." })
    }

    if (req.body.cargo.length < 2) {
        erros.push({ texto: "Adicione um nome maior para o cargo." })
    }

    if (!req.body.tipo || req.body.tipo == null || req.body.tipo == undefined || req.body.tipo == "") {
        erros.push({ texto: "Informe o tipo da vaga." })
    }

    if (!req.body.modelo || req.body.modelo == null || req.body.modelo == undefined || req.body.modelo == "") {
        erros.push({ texto: "Informe o modelo da vaga." })
    }

    if (!req.body.local || req.body.local == null || req.body.local == undefined || req.body.local == "") {
        erros.push({ texto: "Informe o local da vaga de emprego." })
    }

    if (req.body.local.length > 200) {
        erros.push({ texto: "Adicione um nome menor para o local." })
    }

    if (!req.body.descricao || req.body.descricao == null || req.body.descricao == undefined || req.body.descricao == "") {
        erros.push({ texto: "Adicione uma descrição na vaga." })
    }

    if (req.body.minSalario < 721) {
        erros.push({ texto: "Adicione um salário base superior ao salário mínimo da categoria." })
    }

    if (!req.body.minSalario || req.body.minSalario == null || req.body.minSalario == undefined || req.body.minSalario == "") {
        erros.push({ texto: "Adicione um salário base à vaga." })
    }

    if (req.body.minSalario < 721) {
        erros.push({ texto: "Adicione um salário base superior ao salário mínimo da categoria." })
    }

    if (req.body.minSalario > 99999999) {
        erros.push({ texto: "Adicione um salário máximo inferior ao informado.." })
    }

    if (erros.length > 0) {

        console.log("B")

        res.render("empresa/editarPagina", { usuario: usuarioLogado, erros: erros })

    } else {

        console.log("A")

        Pagina.findOne({ dono: usuarioLogado.id }).lean().then((empresa) => {

            const novaVaga = new Vaga({
                empresa: empresa._id,
                cargo: req.body.cargo,
                tipo: req.body.tipo,
                modelo: req.body.modelo,
                local: req.body.local,
                vagasDisponiveis: 0,
                descricao: req.body.descricao,
                salarioMinimo: req.body.minSalario,
                salarioMaximo: req.body.maxSalario,
                foto: empresa.logo,
                nomeEmpresa: empresa.nome
            })

            console.log("A")

            novaVaga.save().then(() => {

                req.flash('success_msg', 'A Vaga foi Criada com Sucesso!')
                res.redirect("/empresa/minhaPagina")


            }).catch((erro) => {

                req.flash('error_msg', 'ERRO! Não foi possível criar a vaga')
                res.redirect("/empresa/minhaPagina")

            })

        }).catch((erro) => {

            req.flash('error_msg', 'ERRO! Não foi possível sincronizar sua conta')
            res.redirect("/empresa/minhaPagina")

        })

    }

})

router.get("/seguidores", (req, res) => {

    const usuarioLogado = infoUsuario(req.user)

    Pagina.findOne({ dono: usuarioLogado.id }).lean().then((empresa) => {

        Usuario.find().lean().then((usuarios => {

            var seguidores = []
            usuarios.forEach(usuario => {
                if (usuario.paginas.includes(empresa._id)) {
                    seguidores.push(usuario)
                } else {
                    console.log('Esse usuário não segue você')
                }
            })

        }))

    })

})

module.exports = router