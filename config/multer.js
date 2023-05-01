const multer = require("multer")
const path = require("path")

function numerosMulter() {
    let numeros = [];
    for (let i = 0; i < 3; i++) {
      numeros.push(Math.floor(Math.random() * 10));
    }
    return numeros;
}

let numeros = numerosMulter()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads/")
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + numeros + path.extname(file.originalname))
    }
})

const upload = multer({ storage })

module.exports = upload