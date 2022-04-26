require('dotenv').config();
console.log(`Current DB provider: ${process.env.DB}`);
console.log(`Current Telegram base url: ${process.env.ENDPOINT}`);

const express = require('express');
let app = express();
app.use(express.json());
const http = require('http'); //http
const controllers = require("./controllers");
const models = require('./models');
const bot_modules = require("./bot_modules");

const bot = new controllers.Bot(process.env.POKEDEX_BOT_TOKEN, `${process.env.ENDPOINT}telegram/pokedex`)
bot.setWebhook()

const httpsServer = http.createServer(app);
httpsServer.listen(process.env.BOT_PORT, function(){
    console.log(`Listening on port ${process.env.BOT_PORT}`);
})

app.post('/telegram/pokedex', function (req, res) {
    bot_modules.main.entry(bot, req.body);
    res.send('Ok');
});