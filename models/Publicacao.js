const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Publicacao = new Schema({

    dono: {
        type: Schema.Types.ObjectId,
        ref: "usuarios",
        required: true        
    },
    data: {
        type: Date,
        default: Date.now()
    },
    conteudo: {
        type: String,
        required: true
    },
    foto: {
        type: String
    },
    curtidas: {
        type: Number
    },
    compartilhamentos: {
        type: Number
    }

})

mongoose.model("publicacoes", Publicacao)
