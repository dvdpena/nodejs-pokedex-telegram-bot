const Message = require('../models/Outgoing_Message');
const string_const = require('./string_const');
const num_regex = /^\/num\s\d{1,}/gm
const num_auto_regex = /^\/num\d{1,}/gm
const name_regex = /^\/name\s/gm
const japan_regex = /^\/japan\s/gm
const french_regex = /^\/french\s/gm
const matchups_regex = /\/matchups\d{1,}/gm
const db =  process.env.DB == 'mysql'? require('../libs/mysql_conn').conn : require('../libs/maria_conn').conn
const pk_types = ['bug','dark','dragon','electric','fairy','fighting','fire','flying','ghost','grass','ground','ice','normal','poison','psychic','rock','steel','water']
const IMG_PATH = __dirname.split("/").reduce((total, item)=>{
    if(item !='bot_modules') return `${total}/${item}`
    else return total
})

async function entry(bot, i_message){
    if (i_message?.message?.text){
        if (i_message.message.text === "/start"){
            message = new Message(i_message.message.chat.id, string_const.start)
            return bot.sendMessage(message);
        }
        if (i_message.message.text.match(num_regex)){
            return num_command(bot, i_message);
        }
        if (i_message.message.text.match(num_auto_regex)){
            return num_command(bot, i_message, Number(i_message.message.text.slice(4)))
        }
        if (i_message.message.text.match(name_regex)){
            return search_command(bot, i_message,i_message.message.text.slice(6), 'english');
        }
        if (i_message.message.text.match(japan_regex)){
            return search_command(bot, i_message, i_message.message.text.slice(7), 'japanese');
        }
        if (i_message.message.text.match(french_regex)){
            return search_command(bot, i_message, i_message.message.text.slice(8), 'french');
        }

        if (i_message.message.text === '/random'){
            let rand = Math.floor((Math.random()*db.total) + 1);
            return num_command(bot, i_message, rand);
        }
        if (i_message.message.text === '/types'){
            return type_command(bot, i_message);
        }
        if (pk_types.includes(i_message.message.text.slice(1).toLowerCase())){
            return search_type_command(bot, i_message, i_message.message.text.slice(1));
        }
        if (i_message.message.text.match(matchups_regex)){
            return  type_matchups_view(bot, i_message, i_message.message.text.slice(9))
        }
        message = new Message(i_message.message.chat.id, string_const.invalid_command)
        bot.sendMessage(message);
    }
    else {
        o_message = new Message(i_message.message.chat.id, string_const.unssuported_message)
        bot.sendMessage(o_message);
    }
    
}

async function num_command (bot, i_message, num = Number(i_message.message.text.slice(5))){
    let [thisPokemon, fields] = await db.getPokemon(num).catch(err=>console.log(err));
    if (thisPokemon.id){
        let caption = make_pokedex_view(thisPokemon)
        bot.sendPhoto(i_message.message.chat.id, `${IMG_PATH}/images/${String(num).padStart(3, "0")}.png`, caption, thisPokemon.image_file_id, thisPokemon.id)
    } else {
        o_message = new Message(i_message.message.chat.id, text.out_of_bounds)
        bot.sendMessage(o_message);
    }
}

async function search_command (bot, i_message, stringa, lang){
    let res = await db.findPokemonByName(stringa, lang);
    message = new Message(i_message.message.chat.id, string_const.no_pokemon_found + stringa);
    if (res.length > 0){
        let text = `${res.length} results found.\n`;
        for (i in res){
            text += `/num${res[i]['id']} *${res[i][lang]}*\n`
        }
        message.text = text;
    }
    return bot.sendMessage(message);     
}

function make_pokedex_view(pokemon){
    let text = ""
    text += `*#${pokemon.id} ${pokemon.english}* ${pokemon.japanese}\n`
    text += `${pokemon.primary_type}`
    text += pokemon.secondary_type? `, ${pokemon.secondary_type}\n`:'\n'
    text += `HP:_${pokemon.hp}_  Attack:_${pokemon.attack}_\n`
    text += `Defense:_${pokemon.defense}_  Sp. Att.:_${pokemon.special_attack}_\n`
    text += `Sp. Def.:_${pokemon.special_defense}_  Speed:_${pokemon.speed}_\n`
    text += `/matchups${pokemon.id}` 
    return text
}

async function search_type_command(bot, i_message, pk_type){
    message = new Message(i_message.message.chat.id, string_const.no_pokemon_found + pk_type);
    try {
        let res = await db.findPokemonByType(pk_type);
        if (res.length > 0){
            let text = `${res.length} results found.\n`;
            for (i in res){
                if (res[i].id){
                    text += `/num${res[i]['id']} *${res[i]['english']}*\n`
                }
                
            }
            message.text = text;
        }
    } catch (error) {
        console.log(error)
    }
    return bot.sendMessage(message); 
}

async function type_command(bot, i_message){
    let message = new Message(i_message.message.chat.id, string_const.unexpected_error);
    try {
        let res = await db.findDistinctTypes();
        if (res.length > 0){
            let text = ""
            for (i in res){
                text += `/${res[i].tname}\n`
            }
            message.text = text;
        }
    } catch (error) {
        console.log(error);   
    }
    bot.sendMessage(message);
}

async function type_matchups_view(bot,i_message, pk_id){
    let message = new Message(i_message.message.chat.id, string_const.out_of_bounds);try {
        let res = await db.getTypeMultiplier(pk_id);
        let text, d_super_eff, super_eff, resists, immune
        if (res.length === 1){
            let {english, id, primary_type, secondary_type, ...multipliers} = res[0];
            for (let [key, val] of Object.entries(res[0])){
                if (val != 1){
                    if (val == 4) d_super_eff? d_super_eff += `, ${key}` : d_super_eff = `*2x Super Effective*: ${key}`
                    if (val == 2) super_eff? super_eff += `, ${key}` : super_eff = `*Super Effective*: ${key}`
                    if (val == 0.5) resists? resists += `, ${key}` : resists = `*Resists*: ${key}`
                    if (val == 0) immune? immune += `, ${key}` : immune = `*Immune*: ${key}`
                }
                continue
            }
            text = '*Type matchups*\n';
            text += `/num${id} *${english}*\n`;
            text += `_${primary_type}_`;
            text += secondary_type? `, _${secondary_type}_\n`:'\n';
            text += d_super_eff? `${d_super_eff}\n`:"";
            text += super_eff? `${super_eff}\n`:"";
            text += resists? `${resists}\n`:"";
            text += immune? `${immune}\n`:"";
            message.text = text;
        }
    } catch (error) {
        console.log(error);
    }
    return bot.sendMessage(message);
}

module.exports = {
    entry : entry
}