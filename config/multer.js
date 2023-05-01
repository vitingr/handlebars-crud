const multer = require("multer")
const path = require("path")

function gerarLetras() {
    const letras = "abcdefghijklmnopqrstuvwxyz";
    let string = "";
    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * alfabeto.length);
      string += alfabeto[randomIndex];
    }
    return string;
  }

let string = gerarLetras()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads/")
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + string + path.extname(file.originalname))
    }
})

const upload = multer({ storage })

module.exports = upload