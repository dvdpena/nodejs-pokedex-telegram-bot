const pokedex = require("./pokedex.json")
const pktypes   = require("./type_multipliers.json")
const mysql = require('mysql');
const fs = require("fs")

const con = mysql.createConnection({
    host: "localhost",
    user: "pexd",
    password: "cadbury"
  });
  
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    try {
        add_names()
        base_stats()
        type_mul ()
        add_pokemon()
    } catch (error) {
        console.log(error)
    }
});

function add_names(){
    const logger = fs.createWriteStream('extras/dbscripts/add_names.sql', {flags: 'w'})
    logger.write("USE pokedex;\n");
    for (let id in pokedex){
        logger.write(`INSERT INTO names(english, japanese, chinese, french) values("${pokedex[id].name.english}", "${pokedex[id].name.japanese}", "${pokedex[id].name.chinese}", "${pokedex[id].name.french}");\n`)
    }
    logger.end()
    logger.on("finish", ()=>{console.log("Ended");/* process.exit() */})
}

function base_stats(){
    const logger = fs.createWriteStream('extras/dbscripts/add_base_stats.sql', {flags: 'w'})
    logger.write("USE pokedex;\n");
    for (let id in pokedex){
        logger.write(`INSERT INTO base_stats(hp, attack, defense, special_attack, special_defense, speed) values(${pokedex[id].base.HP}, ${pokedex[id].base.Attack}, ${pokedex[id].base.Defense}, ${pokedex[id].base["Sp. Attack"]}, ${pokedex[id].base["Sp. Defense"]}, ${pokedex[id].base.Speed});\n`)
    }
    logger.end()
    logger.on("finish", ()=>{console.log("Ended");/* process.exit() */})
}

function type_mul (){
    const logger = fs.createWriteStream('extras/dbscripts/add_type_mul.sql', {flags: 'w'})
    logger.write("USE pokedex;\n");
    for (let id in pktypes){
        let keys = Object.keys(pktypes[id])
        let list_keys = "tname"
        let list_values = `"${pktypes[id].type}"`
        for (let key in keys){
            if (keys[key] != "type"){
                list_keys += `, ${keys[key]}`
                list_values += `, ${pktypes[id][keys[key]]}`
            }      
        }
        logger.write(`INSERT INTO type_mul(${list_keys}) values(${list_values});\n`)
    }
    logger.end()
    logger.on("finish", ()=>{console.log("Ended");/* process.exit() */})
}

function add_pokemon(){
    const logger = fs.createWriteStream('extras/dbscripts/add_pokemon.sql', {flags: 'w'})
    logger.write("USE pokedex;\n");
    pokedex;
    for (let num in pokedex){
        let this_types = pokedex[num].type
        let idx = pktypes.findIndex((item)=>{
            return item.type == this_types[0]
        });
        if (this_types.length >1){
            let idx2 = pktypes.findIndex((item)=>{
                return item.type == this_types[1]
            })
            logger.write(`INSERT INTO pokemon (primary_type_id, secondary_type_id, base_stats_id, name_id) values (${idx + 1}, ${idx2 + 1}, ${pokedex[num].id}, ${pokedex[num].id});\n`);
        } else {
            logger.write(`INSERT INTO pokemon (primary_type_id, base_stats_id, name_id) values (${idx + 1}, ${pokedex[num].id}, ${pokedex[num].id});\n`);
        }
    }
    logger.end()
    logger.on("finish", ()=>{console.log("Ended");/* process.exit() */})
}

