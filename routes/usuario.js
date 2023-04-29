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
                fotoDono: usuario.foto,
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

        Postagem.find({ dono: usuarioLogado.id }).lean().sort({ data: 'asc' }).then((postagens) => {

            if (!usuarioLogado.endereco || usuarioLogado.endereco == null || usuarioLogado.endereco == undefined || usuarioLogado.endereco == "") {

                Endereco.findOne({ _id: usuarioLogado.endereco }).lean().then((endereco) => {

                    Formacao.findOne({ _id: usuarioLogado.formacao }).lean().then((formacao) => {

                        Usuario.find({ "_id": { $ne: usuarioLogado.id } }).lean().then((usuarios) => {

                            Certificado.find({ dono: usuarioLogado.id }).lean().then((certificacoes) => {

                                Experiencia.find({ dono: usuarioLogado.id }).lean().then((experiencias) => {

                                    if (usuarios.length >= 5) {

                                        let users = []

                                        for (contador = 0; contador < 5; contador++) {
                                            let user = Math.floor(Math.random() * usuarios.length)

                                            if (!users.includes(usuarios[user])) {
                                                users.push(usuarios[user]);
                                            } else {
                                                contador--;
                                            }
                                        }

                                        res.render("usuario/perfil", { usuario: usuarioLogado, formacao: formacao, postagens: postagens, certificacoes: certificacoes, endereco: endereco, usuarios: users, experiencias: experiencias })

                                    } else {

                                        res.render("usuario/perfil", { usuario: usuarioLogado, formacao: formacao, postagens: postagens, certificacoes: certificacoes, endereco: endereco, experiencias: experiencias })

                                    }

                                }).catch((erro) => {

                                    req.flash('error_msg', 'ERRO! Não foi possível encontrar suas experiências...')
                                    res.redirect("/")

                                })

                            }).catch((erro) => {

                                req.flash('error_msg', 'ERRO! Não foi possível encontrar seus certificados...')
                                res.redirect("/")

                            })

                        }).catch((erro) => {

                            req.flash('error_msg', 'ERRO! Não foi possível encontrar outras contas...')
                            res.redirect("/")

                        })

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

                        Usuario.find({ "_id": { $ne: usuarioLogado.id } }).lean().then((usuarios) => {

                            Certificado.find({ dono: usuarioLogado.id }).lean().then((certificacoes) => {

                                Experiencia.find({ dono: usuarioLogado.id }).lean().then((experiencias) => {

                                    if (usuarios.length >= 5) {

                                        let users = []

                                        for (contador = 0; contador < 5; contador++) {
                                            let user = Math.floor(Math.random() * usuarios.length)

                                            if (!users.includes(usuarios[user])) {
                                                users.push(usuarios[user]);
                                            } else {
                                                contador--;
                                            }
                                        }

                                        res.render("usuario/perfil", { usuario: usuarioLogado, formacao: formacao, postagens: postagens, certificacoes: certificacoes, endereco: endereco, usuarios: users, perfil_completo: perfil_completo, experiencias: experiencias })

                                    } else {

                                        res.render("usuario/perfil", { usuario: usuarioLogado, formacao: formacao, postagens: postagens, certificacoes: certificacoes, endereco: endereco, perfil_completo: perfil_completo, experiencias: experiencias })

                                    }

                                }).catch((erro) => {

                                    req.flash('error_msg', 'ERRO! Não foi possível encontrar suas experiências...')
                                    res.redirect("/")

                                })

                            }).catch((erro) => {

                                req.flash('error_msg', 'ERRO! Não foi possível encontrar seus certificados...')
                                res.redirect("/")

                            })

                        }).catch((erro) => {

                            req.flash('error_msg', 'ERRO! Não foi possível encontrar outras contas...')
                            res.redirect("/")

                        })

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

        Usuario.findOne({_id: usuarioLogado.id}).then((usuario) => {

            usuario.notificacoes = 0
            usuario.save().then(() => {

                res.render("usuario/notificacoes", { usuario: usuarioLogado, notificacoes: notificacoes })

            })

        }).catch((erro) => {

            req.flash('error_msg', 'ERRO! Não foi possível carregar sua conta!')
            res.redirect("/")
    
        })

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

router.post("/editInfo", upload.fields([
    { name: 'foto_perfil', maxCount: 1 },
    { name: 'foto_background', maxCount: 1 }
]), (req, res) => {

    const { nome, sobrenome, telefone, tipo_telefone, website, headline, cargo_atual, formacaoUsuario, area, ultima_empresa } = req.body

    const { foto_background, foto_perfil } = req.files

    const usuarioLogado = infoUsuario(req.user)

    // COM FOTO
    if (foto_perfil === null || foto_perfil === undefined || foto_perfil === "") {

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

                    if (req.files.foto_background) {
                        const background = req.files.foto_background[0].path
                        const editBackground = background.replace('public', '')
                        var newBackground = "";
                        for (var i = 0; i < editBackground.length; i++) if (editBackground[i] !== "\"" && editBackground[i] !== "\\") newBackground += editBackground[i];
                        newBackground = newBackground.replace('uploads', '')
                        newBackground = `/uploads/${newBackground}`
                        usuario.background = newBackground
                    }

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


                console.log("B")

                if (req.files.foto_background) {

                    const background = req.files.foto_background[0].path
                    const editBackground = background.replace('public', '')
                    var newBackground = "";
                    for (var i = 0; i < editBackground.length; i++) if (editBackground[i] !== "\"" && editBackground[i] !== "\\") newBackground += editBackground[i];
                    newBackground = newBackground.replace('uploads', '')
                    newBackground = `/uploads/${newBackground}`
                    usuario.background = newBackground
                }

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

                    console.log("C")

                    if (req.files.foto_background) {
                        const background = req.files.foto_background[0].path
                        const editBackground = background.replace('public', '')
                        var newBackground = "";
                        for (var i = 0; i < editBackground.length; i++) if (editBackground[i] !== "\"" && editBackground[i] !== "\\") newBackground += editBackground[i];
                        newBackground = newBackground.replace('uploads', '')
                        newBackground = `/uploads/${newBackground}`
                        usuario.background = newBackground
                    }

                    const foto = req.files.foto_perfil[0].path
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

                console.log("d")

                if (req.files.foto_background) {
                    const background = req.files.foto_background[0].path
                    const editBackground = background.replace('public', '')
                    var newBackground = "";
                    for (var i = 0; i < editBackground.length; i++) if (editBackground[i] !== "\"" && editBackground[i] !== "\\") newBackground += editBackground[i];
                    newBackground = newBackground.replace('uploads', '')
                    newBackground = `/uploads/${newBackground}`
                    usuario.background = newBackground
                }

                const foto = req.files.foto_perfil[0].path
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

            Pagina.find({ modelo: "institucional" }).lean().then((Instituicoes) => {

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

router.get("/novaCertificacao", (req, res) => {

    const usuarioLogado = infoUsuario(req.user)

    Usuario.findOne({ _id: usuarioLogado.id }).lean().then((usuario) => {

        Pagina.find({ modelo: "institucional" }).lean().then((Instituicoes) => {

            res.render("usuario/novaCertificacao", { usuario: usuarioLogado, Instituicoes: Instituicoes })

        }).catch((erro) => {

            req.flash('error_msg', 'ERRO! Não foi possível as instituições de ensino.')
            res.redirect("/usuario/editarPerfil")

        })

    }).catch((erro) => {

        req.flash('error_msg', 'ERRO! Não foi possível localizar sua conta!')
        res.redirect("/usuario/editarPerfil")

    })

})

router.post("/addCertificacao", (req, res) => {

    const usuarioLogado = infoUsuario(req.user)

    Usuario.findOne({ _id: usuarioLogado.id }).lean().then((usuario) => {

        Pagina.findOne({ nome: req.body.instituicao }).lean().then((pagina) => {

            const novoCertificado = {
                dono: usuarioLogado.id,
                nome: req.body.nome,
                unidade: req.body.instituicao,
                foto: pagina.logo
            }

            new Certificado(novoCertificado).save().then(() => {

                req.flash('success_msg', 'Certificação Adicionada com Sucesso!')
                res.redirect("/usuario/editarPerfil")

            }).catch((erro) => {

                console.log(`ERRO ${erro}`)
                req.flash('error_msg', 'ERRO! Não foi possível adicionar a certificação.')
                res.redirect("/")

            })

        }).catch((erro) => {
            console.log(`ERRO ${erro}`)
            req.flash('error_msg', 'ERRO! Não foi possível localizar a instituição.')
            res.redirect("/")

        })

    }).catch((erro) => {
        console.log(`ERRO ${erro}`)
        req.flash('error_msg', 'ERRO! Não foi possível localizar sua conta.')
        res.redirect("/")

    })

})

router.get("/novaExperiencia", (req, res) => {

    const usuarioLogado = infoUsuario(req.user)

    Usuario.findOne({ _id: usuarioLogado.id }).lean().then((usuario) => {

        res.render("usuario/novaExperiencia", { usuario: usuarioLogado })

    }).catch((erro) => {

        req.flash('error_msg', 'ERRO! Não foi possível localizar sua conta!')
        res.redirect("/usuario/editarPerfil")

    })

})

router.post("/addExperiencia", (req, res) => {

    const usuarioLogado = infoUsuario(req.user)

    Usuario.findOne({ _id: usuarioLogado.id }).lean().then((usuario) => {

        const novaExperiencia = {
            dono: usuarioLogado.id,
            empresa: req.body.empresa,
            cargo: req.body.cargo
        }

        new Experiencia(novaExperiencia).save().then(() => {

            req.flash('success_msg', 'Experiência Adicionada com Sucesso!')
            res.redirect("/usuario/editarPerfil")

        }).catch((erro) => {

            console.log(`ERRO ${erro}`)
            req.flash('error_msg', 'ERRO! Não foi possível adicionar a Experiência.')
            res.redirect("/")

        })

    }).catch((erro) => {
        console.log(`ERRO ${erro}`)
        req.flash('error_msg', 'ERRO! Não foi possível localizar sua conta.')
        res.redirect("/")

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

    console.log(`AMIGO:${amigos}`)

    Usuario.find({ "_id": { $nin: [usuarioLogado.id, amigos] } }).lean().then((usuarios) => {

        res.render("usuario/amigos", { usuario: usuarioLogado, usuarios: usuarios })

    }).catch((erro) => {

        console.log(`erro ${erro}`)
        req.flash('error_msg', 'ERRO! Não foi possível encontrar pessoas!')
        res.redirect("/")

    })

})

router.get("/verPerfil/:id", (req, res) => {

    const usuarioLogado = infoUsuario(req.user)

    Usuario.findOne({ _id: req.params.id }).lean().then((usuarioPerfil) => {

        Postagem.find({ dono: req.params.id }).lean().sort({ data: 'asc' }).then((postagens) => {

            Endereco.findOne({ _id: usuarioPerfil.endereco }).lean().then((endereco) => {

                Formacao.findOne({ _id: usuarioPerfil.formacao }).lean().then((formacao) => {

                    Usuario.find({ "_id": { $ne: usuarioPerfil.id } }).lean().then((usuarios) => {

                        Certificado.find({ dono: usuarioPerfil._id }).lean().then((certificacoes) => {

                            Experiencia.find({ dono: usuarioPerfil._id }).lean().then((experiencias) => {

                                if (usuarios.length >= 5) {

                                    let users = []

                                    for (contador = 0; contador < 5; contador++) {
                                        let user = Math.floor(Math.random() * usuarios.length)

                                        if (!users.includes(usuarios[user])) {
                                            users.push(usuarios[user]);
                                        } else {
                                            contador--;
                                        }
                                    }

                                    res.render("usuario/verPerfil", { usuario: usuarioLogado, formacao: formacao, postagens: postagens, certificacoes: certificacoes, endereco: endereco, usuarios: users, usuarioPerfil: usuarioPerfil, experiencias: experiencias })

                                } else {

                                    res.render("usuario/verPerfil", { usuario: usuarioLogado, formacao: formacao, postagens: postagens, certificacoes: certificacoes, endereco: endereco, usuarioPerfil: usuarioPerfil, experiencias: experiencias })

                                }

                            }).catch((erro) => {

                                req.flash('error_msg', 'ERRO! Não foi possível encontrar as experiências...')
                                res.redirect("/")
        
                            })

                        }).catch((erro) => {

                            req.flash('error_msg', 'ERRO! Não foi possível encontrar os certificados...')
                            res.redirect("/")
    
                        })

                    }).catch((erro) => {

                        req.flash('error_msg', 'ERRO! Não foi possível encontrar outras contas...')
                        res.redirect("/")

                    })

                }).catch((erro) => {

                    req.flash('error_msg', 'ERRO! Não foi possível encontrar suas formações.')
                    res.redirect("/")

                })

            })

        }).catch((erro) => {

            req.flash('error_msg', 'ERRO! Não foi possível encontrar suas postagens.')
            res.redirect("/")

        })

    }).catch((erro) => {

        console.log(`erro ${erro}`)

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

            usuario.notificacoes += 1
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

            amigo.amigos += `${usuarioLogado.id} `
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

router.post("/novaEmpresa", upload.fields([
    { name: 'foto_logo', maxCount: 1 },
    { name: 'foto_background', maxCount: 1 }
]), (req, res) => {

    const { foto_logo, foto_background } = req.files

    var setLogo = ""
    var setBackground = ""

    if (foto_logo) {
        const logo = req.files.foto_logo[0].path
        setLogo = logo.replace('public', '')
    } else {
        setLogo = "https://images.squarespace-cdn.com/content/v1/543fa8a4e4b07a3fedf53cf8/1509402629365-7RTSVCL7IYMGHRFZF8G8/fullsizeoutput_5147.jpeg"
    }

    if (foto_background) {
        const background = req.files.foto_background[0].path
        const editBackground = background.replace('public', '')
        var newBackground = "";
        for (var i = 0; i < editBackground.length; i++) if (editBackground[i] !== "\"" && editBackground[i] !== "\\") newBackground += editBackground[i];
        newBackground = newBackground.replace('uploads', '')
        setBackground = `/uploads/${newBackground}`

    } else {

        setBackground = "https://img.freepik.com/free-vector/gradient-spheres-background_52683-76367.jpg"

    }

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

        if (req.body.nome.length > 35) {
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

            Pagina.findOne({ nome: req.body.nome }).lean().then((empresa) => {

                if (empresa) {
                    req.flash('error_msg', 'ERRO! Já existe uma empresa com esse nome cadastrada em nosso Sistema...')
                    res.redirect("/usuario/criarPagina")
                } else {

                    if (req.body.website) {

                        const novaPagina = new Pagina({

                            logo: setLogo,
                            background: setBackground,
                            dono: usuarioLogado.id,
                            nome: req.body.nome,
                            website: req.body.website,
                            qtdFuncionarios: req.body.tamanho_empresa,
                            industria: req.body.industria,
                            tipo: req.body.tipo_empresa,
                            descricao: req.body.descricao,
                            modelo: "empresa"
                        })

                        novaPagina.save().then(() => {

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

                        const novaPagina = new Pagina({

                            logo: setLogo,
                            background: setBackground,
                            dono: usuarioLogado.id,
                            nome: req.body.nome,
                            website: "",
                            qtdFuncionarios: req.body.tamanho_empresa,
                            industria: req.body.industria,
                            tipo: req.body.tipo_empresa,
                            descricao: req.body.descricao,
                            modelo: "empresa"

                        })

                        novaPagina.save().then(() => {

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

router.post("/novaInstituicao", upload.fields([
    { name: 'foto_logo', maxCount: 1 },
    { name: 'foto_background', maxCount: 1 }
]), (req, res) => {

    const { foto_logo, foto_background } = req.files

    var setLogo = ""
    var setBackground = ""

    if (foto_logo) {
        const logo = req.files.foto_logo[0].path
        setLogo = logo.replace('public', '')
    } else {
        setLogo = "https://images.squarespace-cdn.com/content/v1/543fa8a4e4b07a3fedf53cf8/1509402629365-7RTSVCL7IYMGHRFZF8G8/fullsizeoutput_5147.jpeg"
    }

    if (foto_background) {
        const background = req.files.foto_background[0].path
        const editBackground = background.replace('public', '')
        var newBackground = "";
        for (var i = 0; i < editBackground.length; i++) if (editBackground[i] !== "\"" && editBackground[i] !== "\\") newBackground += editBackground[i];
        newBackground = newBackground.replace('uploads', '')
        setBackground = `/uploads/${newBackground}`

    } else {

        setBackground = "https://img.freepik.com/free-vector/gradient-spheres-background_52683-76367.jpg"

    }

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

        if (req.body.nome.length > 35) {
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

            Pagina.findOne({ nome: req.body.nome }).lean().then((instituicao) => {

                if (instituicao) {
                    req.flash('error_msg', 'ERRO! Já existe uma instituição com esse nome cadastrada em nosso Sistema...')
                    res.redirect("/usuario/criarPagina")
                } else {

                    if (req.body.website) {

                        const novaPagina = new Pagina({

                            logo: setLogo,
                            background: setBackground,
                            dono: usuarioLogado.id,
                            nome: req.body.nome,
                            website: req.body.website,
                            qtdFuncionarios: req.body.tamanho_instituicao,
                            industria: req.body.industria,
                            descricao: req.body.descricao,
                            modelo: "institucional"
                        })

                        novaPagina.save().then(() => {

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

                        const novaPagina = new Pagina({

                            logo: setLogo,
                            background: setBackground,
                            dono: usuarioLogado.id,
                            nome: req.body.nome,
                            website: "",
                            qtdFuncionarios: req.body.tamanho_instituicao,
                            industria: req.body.industria,
                            descricao: req.body.descricao,
                            modelo: "institucional"

                        })

                        novaPagina.save().then(() => {

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

        Pagina.find({ "dono": { $ne: usuarioLogado.id }, "_id": { $nin: empresas_seguidas } }).lean().then((empresas) => {

            res.render("usuario/encontrarPaginas", { usuario: usuarioLogado, empresas: empresas })

        }).catch((erro) => {

            req.flash('error_msg', 'ERRO! Não foi possível encontrar empresas')
            res.redirect('/')

        })

    } else {

        Pagina.find({ "dono": { $ne: usuarioLogado.id } }).lean().then((empresas) => {

            res.render("usuario/encontrarPaginas", { usuario: usuarioLogado, empresas: empresas })


        }).catch((erro) => {

            req.flash('error_msg', 'ERRO! Não foi possível encontrar empresas')
            res.redirect('/')

        })

    }

})

router.get("/paginasSeguidas", (req, res) => {

    const usuarioLogado = infoUsuario(req.user)
    var paginas = []

    var paginas_seguidas = usuarioLogado.paginas.split(" ")
    paginas_seguidas.forEach(pagina => {
        if (pagina == 0 || pagina == null || pagina == undefined || pagina == "") {
            console.log("Amigo Invalido")
        } else {
            paginas.push(pagina)
        }
    })

    Usuario.find({ _id: paginas }).lean().then((paginas) => {

        res.render("usuario/meusAmigos", { usuario: usuarioLogado, paginas: paginas })

    }).catch((erro) => {

        req.flash('error_msg', 'ERRO! Não foi possível encontrar seus paginas')
        res.redirect("/")

    })

})

router.post("/encontrarPaginas/seguirPagina", (req, res) => {

    const usuarioLogado = infoUsuario(req.user)

    Usuario.findOne({ _id: usuarioLogado.id }).then((usuario) => {

        Pagina.findOne({ _id: req.body.id }).then((pagina) => {

            const paginas_seguidas = usuario.paginas

            pagina.seguidores += 1

            if (paginas_seguidas == null || paginas_seguidas == undefined || paginas_seguidas == "" || !paginas_seguidas) {
                usuario.paginas += `${req.body.id}`
            } else {
                usuario.paginas += ` ${req.body.id}`
            }

            pagina.save().then(() => {

                usuario.save().then(() => {

                    req.flash('success_msg', 'Você começou a seguir a página!')
                    res.redirect("/usuario/encontrarPaginas")

                }).catch((erro) => {

                    console.log(erro)
                    req.flash('error_msg', 'ERRO! Não foi possível seguir a página')
                    res.redirect('/usuario/encontrarPaginas')

                })

            }).catch((erro) => {

                console.log(erro)
                req.flash('error_msg', 'ERRO! Não foi possível seguir a página')
                res.redirect('/usuario/encontrarPaginas')

            })

        }).catch((erro) => {

            console.log(erro)
            req.flash('error_msg', 'ERRO! Não foi possível encontrar a empresa')
            res.redirect('/usuario/encontrarPaginas')

        })

    }).catch((erro) => {

        req.flash('error_msg', 'ERRO! Não foi possível encontrar a sua conta')
        res.redirect('/usuario/encontrarPaginas')

    })

})

router.get("/paginas", (req, res) => {

    const usuarioLogado = infoUsuario(req.user)
    var paginas = []

    var paginas_seguidas = usuarioLogado.paginas.split(" ")

    paginas_seguidas.forEach(pagina => {
        if (pagina == 0 || pagina == null || pagina == undefined || pagina == "") {
            console.log("Amigo Invalido")
        } else {
            paginas.push(pagina)
        }
    })

    Pagina.find({ _id: paginas }).lean().then((paginas) => {

        res.render("usuario/paginas", { usuario: usuarioLogado, paginas: paginas })

    }).catch((erro) => {

        req.flash('error_msg', 'ERRO! Não foi possível encontrar suas páginas')
        res.redirect("/")

    })

})

module.exports = router
