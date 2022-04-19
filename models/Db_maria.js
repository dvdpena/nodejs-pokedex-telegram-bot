const mariadb = require('mariadb');


module.exports = class Conn{
    constructor(connection_object){
        this.connection_object = connection_object;
        this.pool = mariadb.createPool(this.connection_object);
        this.total = -1;
        this.countPokemon();
    }

    async getPokemon(id){
    return new Promise(async (resolve, reject)=>{
        const conn = await this.pool.getConnection();
        try {
            const rows = await conn.query(
                `SELECT * 
                FROM pokedex_entries 
                WHERE id = ?`
                , [id]);
            resolve(rows);
        } catch (error) {
            reject(error)
        }
        
    });
    }

    async countPokemon(){
        const conn = await this.pool.getConnection();
        try {
            let res = await new Promise(async (resolve, reject)=>{
                try {
                    let [count, meta] = await conn.query(
                        `SELECT COUNT(*) as total
                        FROM pokedex_entries`);
                    resolve(count)
                } catch (error) {
                    reject(error);
                }
            });
            this.total = Number(res.total)
        } catch (error) {
            console.log(error);
        }
    }

    async findPokemonByName(stringa, lang){
        stringa += '%';
        return new Promise(async (resolve, reject)=>{
            const conn = await this.pool.getConnection();
            try {
                let rows = await conn.query(
                    `SELECT id, ${lang} 
                    FROM pokedex_entries 
                    WHERE ${lang} LIKE "${stringa}" 
                    ORDER BY id ASC`);
                delete rows.meta;
                resolve(rows)
            } catch (error) {
                reject(error);
            }
        })
    }

    async findPokemonByType(tname){
        return new Promise(async (resolve, reject)=>{
            const conn = await this.pool.getConnection();
            try {
                let rows = conn.query(
                    `SELECT id, english 
                    FROM pokedex_entries 
                    WHERE primary_type = ? OR secondary_type = ? 
                    ORDER BY id ASC`, [tname, tname]);
                delete rows.meta;
                resolve(rows);
            } catch (error) {
                reject(error);
            }
        });
    }

    async findDistinctTypes(){
        return new Promise(async (resolve, reject)=>{
            const conn = await this.pool.getConnection();
            try {
                let rows = await conn.query(
                    `SELECT DISTINCT tname 
                    FROM type_mul 
                    ORDER BY tname ASC`);
                delete rows.meta;
                resolve(rows);
            } catch (error) {
                reject(error)
            }
        });
    }

    async getTypeMultiplier(id){
        return new Promise(async (resolve, reject)=>{
            const conn = await this.pool.getConnection();
            try {
                let rows = await conn.query(`SELECT * FROM adjusted_type_mulpipliers WHERE id = ?`, [id]);
                resolve(rows);
            } catch (error) {
                reject(error);
            }
        })
    }

    

    async setFileId(id, file_id){
        return new Promise(async (resolve, reject)=>{
            const conn = await this.pool.getConnection();
            try {
                await conn.query(`UPDATE pokemon SET image_file_id= ? WHERE id= ?`,[file_id, id]);
            } catch (error) {
                reject(error);
            }
        });
    }

    async closeConnection(){
        await this.pool.end();
        console.log("Closed connection")
    }
}
