const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Notificacao = new Schema({

    dono: {
        type: Schema.Types.ObjectId,
        ref: "usuarios",
        required: true        
    },
    texto: {
        type: String
    },
    tipo: {
        type: String,
        required: true
    },
    cor: {
        type: String,
        required: true
    },
    link: {
        type: String
    }

})

mongoose.model("notificacoes", Notificacao)

// tipo: vaga_emprego, notificacao_sistema, conquistas, alertas, propostas