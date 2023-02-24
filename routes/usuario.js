const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")

// Páginas

router.get("/", (req, res) => {

    res.render("usuario/inicio")

})

module.exports = router