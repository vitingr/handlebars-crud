module.exports = {

    Logado: (req, res, next) => {

        console.log(req.user)
        if (req.isAuthenticated() && req.user.logado == 1) {

            console.log(req.user)
            return next()

        }

        req.flash('error_msg', 'ERRO! Você precisa estar logado para acessar essa área!')
        res.redirect("/login")

    }

}
