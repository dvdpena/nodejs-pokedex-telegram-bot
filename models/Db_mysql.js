const mysql = require('mysql');


module.exports = class Conn{
    constructor(connection_object){
        this.connection_object = connection_object;
        this.pool = mysql.createPool(this.connection_object);
        this.total = -1;
        this.countPokemon();
    }

    async getPokemon(id){
    return new Promise((resolve, reject)=>{
        this.pool.query(`SELECT * FROM pokedex_entries WHERE id = ${this.pool.escape(id)}`, function (error, res, fields) {
            if (error) reject(error);
            resolve([res, fields]);
          }); 
    });
    }

    async countPokemon(){
        try {
            let res = await new Promise((resolve, reject)=>{
                this.pool.query(`SELECT COUNT(*) as total FROM pokedex_entries`,(error, res, fields)=>{
                    if (error) reject(error)
                    return resolve(res[0]);
                });
            });
            this.total = res.total
        } catch (error) {
            console.log(error);
        }
    }

    async findPokemonByName(stringa, lang){
        stringa += '%';
        return new Promise((resolve, reject)=>{
            this.pool.query(
                `SELECT id, ${lang} 
                FROM pokedex_entries 
                WHERE ${lang} LIKE "${stringa}" 
                ORDER BY id ASC`
            , (err, res, fields)=>{
                if (err) reject(err);
                resolve (res);
            });
        })
    }

    async findPokemonByType(tname){
        return new Promise((resolve, reject)=>{
            this.pool.query(
                `SELECT id, english 
                FROM pokedex_entries 
                WHERE primary_type = ${this.pool.escape(tname)} OR secondary_type = ${this.pool.escape(tname)}
                ORDER BY id ASC`
                , (err, res, fields)=>{
                if (err) reject(err);
                resolve (res);
            });
        });
    }

    async findDistinctTypes(){
        return new Promise((resolve, reject)=>{
            this.pool.query(
                `SELECT DISTINCT tname 
                FROM type_mul 
                ORDER BY tname ASC`
                ,(err, res, fields)=>{
                if (err) reject(err);
                resolve (res);
            });
        });
    }

    async getTypeMultiplier(id){
        return new Promise((resolve, reject)=>{
            this.pool.query(`SELECT * FROM adjusted_type_mulpipliers WHERE id = ${this.pool.escape(id)}`, (err, res, fields)=>{
                if (err) reject (err);
                resolve(res);
            });
        })
    }

    

    async setFileId(id, file_id){
        return new Promise((resolve, reject)=>{
            this.pool.query(`UPDATE pokemon SET image_file_id=${this.pool.escape(file_id)} WHERE id=${this.pool.escape(id)}`, function (error, res, fields) {
                if (error) reject(error);
                resolve([res, fields]);
                }
            );
        });
    }

    async closeConnection(){
        await this.pool.end();
        console.log("Closed connection")
    }
}
