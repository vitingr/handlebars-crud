const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const { Form } = require("react-router-dom")
require("../models/Postagem")
require("../models/Empresa")
require("../models/Usuario")
require("../models/Vaga")
require("../models/Endereco")
require("../models/Notificacao")
require("../models/Formacao")

// Import Models

const Postagem = mongoose.model("postagens")
const Empresa = mongoose.model("empresas")
const Usuario = mongoose.model("usuarios")
const Vaga = mongoose.model("vagas")
const Endereco = mongoose.model("enderecos")
const Notificacao = mongoose.model("notificacoes")
const Formacao = mongoose.model("formacoes")

// Helpers

const { infoUsuario } = require("../helpers/infoUsuario")

// Funções

function validarEmail(email) {
    const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return regex.test(email)
}

// Páginas

router.get("/endereco", (req, res) => {

    const usuarioLogado = infoUsuario(req.user)

    if (!usuarioLogado.endereco || usuarioLogado.endereco == null || usuarioLogado.endereco == undefined || usuarioLogado.endereco == "") {

        const usuarioLogado = infoUsuario(req.user)
        res.render("cadastro/cidade", { usuario: usuarioLogado })

    } else {

        res.redirect("/usuario/emprego")

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

    const usuarioLogado = infoUsuario(req.user)

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

    const usuarioLogado = infoUsuario(req.user)

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

    const usuarioLogado = infoUsuario(req.user)

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

            if (!usuarioLogado.endereco || usuarioLogado.endereco == null || usuarioLogado.endereco == undefined || usuarioLogado.endereco == "") {

                Endereco.findOne({ _id: usuarioLogado.endereco }).lean().then((endereco) => {

                    Formacao.findOne({ _id: usuarioLogado.formacao }).lean().then((formacao) => {

                        res.render("usuario/perfil", { usuario: usuarioLogado, formacao: formacao, postagens: postagens, endereco: endereco })

                    }).catch((erro) => {

                        req.flash('error_msg', 'ERRO! Não foi possível encontrar suas formações.')
                        res.redirect("/")

                    })

                }).catch((erro) => {

                    req.flash('error_msg', 'ERRO! Não foi possível encontrar seu endereço.')
                    res.redirect("/")

                })

            }

        }).catch((erro) => {

            req.flash('error_msg', 'ERRO! Não foi possível encontrar seu perfil.')
            res.redirect("/")

        })

    } else {

        if (perfil_completo == "sim") {

            Postagem.find({ dono: usuarioLogado.id }).lean().sort({ data: 'desc' }).then((postagens) => {

                Endereco.findOne({ _id: usuarioLogado.endereco }).lean().then((endereco) => {

                    Formacao.findOne({ _id: usuarioLogado.formacao }).lean().then((formacao) => {

                        res.render("usuario/perfil", { usuario: usuarioLogado, formacao: formacao, postagens: postagens, endereco: endereco, perfil_completo: perfil_completo })

                    }).catch((erro) => {

                        req.flash('error_msg', 'ERRO! Não foi possível encontrar suas formações.')
                        res.redirect("/")

                    })

                }).catch((erro) => {

                    req.flash('error_msg', 'ERRO! Não foi possível encontrar seu endereço...')
                    res.redirect("/")

                })

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

router.get("/notificacoes", (req, res) => {

    const usuarioLogado = infoUsuario(req.user)

    Notificacao.find().lean().then((notificacoes) => {

        res.render("usuario/notificacoes", { usuario: usuarioLogado, notificacoes: notificacoes })

    }).catch((erro) => {

        req.flash('error_msg', 'ERRO! Não foi possível carregar as Notificações!')
        res.redirect("/")

    })

})

router.get("/infoPerfil", (req, res) => {

    const usuarioLogado = infoUsuario(req.user)

    Formacao.find({ dono: usuarioLogado.id }).lean().then((formacao) => {

        Usuario.findOne({ _id: usuarioLogado.id }).lean().then((usuario) => {

            Endereco.findOne({ dono: usuarioLogado.id }).lean().then((endereco) => {

                res.render("usuario/infoPerfil", { usuario: usuarioLogado, formacao: formacao, endereco: endereco })


            }).catch((erro) => {

                req.flash('error_msg', 'ERRO! Não foi possível localizar seu endereço')
                res.redirect("/usuario/editarPerfil")

            })

        }).catch((erro) => {

            req.flash('error_msg', 'ERRO! Não foi possível localizar seu perfil')
            res.redirect("/usuario/editarPerfil")

        })

    }).catch((erro) => {

        req.flash('error_msg', 'ERRO! Não foi possível localizar suas formações')
        res.redirect("/usuario/editarPerfil")

    })

})

router.post("/editInfo", (req, res) => {

    const usuarioLogado = infoUsuario(req.user)

    Formacao.findOne({ _id: req.body.formacao }).lean().then((formacao) => {

        console.log(formacao)
        console.log("USUARIO")

        Usuario.findOne({ _id: usuarioLogado.id }).then((usuario) => {

            console.log(usuario)
            console.log("FORMACAO")

            usuario.resumo = req.body.headline
            usuario.cargo_atual = req.body.cargo_atual
            usuario.formacao = formacao._id
            usuario.website = req.body.website

            usuario.save().then(() => {

                console.log("SALVO")

                req.flash('success_msg', 'Perfil Atualizado com Sucesso!')
                res.redirect("/usuario/editarPerfil")

            }).catch((erro) => {

                console.log(erro)
                req.flash('error_msg', 'ERRO! Não foi possível salvar suas alterações.')
                res.redirect("/")

            })

        }).catch((erro) => {

            req.flash('error_msg', 'ERRO! Não foi possível localizar seu perfil.')
            res.redirect("/usuario/editarPerfil")

        })

    }).catch((erro) => {

        req.flash('error_msg', 'ERRO! Não foi possível localizar suas informações')
        res.redirect("/usuario/editarPerfil")

    })

})


router.get("/novaFormacao", (req, res) => {

    const usuarioLogado = infoUsuario(req.user)

    Usuario.findOne({ _id: usuarioLogado.id }).lean().then((usuario) => {

        Formacao.find({ dono: usuarioLogado.id }).lean().then((formacao) => {

            res.render("usuario/novaFormacao", { usuario: usuarioLogado, formacao: formacao })

        }).catch((erro) => {

            req.flash('error_msg', 'ERRO! Não foi possível localizar suas formações.')
            res.redirect("/usuario/editarPerfil")

        })

    }).catch((erro) => {

        req.flash('error_msg', 'ERRO! Não foi possível localizar sua conta!')
        res.redirect("/usuario/editarPerfil")

    })

})

router.post("/addFormacao", (req, res) => {

    const usuarioLogado = infoUsuario(req.user)

    Usuario.findOne({ _id: usuarioLogado.id }).lean().then((usuario) => {

        const novaFormacao = {
            dono: usuarioLogado.id,
            nome: req.body.formacao,
            tipo: req.body.tipo_formacao,
            area: req.body.area_formacao,
        }

        new Formacao(novaFormacao).save().then(() => {

            req.flash('success_msg', 'Formação Adicionada com Sucesso!')
            res.redirect("/usuario/infoPerfil")

        }).catch((erro) => {

            req.flash('error_msg', 'ERRO! Não foi possível adicionar a formação.')
            res.redirect("/usuario/editarPerfil")

        })

    }).catch((erro) => {

        req.flash('error_msg', 'ERRO! Não foi possível localizar sua conta.')
        res.redirect("/usuario/editarPerfil")

    })

})

router.get("/amigos", (req, res) => {

    const usuarioLogado = infoUsuario(req.user)

    Usuario.find({ _id: { $ne: usuarioLogado.id } }).lean().then((usuarios) => {

        res.render("usuario/amigos", { usuario: usuarioLogado, usuarios: usuarios })

    }).catch((erro) => {
        console.log(erro)
        req.flash('error_msg', 'ERRO! Não foi possível encontrar pessoas!')
        res.redirect("/")

    })

})

router.post("/amigos/addAmigo", (req, res) => {

    const usuarioLogado = infoUsuario(req.user)

    Usuario.findOne({ _id: req.body.id }).then((usuario) => {

        var amigos_pendentes = usuario.amigos_pendentes
        var amigos = usuario.amigos

        if (amigos_pendentes.includes(usuarioLogado.id) || amigos.includes(usuarioLogado.id)) {

            req.flash('error_msg', 'ERRO! Não é possível adicionar o mesmo amigo duas vezes...')
            res.redirect("/usuario/amigos")

        } else {

            usuario.amigos_pendentes = usuario.amigos_pendentes + `${usuarioLogado.id} `
            usuario.save().then(() => {

                console.log(`CONVITE ENVIADO PARA ${usuario.id}`)
                req.flash('success_msg', 'SUCESSO! O convite de Amizade foi enviado...')
                res.redirect("/usuario/amigos")

            })

        }

    }).catch((erro) => {

        req.flash('error_msg', 'ERRO! Não foi possível encontrar a conta desse usuário.')
        res.redirect("/usuario/amigos")

    })

})

router.post("/amigos/deletar", (req, res) => {

    const usuarioLogado = infoUsuario(req.user)

})

router.post("/amigos/aceitar", (req, res) => {

    const usuarioLogado = infoUsuario(req.user)

    Usuario.findOne({ _id: usuarioLogado.id }).then((usuario) => {

        usuario.amigos += `${req.body.id}`
        usuario.seguidores += 1

        var amigos = []

        var amigosSeparados = usuario.amigos_pendentes.split(" ")
        amigosSeparados.array.forEach(amigo => {

            if (amigo == 0 || amigo == null || amigo == undefined || amigo == "") {
                console.log("Amigo Invalido")
            } else {
                amigos.push(amigo)
            }

        })

        var amigoAtual = req.body.id
        var indice = amigos.indexOf(amigoAtual)

        amigos.splice(indice, 1)

        usuario.amigos_pendentes = amigos.join(" ")
        usuario.save()

        Usuario.findOne({ _id: req.body.id }).then((amigo) => {

            amigo.amigos += `${usuarioLogado.id}`
            amigo.seguidores += 1 
            amigo.save().then(() => {

                req.flash('success_msg', 'SUCESSO! Convite Aceito.')
                res.redirect("/usuario/amigos")

            }).catch((erro) => {

                req.flash('error_msg', 'ERRO! Não foi possível aceitar o convite...')
                res.redirect("/usuario/amigos")

            })

        }).catch((erro) => {

            req.flash('error_msg', 'ERRO! Não foi possível sincronizar o convite...')
            res.redirect("/usuario/amigos")

        })

    }).catch((erro) => {

        req.flash('error_msg', 'ERRO! Não foi possível encontrar esse convite em sua conta...')
        res.redirect("/usuario/amigos")

    })

})

router.post("/amigos/rejeitar", (req, res) => {

    const usuarioLogado = infoUsuario(req.user)

    Usuario.findOne({_id: usuarioLogado.id}).then((usuario) => {

        var amigos = []
        var amigosSeparados = usuario.amigos_pendentes.split(" ")
        amigosSeparados.forEach(amigo => {

            if (amigo == 0 || amigo == null || amigo == undefined || amigo == "") {
                console.log("Amigo Invalido")
            } else {
                amigos.push(amigo)
            }

        })

        var amigoAtual = req.body._id 
        var indice = amigos.indexOf(amigoAtual)

        amigos.splice(indice, 1)

        usuario.amigos_pendentes = amigos.join(" ")
        usuario.save().then(() => {

            req.flash('success_msg', 'SUCESSO! Convite rejeitado')
            res.redirect("/usuario/amigos")

        }).catch((erro) => {

            req.flash('error_msg', 'ERRO! Não foi possível rejeitar o convite...')
            res.redirect("/usuario/amigos")

        })

    }).catch((erro) => {

        req.flash('error_msg', 'ERRO! Não foi possível encontrar o convite...')
        res.redirect("/usuario/amigos")

    })

})

module.exports = router
