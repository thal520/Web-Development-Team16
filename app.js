const mongoose =require("mongoose");
const express = require("express");
const path = require("path");
const app = express();
const Song = require("./Song");
const Album = require("./album");
const Artist  = require("./artist");
const Email = require("./Email");
const Message = require("./Message");
const { json } = require("express");

mongoose.connect("mongodb+srv://discoAdmin:discoAdminPass@cluster0.fzb4q.mongodb.net/discoDB?retryWrites=true&w=majority").then(()=>{
console.log("connected");
})


app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "/views"))
app.use(express.static(path.join(__dirname, "/public")))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.get('/', function (req, res) {
    res.redirect('discO')
  });

//console.log(hits)
app.get('/discO', async function (req, res){
  hits = await Song.find({"hit":true});
  let recents = await Song.find({"coming_soon": false})
  recents = recents.slice(-10);
  comingSoon = await Song.find({"coming_soon": true});
  res.render('homepage', {hits: hits, recents: recents, comingSoon:comingSoon});
})

app.get('/library', async (req, res)=> {

  const years = await  Album.distinct('year') 
  const albums = await Album.find();

  res.render("library", {years: years, albums: albums});
})

app.get('/album:id', async (req, res)=> {
  const id = req.params.id
  const album = await Album.findOne({"_id": id});
  const songs = await Song.find({"album": album.album});
  const lyrics = await Song.distinct("lyrics", {"album": album.album})
  const music = await Song.distinct("music", {"album": album.album})
  const artist = await Artist.findOne({"artist": album.artist})
  res.render("album", {album: album, songs: songs, lyrics: lyrics, music: music, artist: artist});
})

app.get('/top10', async (req, res)=> {
  const songs = await Song.find().sort({"rating": -1}).limit(10);
  const albums = await Album.find().sort({"rating": -1}).limit(10);
  res.render("top10", {songs: songs, albums: albums})
})


app.get('/artists', async (req, res)=> {
  const artists = await Artist.find().sort({"artist": 1})
  res.render("artists", {artists: artists})
})

app.get('/artist:id', async (req, res)=> {
  const id = req.params.id
  const artist = await Artist.findOne({"_id": id});
  const albums = await Album.find({"artist": artist.artist});
  res.render("artist_page", {albums: albums, artist: artist});
})

app.get('/all', async (req, res)=> {
  const artists =  await Artist.find();
  const albums = await Album.find();
  const songs = await Song.find();
  res.render("all", {artists: artists, albums: albums, songs: songs})
})

app.get('/admin/login', (req, res)=> {
  res.render("login")
})
app.post('/admin/albums', async (req, res) => {
  const albums = await Album.find()
  let username = req.body.uname
  let password = req.body.psw
  console.log(username,password)
  if (username === "admin" && password === "admin") {
    res.render("albums/index",{albums: albums})
  }
  else{
    res.redirect("login")
  }})

app.get('/admin/albums', async (req, res)=> {
  const albums = await Album.find();
  res.render("albums/index", {albums: albums})
})

app.get('/admin/albums/create', async (req, res)=> {
  const artists = await Artist.find()
  res.render("albums/create", {artists: artists})
})

app.get('/admin/artists', async (req, res)=> {
  const artists = await Artist.find();
  res.render("artists/index", {artists: artists});
})
app.get('/admin/artists/create', (req, res)=> {
  
  res.render("artists/create")
})

app.get('/admin/songs', async (req, res)=> {
  const songs = await Song.find();
  res.render("songs/index", {songs:songs});
})

app.get('/admin/songs/create', async (req, res)=> {
  const albums = await Album.find(); 
  res.render("songs/create", {albums: albums})
})

app.post('/admin/artists', async (req, res)=>{
  const artist = new Artist(req.body);
  await artist.save();
  const artists = await Artist.find()
  res.render('artists/index', {artists:artists})
})

