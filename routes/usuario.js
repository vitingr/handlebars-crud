const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Postagem")
require("../models/Empresa")
require("../models/Usuario")
require("../models/Vaga")
require("../models/Endereco")

// Import Models

const Postagem = mongoose.model("postagens")
const Empresa = mongoose.model("empresas")
const Usuario = mongoose.model("usuarios")
const Vaga = mongoose.model("vagas")
const Endereco = mongoose.model("enderecos")

// Helpers

const { infoUsuario } = require("../helpers/infoUsuario")

// Funções

function validarEmail(email) {
    const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return regex.test(email)
}

// Páginas

router.get("/endereco", (req, res) => {

    if (!usuarioLogado.endereco || usuarioLogado.endereco == null || usuarioLogado.endereco == undefined || usuarioLogado.endereco == "") {

        const usuarioLogado = infoUsuario(req.user)
        res.render("cadastro/cidade", { usuario: usuarioLogado })

    } else {

        res.redirect("usuario/emprego")

    }


})

router.post("/novoEndereco", (req, res) => {

    const usuarioLogado = infoUsuario(req.user)
    const novoEndereco = {
        dono: usuarioLogado._id,
        pais: req.body.pais,
        estado: req.body.estado,
        cidade: req.body.cidade
    }

    new Endereco(novoEndereco).save().then((endereco) => {

        Usuario.findOne({ _id: usuarioLogado.id }).then((usuario) => {

            usuario.endereco = endereco._id

            usuario.save().then(() => {

                res.redirect("/usuario/emprego")

            })

        }).catch((erro) => {

            req.flash('error_msg', 'ERRO! Não foi possível relacionar o endereço com sua Conta!')
            res.redirect("/")

        })

    }).catch((erro) => {


        req.flash('error_msg', 'ERRO! Não foi possível salvar o Endereço')
        res.redirect("/")

    })

})

router.get("/emprego", (req, res) => {

    if (!usuarioLogado.ultimo_cargo || usuarioLogado.ultimo_cargo == null || usuarioLogado.ultimo_cargo == undefined || usuarioLogado.ultimo_cargo == "" || !usuarioLogado.ultima_empresa || usuarioLogado.ultima_empresa == null || usuarioLogado.ultima_empresa == undefined || usuarioLogado.ultima_empresa == "" || !usuarioLogado.ultimo_contrato || usuarioLogado.ultimo_contrato == null || usuarioLogado.ultimo_contrato == undefined || usuarioLogado.ultimo_contrato == "") {

        const usuarioLogado = infoUsuario(req.user)
        res.render("cadastro/cargo", { usuario: usuarioLogado })

    } else {

        res.redirect("/usuario/tipoEmprego")

    }

})

router.post("/novoEmprego", (req, res) => {

    const usuarioLogado = infoUsuario(req.user)

    Usuario.findOne({ _id: usuarioLogado.id }).then((usuario) => {

        if (!req.body.estudante || req.body.estudante == null || req.body.estudante == undefined) {

            usuario.ultimo_cargo = req.body.cargo_recente
            usuario.ultimo_contrato = req.body.tipo_emprego
            usuario.ultima_empresa = req.body.empresa_recente

            usuario.save().then(() => {

                res.redirect("/usuario/tipoEmprego")

            }).catch((erro) => {

                req.flash('error_msg', 'ERRO! Houve um erro ao salvar suas informações...')
                res.redirect("/")

            })

        } else {

            usuario.ultimo_cargo = "Estudante"
            usuario.ultimo_contrato = "Estudante"
            usuario.ultima_empresa = "Estudante"

            usuario.save().then(() => {

                res.redirect("/usuario/tipoEmprego")

            }).catch((erro) => {

                req.flash('error_msg', 'ERRO! Houve um erro ao salvar suas informações...')
                res.redirect("/")

            })

        }

    }).catch((erro) => {

        req.flash('error_msg', 'ERRO! Não foi possível encontrar sua conta..')
        res.redirect("/")

    })

})

router.get("/tipoEmprego", (req, res) => {

    if (!usuarioLogado.area || usuarioLogado.area == null || usuarioLogado.area == undefined || usuarioLogado.area == "" || !usuarioLogado.preferencia_emprego || usuarioLogado.preferencia_emprego == null || usuarioLogado.preferencia_emprego == undefined || usuarioLogado.preferencia_emprego == "") {

        const usuarioLogado = infoUsuario(req.user)
        res.render("cadastro/tipoEmprego", { usuario: usuarioLogado })

    } else {

        res.redirect("/usuario/vagas")

    }

})

