const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Empresa = new Schema({

    dono: {
        type: Schema.Types.ObjectId,
        ref: "usuarios",
        required: true
    },
    nome: {
        type: String,
        required: true
    },
    website: {
        type: String
    },
    qtdFuncionarios: {
        type: String,
        required: true
    },
    industria: {
        type: String,
        required: true
    },
    tipo: {
        type: String,
        required: true
    },
    descricao: {
        type: String
    },
    logo: {
        type: String
    },
    seguidores: {
        type: Number,
        default: 0
    }

})

mongoose.model("empresas", Empresa)