app.post('/admin/albums', async (req, res)=>{
  const album = new Album(req.body);
  await album.save();
  const albums = await Album.find()
  const artists = await Artist.find()
  res.render('albums/index', {albums:albums, artists: artists})
})

app.post('/admin/songs', async(req, res)=>{
  const albums = await Album.find();
  const song = new Song(req.body);
  if (song.album != ""){
    song.coming_soon = false;
    const album = await Album.findOne({"album": song.album});
    song.artist = album.artist;
    if (song.song_img==null){
      song.song_img = album.album_img;
    }
    if (song.year==null){
      song.year = album.year;
    }
  }
  else {
    if (song.image==null){
    res.render('songs/create', {albums: albums})
    return;
    }
    else {
      song.coming_soon=true;
    }
  }
  await song.save();
  const songs = await Song.find();
  
  const artists = await Artist.find();
  res.render('songs/index', {songs: songs, albums: albums, artist: artists})
  })

app.get("/admin/songs/delete:id", async (req, res)=>{
  const id = req.params.id
  await Song.deleteOne({"_id": id})
  const songs = await Song.find();
  const albums = await Album.find();
  const artists = await Artist.find();
  res.render('songs/index', {songs: songs, albums: albums, artists: artists})
})

app.get("/admin/albums/delete:id", async (req, res)=>{
  const id = req.params.id
  await Album.deleteOne({"_id": id})
  const albums = await Album.find();
  const artists = await Artist.find();
  res.render('albums/index', { albums: albums, artists: artists})
})
  
  app.get("/admin/artists/delete:id", async (req, res)=>{
    const id = req.params.id
    await Artist.deleteOne({"_id": id})
    const artists = await Artist.find();
    res.render('artists/index', {artists: artists})
  })

app.post("/find", async (req, res)=>{
  const x = req.body.search;
  //res.send(x);
  const artists =  await Artist.find({"artist":  { "$regex": `${x}`, "$options": "i"}});
  const albums = await Album.find({"album": { "$regex": `${x}`, "$options": "i"} });
  const songs = await Song.find({"song":  { "$regex": `${x}`, "$options": "i"}});
  res.render("all", {artists: artists, albums: albums, songs: songs})
})

app.get("/song:id", async (req, res)=>{
  const id = req.params.id;
  const song = await Song.findOne({"_id": id})
  const album = await Album.findOne({"album": song.album})
  const artist = await Artist.findOne({"artist": song.artist});
  // res.send(album)
  //res.send(artist)
  res.render("song", {song: song, album:album, artist: artist})
})

app.get("/admin/emails", async(req, res)=>{
  const emails = await Email.find();
  res.render("communication/emails", {emails: emails})
})

app.get("/admin/messages", async(req, res)=>{
  const messages = await Message.find();
  res.render("communication/messages", {messages: messages})
})

app.listen(process.env.PORT || 1000, function(){
    console.log("The server is running on port 1000");
})

app.get("/admin/email/delete:id", async (req, res)=>{
  const id = req.params.id
  await Email.deleteOne({"_id": id})
  const emails = await Email.find();
  res.render('communication/emails', {emails: emails})
})

app.get("/admin/message/delete:id", async (req, res)=>{
  const id = req.params.id
  await Message.deleteOne({"_id": id})
  const messages = await Message.find();
  res.render('communication/messages', {messages: messages})
})

app.post("/message", async (req, res)=>{
  const message = new Message(req.body);
  await message.save();
  hits = await Song.find({"hit":true});
  let recents = await Song.find({"coming_soon": false})
  recents = recents.slice(-10);
  comingSoon = await Song.find({"coming_soon": true});
  res.render('homepage', {hits: hits, recents: recents, comingSoon:comingSoon})
})

app.post("/newsletter", async (req, res)=>{
  const email = new Email(req.body);
  await email.save();
  hits = await Song.find({"hit":true});
  let recents = await Song.find({"coming_soon": false})
  recents = recents.slice(-10);
  comingSoon = await Song.find({"coming_soon": true});
  res.send(req.body)
})
