const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Formacao = new Schema({

    dono: {
        type: Schema.Types.ObjectId,
        ref: "usuarios",
        required: true        
    },
    nome: {
        type: String,
        required: true
    },
    tipo: {
        type: String,
        required: true
    }

})

mongoose.model("formacoes", Formacao)