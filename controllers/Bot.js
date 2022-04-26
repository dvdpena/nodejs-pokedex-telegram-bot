const mainAxios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const db = process.env.DB === 'mysql'? require('../libs/mysql_conn').conn : require('../libs/maria_conn').conn

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

    async sendPhoto(chat_id, filePath, caption, file_id, num) {
        try {
            if (file_id){
                const res = await this.axios.post('/sendPhoto', {
                    'chat_id' : chat_id,
                    'caption' : caption,
                    'photo'   : file_id,
                    'parse_mode' : 'Markdown'
                })
            } else {
                const formData = new FormData();
                formData.append('chat_id', chat_id);
                formData.append('caption', caption)
                formData.append('parse_mode', "Markdown")
                formData.append('photo', fs.createReadStream(filePath));
                const res = await this.axios.post('/sendPhoto', formData, {
                headers: formData.getHeaders(), timeout : 25000
                });
                if (res){
                    db.setFileId(num, res.data.result.photo[2].file_id).catch(err=>console.error(err))
                }
            }
        } catch (error) {
            console.log(error);
        }    
    }
}

