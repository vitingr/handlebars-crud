const localStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

// Model do Usuário
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")

module.exports = (passport) => {

    console.log("Chegou no AUTH")

    passport.use(
        new localStrategy({
            usernameField: 'email',
            passwordField: 'senha'
        },
            (email, senha, done) => {

                Usuario.findOne({ email: email }).lean().then((usuario) => {

                    if (!usuario) {
                        console.log("ERRO! Essa conta não Existe!")
                        return done(null, false, { message: "Essa Conta não Existe!" }) // null = error | false = user
                    }

                    bcrypt.compare(senha, usuario.senha, (erro, sucesso) => { // Verificador de Hash para verificar se a senha hasheada equivale a senha digitada.

                        if (erro) {
                            console.log(`${erro}`)
                            throw erro
                        }

                        if (sucesso) {

                            return done(null, usuario, { message: "Conectado com Sucesso!" }) // Necessário configurar o Serialize e Deserialize para salvar a sessão

                        } else {

                            console.log("Senha Incorreta")
                            return done(null, false, { message: "Senha Incorreta" })

                        }

                    })

                })

            }))

    // Assim que o usuário logar, os dados vão ser salvos juntos com a sessão atual.

    passport.serializeUser((usuario, done) => {

        done(null, usuario._id)

    }) // Envia os dados para o req.user, que é uma função do passport que pega os dados do user atual da sessão.

    passport.deserializeUser((id, done) => {

        Usuario.findOne({ _id: id }, (erro, usuario) => {

            done(erro, usuario)

        })

    })

}
