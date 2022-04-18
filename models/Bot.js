const mainAxios = require('axios');

module.exports = class Bot {
    constructor(token, url){
        this.token  = token;
        this.url    = url
        this.axios = mainAxios.create({
            baseURL: `https://api.telegram.org/bot${this.token}`,
            timeout: 15000,
        });
    }

    async setWebhook(){
        try {
            let res = await this.axios.post('/setWebhook',  {'url': this.url})
            console.log(`Telegram responded on /setWebhook with: Ok:${res.data.ok}, message: ${res.data.description}`);
        } catch (error) {
            console.error(error); 
        }
    }

    async sendMessage(o_message){
        try {
            let res = await this.axios.post('/sendMessage',  o_message)
            if (!res.data.ok) throw {'type':"API error", "route":"sendMessages"}
        } catch (error) {
            console.error(error); 
        }
    }

}

