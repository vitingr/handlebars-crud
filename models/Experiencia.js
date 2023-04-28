const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Experiencia = new Schema({

    dono: {
        type: Schema.Types.ObjectId,
        ref: "usuarios",
        required: true        
    },
    empresa: {
        type: String,
        required: true   
    },
    cargo: {
        type: String,
        required: true
    }

})

mongoose.model("experiencias", Experiencia)