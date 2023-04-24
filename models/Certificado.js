const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Certificado = new Schema({

    dono: {
        type: Schema.Types.ObjectId,
        ref: "usuarios",
        required: true        
    },
    nome: {
        type: String,
        required: true
    },
    unidade: {
        type: Schema.Types.ObjectId,
        ref: "paginas",
        required: true
    },
    foto: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/5809/5809858.png"
    }

})

mongoose.model("certificados", Certificado)