const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Vaga = new Schema({

    empresa: {
        type: Schema.Types.ObjectId,
        ref: "empresas",
        required: true
    },
    cargo: {
        type: String,
        required: true
    },
    modelo: {
        type: String,
        required: true
    },
    tipo: {
        type: String,
        required: true
    },
    local: {
        type: String,
        required: true
    },
    salarioMinimo: {
        type: Number,
        required: true
    },
    salarioMaximo: {
        type: Number
    },
    vagasDisponiveis: {
        type: Number
    },
    descricao: {
        type: String,
        required: true
    },
    linkEmpresa: {
        type: String
    },
    foto: {
        type: String
    }

})

mongoose.model("vagas", Vaga)

