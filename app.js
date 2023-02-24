// Aplicativo Desenvolvido por Vitor Gabriel Silva, para fins de apresentação de um trabalho de Conclusão de Curso

// Imports do Projeto

const express = require("express")
const app = express()
const mongoose = require("mongoose")
const handlebars = require("handlebars")
const { engine } = require("express-handlebars")
const session = require("express-session")
const passport = require("passport")
const flash = require("connect-flash")
const path = require("path")
const bcrypt = require("bcryptjs")

// Declaração de Rotas

const empresa = require("./routes/empresa")
const usuario = require("./routes/usuario")

// Declaração de Models

// Método de Autenticação

require("./config/auth")(passport)

const { Logado } = require("./helpers/estaLogado")

// Configurações de Conexão com o Banco de Dados

console.log("Futuro")

// Configuração da Sessão

app.use(
    session({
        secret: "dm1460",
        resave: true,
        saveUninitialized: true
    })
)

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

// Configurações leitura de JSON

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Configurações Middlewares e Cookies

app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    res.locals.error = req.flash("error")
    res.locals.user = req.user || null
    res.locals.admin = req.Admin || null
    next()
})

// Configurações Handlebars

app.engine('handlebars', engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// Mongoose 

mongoose.set("strictQuery", false);
mongoose.Promise = global.Promise
mongoose.connect("mongodb://localhost:27017/TCC").then(() => {

    console.log("SUCESSO! Login com o MongoDB Realizado com Sucesso!")

}).catch((erro) => {

    console.log(`ERRO! Não foi possível realizar o Login com o MongoDB: ${erro}`)

})

// Regex Email

function validarEmail(email) {
    const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return regex.test(email)
}

// Rotas de Acesso

app.get("/", (req, res) => {

    res.render("naoLogado/cadastro")

})

app.get("/login", (req, res) => {

    res.render("naoLogado/login")

})

app.post("/login/done", passport.authenticate("local", {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: 'true',
    session: true
}), (req, res) => {

    req.flash('success_msg', 'Bem-Vindo, você foi logado com sucesso!')

})

app.get("/cadastrar", (req, res) => {

    res.render("naoLogado/cadastro")

})

app.post("cadastrar", (req, res) => {

    var erros = []

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({texto: "Nome Inválido"})
    }

    if (req.body.nome.length > 20) {
        erros.push({texto: "Nome muito Grande"})
    }

    if (req.body.sobrenome.length > 20) {
        erros.push({texto: "Sobreome muito Grande"})
    }

    if (req.body.nome.length < 2) {
        erros.push({texto: "Nome muito Curto"})
    }

    if (req.body.sobrenome.length < 2) {
        erros.push({texto: "Sobrenome muito Curto"})
    }

    if (!req.body.sobrenome || typeof req.body.sobrenome == undefined || req.body.sobrenome == null) {
        erros.push({texto: "Sobrenome Inválido"})
    }

    if (!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null) {
        erros.push({texto: "Senha Inválida"})
    }

    if (req.body.senha.length > 20) {
        erros.push({texto: "Senha muito Grande"})
    }

    if (req.body.senha.length < 8) {
        erros.push({texto: "Senha muito Curta"})
    }

    if (!req.body.senhaConfirmar || typeof req.body.senhaConfirmar == undefined || req.body.senhaConfirmar == null) {
        erros.push({texto: "Senha Inválida"})
    }
    
    if (req.body.senhaConfirmar.length > 20) {
        erros.push({texto: "Senha muito Grande"})
    }

    if (req.body.senhaConfirmar.length < 8) {
        erros.push({texto: "Senha muito Curta"})
    }

    if (req.body.senha != req.body.confirmarSenha) {
        erros.push({ texto: "As Senhas são Diferentes! Tente Novamente..." })
    }

    if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
        erros.push({texto: "Email Inválido"})
    }

    if (req.body.email.includes("@")) {
        console.log("Email Válido")
    } else {
        erros.push({ texto: "Isso não é um Email" })
    }

    if (req.body.email.includes(".com")) {
        console.log("Email Válido")
    } else {
        erros.push({ texto: "Email Inválido" })
    }

    if (validarEmail(req.body.email)) {
        console.log("Email Válido, Regex Funcionou")
    } else {
        erros.push({ texto: "Email Inválido" })
    }


})

app.get("/logout", (req, res) => {

    res.send("Em breve")

})

app.get('/404', (req, res) => {

    res.send("Erro 404! Deu um Erro!...")

})

// Adicionar Rotas 

app.use('/empresa', empresa)
app.use('/usuario', usuario)

// Public

app.use(express.static(path.join(__dirname, "public")))

app.use((req, res, next) => {

    console.log("Middleware Ativado")
    next()

})

// Inicialização

const PORT = 3030

app.listen(PORT, () => {
    console.log(`SUCESSO! Servidor Funcionando na Porta ${PORT}`)
})

