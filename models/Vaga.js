const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Usuario = new Schema({

    empresa: {
        type: Schema.Types.ObjectId,
        ref: "empresas",
        required: true
    },
    cargo: {
        type: String,
        required: true
    },
    salarioMinimo: {
        type: Number
    },
    salarioMaximo: {
        type: Number,
        required: true
    },
    vagasDisponiveis: {
        type: Number,
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    linkEmpresa: {
        type: String
    }

})

mongoose.model("usuarios", Usuario)

