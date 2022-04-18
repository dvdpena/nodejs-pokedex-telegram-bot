require('dotenv').config();
console.log(`Current DB arch: ${process.env.DB}`);
console.log(`Current endpoint: ${process.env.NGROK_ENDPOINT}`);

const express = require('express');
let app = express();
app.use(express.json());
const https = require('http'); //http
const models = require("./models");

const bot = new models.Bot(process.env.POKEDEX_BOT_TOKEN, `${process.env.NGROK_ENDPOINT}telegram/pokedex`)
bot.setWebhook()

const httpsServer = https.createServer(app);
httpsServer.listen(process.env.PORT, function(){
    console.log(`Escuchando en el puerto ${process.env.PORT}`);
})

app.post('/telegram/pokedex', function (req, res) {
    let o_message = new models.Outgoing_Message(1250357, "res.body.message.text");
    bot.sendMessage(o_message);
    res.send('Ok');
});