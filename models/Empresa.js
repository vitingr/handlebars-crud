const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Empresa = new Schema({

    dono: {
        type: Schema.Types.ObjectId,
        ref: "usuarios",
        required: true
    },
    endereco: {
        type: String,
        required: true
    },
    nomeEmpresa: {
        type: String,
        required: true
    },
    nomeFantasia: {
        type: String,
        requidred: true
    },
    cnpj: {
        type: String,
        required: true
    },
    qtdFuncionarios: {
        type: Number
    },
    ramo: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        required: true
    }

})

mongoose.model("empresas", Empresa)
