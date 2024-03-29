const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Endereco = new Schema({

    dono: {
        type: Schema.Types.ObjectId,
        ref: "usuarios"
    },
    pais: {
        type: String,
        required: true
    },
    estado: {
        type: String,
        required: true
    },
    cidade: {
        type: String,
        required: true
    },
})

mongoose.model("enderecos", Endereco)
