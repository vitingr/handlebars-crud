module.exports = {

    Logado: (req, res, next) => {

        console.log(req.user)
        if (req.isAuthenticated() && req.user.logado == 1) {

            console.log(req.user)
            return next()

        }

        res.render("naoLogado/login", { error_msg: "Você precisa estar logado para Acessar!" })

    }

}
