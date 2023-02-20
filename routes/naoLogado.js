const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")

// Páginas

router.get("/", (req, res) => {

    res.send("Teste")

})

module.exports = router