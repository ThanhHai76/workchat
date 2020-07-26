const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const chatSchema = new Schema({
    message: {
        type: String
    },
    sender:{
        type: String
    },
    receiver:{
        type: String
    },
    timestamps: {
        type: Date,
        default: Date.now
    }
})

let Chat = mongoose.model("Message", chatSchema);
module.exports = Chat;