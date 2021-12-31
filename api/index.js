
const app = require("express")();
const axios = require("axios");
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/home.html");
});


app.get("/:id",async (req, res) => {
    const id =  await req.params.id;
    let title;
   await axios.get(`http://www.omdbapi.com/?apikey=ae0a43d7&t=${id}`).then(async (response) => {
    title = await response.data.Title;
   try{
    await axios.get(`https://yts.mx/api/v2/list_movies.json?query_term=${encodeURIComponent(title)}&quality=720p&sort_by=download_count`).then(async (response) => {
        let hash = response.data.data.movies[0].torrents[0].hash;
        let magnet = await`magnet:?xt=urn:btih:${hash}&dn=${encodeURIComponent(title)}+%5B720p%5D+&tr=udp://tracker.openbittorrent.com:80&tr=udp://open.demonii.com:1337&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://exodus.desync.com:6969`;
        res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
        title>Now Playing ${id}</title>
        </head>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">

  <style>
    body {
      font-family: 'Poppins', sans-serif;
      background: black;
      
    }
    marquee {
        color: white;
        font-size: 20px;
        font-family: 'Poppins', sans-serif;
        font-weight: 600;
        text-shadow: 2px 2px black;
        text-align: center;

    }
    </style>
        <body style="background: black !important;">
       
        <video class="video" controls src=${magnet} width="100% height = "100%" ></video>
<script src="https://cdn.jsdelivr.net/npm/@webtor/embed-sdk-js/dist/index.min.js" charset="utf-8" async></script>
<marquee> <h1>Now Playing ${id}</h1></marquee>
</body>
        </html>
        `)
        });
   }
    catch(err){
        res.send("Movie not found");
    }
        
    }).catch((error) => {
        res.json({ error: error });
    }
    );
});
module.exports = app;
