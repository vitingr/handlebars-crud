const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const { Form } = require("react-router-dom")
const multer = require("multer")
const upload = require("../config/multer")
const fs = require("fs")

// Require Models 
require("../models/Postagem")
require("../models/Empresa")
require("../models/Instituicao")
require("../models/Usuario")
require("../models/Vaga")
require("../models/Endereco")
require("../models/Notificacao")
require("../models/Formacao")

// Import Models
const Postagem = mongoose.model("postagens")
const Empresa = mongoose.model("empresas")
const Instituicao = mongoose.model("instituicoes")
const Usuario = mongoose.model("usuarios")
const Vaga = mongoose.model("vagas")
const Endereco = mongoose.model("enderecos")
const Notificacao = mongoose.model("notificacoes")
const Formacao = mongoose.model("formacoes")

// Helpers

const { infoUsuario } = require("../helpers/infoUsuario")
const { NOTIMP } = require("dns")

// Funções

function validarEmail(email) {
    const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return regex.test(email)
}

// Páginas

router.get("/endereco", (req, res) => {

    const usuarioLogado = infoUsuario(req.user)

    if (!usuarioLogado.endereco || usuarioLogado.endereco == null || usuarioLogado.endereco == undefined || usuarioLogado.endereco == "") {

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

                req.flash('success_msg', 'Mensagem Publicada com Sucesso!')
                res.redirect("/")

            }).catch((erro) => {

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

    Notificacao.find({ dono: usuarioLogado.id }).lean().then((notificacoes) => {

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

router.post("/editInfo", upload.single('file'), (req, res) => {

    const { nome, sobrenome, telefone, tipo_telefone, website, headline, cargo_atual, formacaoUsuario, area, ultima_empresa } = req.body

    console.log(req.file)

    const usuarioLogado = infoUsuario(req.user)

    // COM FOTO
    if (req.file === null || req.file === undefined || req.file === "") {

        if (formacaoUsuario) {

            Formacao.findOne({ _id: formacaoUsuario }).lean().then((formacao) => {

                Usuario.findOne({ _id: usuarioLogado.id }).then((usuario) => {

                    if (nome) {
                        usuario.nome = nome
                    }

                    if (sobrenome) {
                        usuario.sobrenome = sobrenome
                    }

                    if (headline) {
                        usuario.resumo = headline
                    }

                    if (cargo_atual) {
                        usuario.cargo_atual = cargo_atual
                    }

                    if (_id) {
                        usuario.formacao = formacao._id
                    }

                    if (telefone) {
                        usuario.telefone = telefone
                    }

                    if (website) {
                        usuario.website = website
                    }

                    usuario.nomeCompleto = `${nome} ${sobrenome}`

                    usuario.save().then(() => {

                        req.flash('success_msg', 'Perfil Atualizado com Sucesso!')
                        res.redirect("/usuario/editarPerfil")

                    }).catch((erro) => {

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

        } else {

            Usuario.findOne({ _id: usuarioLogado.id }).then((usuario) => {

                if (nome) {
                    usuario.nome = nome
                }

                if (sobrenome) {
                    usuario.sobrenome = sobrenome
                }

                if (headline) {
                    usuario.resumo = headline
                }

                if (cargo_atual) {
                    usuario.cargo_atual = cargo_atual
                }

                if (telefone) {
                    usuario.telefone = telefone
                }

                if (website) {
                    usuario.website = website
                }

                usuario.nomeCompleto = `${nome} ${sobrenome}`

                usuario.save().then(() => {

                    req.flash('success_msg', 'Perfil Atualizado com Sucesso!')
                    res.redirect("/usuario/editarPerfil")

                }).catch((erro) => {

                    req.flash('error_msg', 'ERRO! Não foi possível salvar suas alterações.')
                    res.redirect("/")

                })


            }).catch((erro) => {

                req.flash('error_msg', 'ERRO! Não foi possível localizar seu perfil.')
                res.redirect("/usuario/editarPerfil")

            })

        }
    }

    // SEM FOTO
    else {

        if (formacaoUsuario) {

            Formacao.findOne({ _id: formacaoUsuario }).lean().then((formacao) => {

                Usuario.findOne({ _id: usuarioLogado.id }).then((usuario) => {

                    if (nome) {
                        usuario.nome = nome
                    }

                    if (sobrenome) {
                        usuario.sobrenome = sobrenome
                    }

                    if (headline) {
                        usuario.resumo = headline
                    }

                    if (cargo_atual) {
                        usuario.cargo_atual = cargo_atual
                    }

                    if (_id) {
                        usuario.formacao = formacao._id
                    }

                    if (telefone) {
                        usuario.telefone = telefone
                    }

                    if (website) {
                        usuario.website = website
                    }

                    usuario.nomeCompleto = `${nome} ${sobrenome}`

                    const foto = req.file.path
                    const newFoto = foto.replace('public', '')
                    usuario.foto = newFoto

                    usuario.save().then(() => {

                        req.flash('success_msg', 'Perfil Atualizado com Sucesso!')
                        res.redirect("/usuario/editarPerfil")

                    }).catch((erro) => {

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

        } else {

            Usuario.findOne({ _id: usuarioLogado.id }).then((usuario) => {

                if (nome) {
                    usuario.nome = nome
                }

                if (sobrenome) {
                    usuario.sobrenome = sobrenome
                }

                if (headline) {
                    usuario.resumo = headline
                }

                if (cargo_atual) {
                    usuario.cargo_atual = cargo_atual
                }

                if (telefone) {
                    usuario.telefone = telefone
                }

                if (website) {
                    usuario.website = website
                }

                usuario.nomeCompleto = `${nome} ${sobrenome}`

                const foto = req.file.path
                const newFoto = foto.replace('public', '')
                usuario.foto = newFoto

                usuario.save().then(() => {

                    req.flash('success_msg', 'Perfil Atualizado com Sucesso!')
                    res.redirect("/usuario/editarPerfil")

                }).catch((erro) => {

                    req.flash('error_msg', 'ERRO! Não foi possível salvar suas alterações.')
                    res.redirect("/")

                })


            }).catch((erro) => {

                req.flash('error_msg', 'ERRO! Não foi possível localizar seu perfil.')
                res.redirect("/usuario/editarPerfil")

            })

        }

    }

})


router.get("/novaFormacao", (req, res) => {

    const usuarioLogado = infoUsuario(req.user)

    Usuario.findOne({ _id: usuarioLogado.id }).lean().then((usuario) => {

        Formacao.find({ dono: usuarioLogado.id }).lean().then((formacao) => {

            Instituicao.find().lean().then((Instituicoes) => {

                res.render("usuario/novaFormacao", { usuario: usuarioLogado, formacao: formacao, Instituicoes: Instituicoes })

            }).catch((erro) => {

                req.flash('error_msg', 'ERRO! Não foi possível as instituições de ensino.')
                res.redirect("/usuario/editarPerfil")

            })

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

router.get("/encontrarAmigos", (req, res) => {

    const usuarioLogado = infoUsuario(req.user)
    var amigos_separados = usuarioLogado.amigos.split(" ")

    var amigos = []

    amigos_separados.forEach(amigo => {
        if (amigo == 0 || amigo == null || amigo == undefined || amigo == "") {
            console.log("Amigo Invalido")
        } else {
            amigos.push(amigo)
        }
    })

    Usuario.find({ "_id": { $nin: [usuarioLogado.id, amigos] } }).lean().then((usuarios) => {

        res.render("usuario/amigos", { usuario: usuarioLogado, usuarios: usuarios })

    }).catch((erro) => {

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
            res.redirect("/usuario/encontrarAmigos")

        } else {

            usuario.amigos_pendentes = usuario.amigos_pendentes + `${usuarioLogado.id} `
            usuario.save().then(() => {

                const novaNotificacao = new Notificacao({

                    dono: usuario._id,
                    texto: `${usuarioLogado.nome} Enviou um Convite de Amizade para Você! Para aceitar ou rejeitar esse convite, clique nesse container de notificação.`,
                    tipo: 'Convite de Amizade',
                    file: 'https://cdn-icons-png.flaticon.com/512/3135/3135789.png',
                    link: '/usuario/amigosPendentes'

                })

                novaNotificacao.save().then(() => {

                    req.flash('success_msg', 'SUCESSO! O convite de Amizade foi enviado...')
                    res.redirect("/usuario/encontrarAmigos")

                }).catch((erro) => {

                    req.flash('error_msg', 'ERRO! Não foi possível enviar o Convite.')
                    res.redirect("/usuario/amigos")

                })

            })

        }

    }).catch((erro) => {

        req.flash('error_msg', 'ERRO! Não foi possível encontrar a conta desse usuário.')
        res.redirect("/usuario/amigos")

    })

})

router.get("/amigosPendentes", (req, res) => {

    const usuarioLogado = infoUsuario(req.user)

    var amigosPendentes = []

    var convites = usuarioLogado.amigos_pendentes.split(" ")
    convites.forEach(convite => {
        if (convite == 0 || convite == null || convite == undefined || convite == "") {
            console.log("Amigo Invalido")
        } else {
            amigosPendentes.push(convite)
        }
    })

    Usuario.find({ "_id": { $in: amigosPendentes } }).lean().then((amigos_pendentes) => {

        res.render("usuario/amigosPendentes", { usuario: usuarioLogado, convites: amigos_pendentes })

    }).catch((erro) => {

        req.flash('error_msg', 'ERRO! Não foi possível encontrar os convites de Amizade...')
        res.redirect('/')

    })

})

router.get("/amigos", (req, res) => {

    const usuarioLogado = infoUsuario(req.user)
    var amigos = []

    var amigos_atuais = usuarioLogado.amigos.split(" ")
    amigos_atuais.forEach(amigo => {
        if (amigo == 0 || amigo == null || amigo == undefined || amigo == "") {
            console.log("Amigo Invalido")
        } else {
            amigos.push(amigo)
        }
    })

    Usuario.find({ _id: amigos }).lean().then((amigos) => {

        res.render("usuario/meusAmigos", { usuario: usuarioLogado, amigos: amigos })

    }).catch((erro) => {

        req.flash('error_msg', 'ERRO! Não foi possível encontrar seus amigos')
        res.redirect("/")

    })

})

router.get("/convitesEnviados", (req, res) => {

    const usuarioLogado = infoUsuario(req.user)

    res.render("usuario/convitesEnviados")

})

router.post("/amigos/deletar", (req, res) => {

    const usuarioLogado = infoUsuario(req.user)

})

router.post("/amigos/aceitar", (req, res) => {

    const usuarioLogado = infoUsuario(req.user)

    Usuario.findOne({ _id: usuarioLogado.id }).then((usuario) => {

        usuario.amigos += `${req.body.id} `
        usuario.seguidores += 1

        var amigos = []

        var amigosSeparados = usuario.amigos_pendentes.split(" ")
        amigosSeparados.forEach(amigo => {

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
                res.redirect("/usuario/amigosPendentes")

            }).catch((erro) => {

                req.flash('error_msg', 'ERRO! Não foi possível aceitar o convite...')
                res.redirect("/usuario/amigosPendentes")

            })

        }).catch((erro) => {

            req.flash('error_msg', 'ERRO! Não foi possível sincronizar o convite...')
            res.redirect("/usuario/amigosPendentes")

        })

    }).catch((erro) => {

        req.flash('error_msg', 'ERRO! Não foi possível encontrar esse convite em sua conta...')
        res.redirect("/usuario/amigosPendentes")

    })

})

router.post("/amigos/rejeitar", (req, res) => {

    const usuarioLogado = infoUsuario(req.user)

    Usuario.findOne({ _id: usuarioLogado.id }).then((usuario) => {

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

router.get("/buscarVagas", (req, res) => {

    const usuarioLogado = infoUsuario(req.user)

    res.render("usuario/vagasEmprego", { usuario: usuarioLogado })

})

router.get("/vaga", (req, res) => {

    const usuarioLogado = infoUsuario(req.user)

    res.render("usuario/vaga", { usuario: usuarioLogado })

})

router.get("/criarPagina", (req, res) => {

    const usuarioLogado = infoUsuario(req.user)

    res.render("usuario/criarPagina", { usuario: usuarioLogado })

})

router.get("/criarEmpresa", (req, res) => {

    const usuarioLogado = infoUsuario(req.user)

    res.render("empresa/criarEmpresa", { usuario: usuarioLogado })

})

router.post("/novaEmpresa", (req, res) => {

    const usuarioLogado = infoUsuario(req.user)
    const checkbox = req.body.permissao

    var erros = []

    if (checkbox == 'Assinado') {

        if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
            erros.push({ texto: "Adicione um Nome" })
        }

        if (req.body.nome.length < 2) {
            erros.push({ texto: "Nome muito Pequeno" })
        }

        if (req.body.nome.length > 30) {
            erros.push({ texto: "Nome muito Grande" })
        }

        if (!req.body.industria || typeof req.body.industria == undefined || req.body.industria == null) {
            erros.push({ texto: "Adicione o ramo da sua Empresa" })
        }

        if (!req.body.tamanho_empresa || typeof req.body.tamanho_empresa == undefined || req.body.tamanho_empresa == null) {
            erros.push({ texto: "Adicione o tamanho da sua Empresa" })
        }

        if (!req.body.tipo_empresa || typeof req.body.tipo_empresa == undefined || req.body.tipo_empresa == null) {
            erros.push({ texto: "Adicione o tipo da sua Empresa" })
        }

        if (!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null) {
            erros.push({ texto: "Adicione uma descrição da sua Empresa" })
        }

        if (erros.length > 0) {

            res.render("usuario/criarPagina", { erros: erros })

        } else {

            Empresa.findOne({ nome: req.body.nome }).lean().then((empresa) => {

                if (empresa) {
                    req.flash('error_msg', 'ERRO! Já existe uma empresa com esse nome cadastrada em nosso Sistema...')
                    res.redirect("/usuario/criarPagina")
                } else {

                    if (req.body.website) {

                        const novaEmpresa = new Empresa({

                            dono: usuarioLogado.id,
                            nome: req.body.nome,
                            website: req.body.website,
                            qtdFuncionarios: req.body.tamanho_empresa,
                            industria: req.body.industria,
                            tipo: req.body.tipo_empresa,
                            descricao: req.body.descricao

                        })

                        novaEmpresa.save().then(() => {

                            Usuario.findOne({ _id: usuarioLogado.id }).then((usuario) => {

                                usuario.tipoConta = "empresarial"
                                usuario.save().then(() => {

                                    req.flash('success_msg', 'SUCESSO! A sua página empresarial foi criada.')
                                    res.redirect("/usuario/criarPagina")

                                }).catch((erro) => {

                                    req.flash('error_msg', 'ERRO! Não foi possível salvar as alterações.')
                                    res.redirect("/usuario/criarPagina")

                                })

                            }).catch((erro) => {

                                req.flash('error_msg', 'ERRO! Não foi possível identificar sua conta.')
                                res.redirect("/usuario/criarPagina")

                            })

                        }).catch((erro) => {

                            req.flash('error_msg', 'ERRO! Não foi possível criar a página.')
                            res.redirect("/usuario/criarPagina")

                        })

                    } else {

                        const novaEmpresa = new Empresa({

                            dono: usuarioLogado.id,
                            nome: req.body.nome,
                            website: "",
                            qtdFuncionarios: req.body.tamanho_empresa,
                            industria: req.body.industria,
                            tipo: req.body.tipo_empresa,
                            descricao: req.body.descricao

                        })

                        novaEmpresa.save().then(() => {

                            Usuario.findOne({ _id: usuarioLogado.id }).then((usuario) => {

                                usuario.tipoConta = "empresarial"
                                usuario.save().then(() => {

                                    req.flash('success_msg', 'SUCESSO! A sua página empresarial foi criada.')
                                    res.redirect("/usuario/criarPagina")

                                }).catch((erro) => {

                                    req.flash('error_msg', 'ERRO! Não foi possível salvar as alterações.')
                                    res.redirect("/usuario/criarPagina")

                                })

                            }).catch((erro) => {

                                req.flash('error_msg', 'ERRO! Não foi possível identificar sua conta.')
                                res.redirect("/usuario/criarPagina")

                            })

                        }).catch((erro) => {

                            req.flash('error_msg', 'ERRO! Não foi possível criar a página.')
                            res.redirect("/usuario/criarPagina")

                        })

                    }

                }

            })

        }

    } else {

        erros.push("Para criar sua Empresa, marque o Checkbox de Permissão.")
        res.render("usuario/criarPagina", { erros: erros })

    }

})

router.get("/criarInstituicao", (req, res) => {

    const usuarioLogado = infoUsuario(req.user)

    res.render("empresa/criarInstituicao", { usuario: usuarioLogado })

})

router.post("/novaInstituicao", (req, res) => {

    const usuarioLogado = infoUsuario(req.user)
    const checkbox = req.body.permissao

    var erros = []

    if (checkbox == 'Assinado') {

        if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
            erros.push({ texto: "Adicione um Nome" })
        }

        if (req.body.nome.length < 2) {
            erros.push({ texto: "Nome muito Pequeno" })
        }

        if (req.body.nome.length > 30) {
            erros.push({ texto: "Nome muito Grande" })
        }

        if (!req.body.industria || typeof req.body.industria == undefined || req.body.industria == null) {
            erros.push({ texto: "Adicione o ramo da sua Empresa" })
        }

        if (!req.body.tamanho_instituicao || typeof req.body.tamanho_instituicao == undefined || req.body.tamanho_instituicao == null) {
            erros.push({ texto: "Adicione o tamanho da sua Empresa" })
        }

        if (!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null) {
            erros.push({ texto: "Adicione uma descrição da sua Empresa" })
        }

        if (erros.length > 0) {

            res.render("usuario/criarPagina", { erros: erros })

        } else {

            Instituicao.findOne({ nome: req.body.nome }).lean().then((instituicao) => {

                if (instituicao) {
                    req.flash('error_msg', 'ERRO! Já existe uma instituição com esse nome cadastrada em nosso Sistema...')
                    res.redirect("/usuario/criarPagina")
                } else {

                    if (req.body.website) {

                        const novaInstituicao = new Instituicao({

                            dono: usuarioLogado.id,
                            nome: req.body.nome,
                            website: req.body.website,
                            qtdFuncionarios: req.body.tamanho_instituicao,
                            industria: req.body.industria,
                            descricao: req.body.descricao

                        })

                        novaInstituicao.save().then(() => {

                            Usuario.findOne({ _id: usuarioLogado.id }).then((usuario) => {

                                usuario.tipoConta = "institucional"
                                usuario.save().then(() => {

                                    req.flash('success_msg', 'SUCESSO! A sua página institucional foi criada.')
                                    res.redirect("/usuario/criarPagina")

                                }).catch((erro) => {

                                    req.flash('error_msg', 'ERRO! Não foi possível salvar as alterações.')
                                    res.redirect("/usuario/criarPagina")

                                })

                            }).catch((erro) => {

                                req.flash('error_msg', 'ERRO! Não foi possível identificar sua conta.')
                                res.redirect("/usuario/criarPagina")

                            })

                        }).catch((erro) => {

                            req.flash('error_msg', 'ERRO! Não foi possível criar a página.')
                            res.redirect("/usuario/criarPagina")

                        })

                    } else {

                        const novaInstituicao = new Instituicao({

                            dono: usuarioLogado.id,
                            nome: req.body.nome,
                            website: "",
                            qtdFuncionarios: req.body.tamanho_instituicao,
                            industria: req.body.industria,
                            descricao: req.body.descricao

                        })

                        novaInstituicao.save().then(() => {

                            Usuario.findOne({ _id: usuarioLogado.id }).then((usuario) => {

                                usuario.tipoConta = "institucional"
                                usuario.save().then(() => {

                                    req.flash('success_msg', 'SUCESSO! A sua página institucional foi criada.')
                                    res.redirect("/usuario/criarPagina")

                                }).catch((erro) => {

                                    req.flash('error_msg', 'ERRO! Não foi possível salvar as alterações.')
                                    res.redirect("/usuario/criarPagina")

                                })

                            }).catch((erro) => {

                                req.flash('error_msg', 'ERRO! Não foi possível identificar sua conta.')
                                res.redirect("/usuario/criarPagina")

                            })

                        }).catch((erro) => {

                            req.flash('error_msg', 'ERRO! Não foi possível criar a página.')
                            res.redirect("/usuario/criarPagina")

                        })

                    }

                }

            })

        }

    } else {

        erros.push("Para criar sua Empresa, marque o Checkbox de Permissão.")
        res.render("usuario/criarPagina", { erros: erros })

    }

})

router.get("/encontrarPaginas", (req, res) => {

    const usuarioLogado = infoUsuario(req.user)

    if (usuarioLogado.paginas) {

        const empresas = usuarioLogado.paginas
        const empresas_seguidas = empresas.split(" ")

        Empresa.find({ "dono": { $ne: usuarioLogado.id }, "_id": { $nin: [empresas_seguidas] } }).lean().then((empresas) => {

            Instituicao.find({ "dono": { $ne: usuarioLogado.id }, "_id": { $nin: [empresas_seguidas] } }).lean().then((instituicoes) => {

                res.render("usuario/encontrarPaginas", { usuario: usuarioLogado, empresas: empresas, instituicoes: instituicoes })

            }).catch((erro) => {

                req.flash('error_msg', 'ERRO! Não foi possível encontrar instituições')
                res.redirect('/')

            })

        }).catch((erro) => {

            req.flash('error_msg', 'ERRO! Não foi possível encontrar empresas')
            res.redirect('/')

        })

    } else {

        Empresa.find({ "dono": { $ne: usuarioLogado.id } }).lean().then((empresas) => {

            Instituicao.find({ "dono": { $ne: usuarioLogado.id } }).lean().then((instituicoes) => {

                res.render("usuario/encontrarPaginas", { usuario: usuarioLogado, empresas: empresas, instituicoes: instituicoes })

            }).catch((erro) => {

                req.flash('error_msg', 'ERRO! Não foi possível encontrar instituições')
                res.redirect('/')

            })

        }).catch((erro) => {

            req.flash('error_msg', 'ERRO! Não foi possível encontrar empresas')
            res.redirect('/')

        })

    }

})

router.post("/encontrarPaginas/seguirPagina", (req, res) => {

    const usuarioLogado = infoUsuario(req.user)

    Usuario.findOne({ _id: usuarioLogado.id }).then((usuario) => {

        if (req.body.tipo === 'empresa') {

            Empresa.findOne({ _id: req.body.id }).then((pagina) => {

                pagina.seguidores += 1
                usuario.paginas += `${req.body.id} `

                pagina.save().then(() => {

                    usuario.save().then(() => {

                        req.flash('success_msg', 'Você começou a seguir a página!')
                        res.redirect("/usuario/encontrarPaginas")

                    }).catch((erro) => {

                        req.flash('error_msg', 'ERRO! Não foi possível seguir a página')
                        res.redirect('/usuario/encontrarPaginas')

                    })

                }).catch((erro) => {

                    req.flash('error_msg', 'ERRO! Não foi possível seguir a página')
                    res.redirect('/usuario/encontrarPaginas')

                })

            }).catch((erro) => {

                req.flash('error_msg', 'ERRO! Não foi possível encontrar a empresa')
                res.redirect('/usuario/encontrarPaginas')

            })

        }

        if (req.body.tipo === 'instituicao') {

            Instituicao.findOne({ _id: req.body.id }).then((pagina) => {

                pagina.seguidores += 1
                usuario.paginas += `${req.body.id} `

                pagina.save().then(() => {

                    usuario.save().then(() => {

                        req.flash('success_msg', 'Você começou a seguir a página!')
                        res.redirect("/usuario/encontrarPaginas")

                    }).catch((erro) => {

                        req.flash('error_msg', 'ERRO! Não foi possível seguir a página')
                        res.redirect('/usuario/encontrarPaginas')

                    })

                }).catch((erro) => {

                    req.flash('error_msg', 'ERRO! Não foi possível seguir a página')
                    res.redirect('/usuario/encontrarPaginas')

                })

            }).catch((erro) => {

                req.flash('error_msg', 'ERRO! Não foi possível encontrar a instituição')
                res.redirect('/usuario/encontrarPaginas')

            })
        }

    }).catch((erro) => {

        req.flash('error_msg', 'ERRO! Não foi possível sincronizar sua conta!')
        res.redirect("/usuario/encontrarPaginas")

    })

})

router.get("/paginas", (req, res) => {

    const usuarioLogado = infoUsuario(req.user)

    const empresas = usuarioLogado.paginas
    const empresas_seguidas = empresas.split(" ")

    Empresa.find({ "_id": empresas_seguidas }).lean().then((paginas) => {

        res.render("usuario/paginas", { usuario: usuarioLogado, paginas: paginas })

    })

})

module.exports = router
