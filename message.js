const mongoose =require("mongoose");

const messageSchema = mongoose.Schema({
    email: String,
    message: String
})

module.exports = mongoose.model("Message", messageSchema);