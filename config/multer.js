const multer = require("multer")
const path = require("path")

function gerarLetras() {
    const letras = "abcdefghijklmnopqrstuvwxyz";
    let string = "";
    for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * letras.length);
        string += letras[randomIndex];
    }
    return string;
}

function gerarURL() {
    return Date.now() + gerarLetras()
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads/")
    },
    filename: function (req, file, cb) {
        const nomeArquivo = gerarURL()
        cb(null, nomeArquivo + path.extname(file.originalname))
    }
})

const upload = multer({ storage })

module.exports = upload