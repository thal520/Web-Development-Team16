const mongoose =require("mongoose");

const albumSchema = mongoose.Schema({
    album: {type: String},
    artist: String,
    album_img: String,
    album_descr: String,
    year: Number,
    rating: Number
})

module.exports = mongoose.model("Album", albumSchema);