router.post("/novoTipoEmprego", (req, res) => {

    const usuarioLogado = infoUsuario(req.user)

    Usuario.findOne({ _id: usuarioLogado.id }).then((usuario) => {

        usuario.area = req.body.cargo
        usuario.preferencia_emprego = req.body.tipo

        usuario.save().then(() => {

            res.redirect("/usuario/vagas")

        }).catch((erro) => {

            req.flash('error_msg', 'ERRO! Houve um erro ao salvar suas informações...')
            res.redirect("/")

        })

    }).catch((erro) => {

        req.flash('error_msg', 'ERRO! Não foi possível encontrar sua conta..')
        res.redirect("/")

    })

})

router.get("/vagas", (req, res) => {

    if (!usuarioLogado.procurando_emprego || usuarioLogado.procurando_emprego == null || usuarioLogado.procurando_emprego == undefined || usuarioLogado.procurando_emprego == "") {

        const usuarioLogado = infoUsuario(req.user)
        res.render("cadastro/emprego", { usuario: usuarioLogado })

    } else {

        res.redirect("/usuario/editarPerfil")

    }

})

router.post("/novasVagas", (req, res) => {

    const usuarioLogado = infoUsuario(req.user)

    Usuario.findOne({ _id: usuarioLogado.id }).then((usuario) => {

        usuario.procurando_emprego = req.body.emprego

        usuario.save().then(() => {

            res.redirect("/usuario/editarPerfil")

        }).catch((erro) => {

            req.flash('error_msg', 'ERRO! Houve um erro ao salvar suas informações...')
            res.redirect("/")

        })

    }).catch((erro) => {

        req.flash('error_msg', 'ERRO! Não foi possível encontrar sua conta..')
        res.redirect("/")

    })

})

router.get("/finalizacao", (req, res) => {

    const usuarioLogado = infoUsuario(req.user)
    res.render("cadastro/finalizacao", { usuario: usuarioLogado })

})

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
    let perfil_completo = "sim"

    if (!usuarioLogado.endereco || usuarioLogado.endereco == null || usuarioLogado.endereco == undefined || usuarioLogado.endereco == "") {

        perfil_completo = "não"

    } else {

        if (!usuarioLogado.ultimo_cargo || usuarioLogado.ultimo_cargo == null || usuarioLogado.ultimo_cargo == undefined || usuarioLogado.ultimo_cargo == "" || !usuarioLogado.ultima_empresa || usuarioLogado.ultima_empresa == null || usuarioLogado.ultima_empresa == undefined || usuarioLogado.ultima_empresa == "" || !usuarioLogado.ultimo_contrato || usuarioLogado.ultimo_contrato == null || usuarioLogado.ultimo_contrato == undefined || usuarioLogado.ultimo_contrato == "") {

            perfil_completo = "não"

        } else {

            if (!usuarioLogado.area || usuarioLogado.area == null || usuarioLogado.area == undefined || usuarioLogado.area == "" || !usuarioLogado.preferencia_emprego || usuarioLogado.preferencia_emprego == null || usuarioLogado.preferencia_emprego == undefined || usuarioLogado.preferencia_emprego == "") {

                perfil_completo = "não"

            } else {

                if (!usuarioLogado.procurando_emprego || usuarioLogado.procurando_emprego == null || usuarioLogado.procurando_emprego == undefined || usuarioLogado.procurando_emprego == "")

                    perfil_completo = "não"

            }

        }

    }

    if (perfil_completo == "não") {

        Postagem.find({ dono: usuarioLogado.id }).lean().sort({ data: 'desc' }).then((postagens) => {

            res.render("usuario/perfil", { usuario: usuarioLogado, postagens: postagens, perfil_completo: perfil_completo })

        }).catch((erro) => {

            req.flash('error_msg', 'ERRO! Não foi possível encontrar seu perfil...')
            res.redirect("/")

        })

    } else {

        if (perfil_completo == "sim") {

            Postagem.find({ dono: usuarioLogado.id }).lean().sort({ data: 'desc' }).then((postagens) => {

                res.render("usuario/perfil", { usuario: usuarioLogado, postagens: postagens })

            }).catch((erro) => {

                req.flash('error_msg', 'ERRO! Não foi possível encontrar seu perfil...')
                res.redirect("/")

            })

        } else {

            req.flash('error_msg', 'Não foi possível analisar seu Perfil.')
            res.redirect("/")

        }
    }

})

module.exports = router
