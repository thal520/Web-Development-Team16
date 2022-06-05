const mongoose =require("mongoose");

const songSchema = mongoose.Schema({
    song_ID: Number,
    song: {type: String},
    artist: String,
    album: String,
    year: Number,
    music: String,
    lyrics: String,    
    song_img: String,
    hit: Boolean,
    coming_soon: Boolean,
    rating: {type: Number}
});

module.exports = mongoose.model("Song", songSchema);
