const mongoose =require("mongoose");

const artistSchema = mongoose.Schema({
    artist: {type: String},
    artist_img: String,
    artist_bio: String
})

module.exports = mongoose.model("Artist", artistSchema);