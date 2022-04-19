const login_info = require('../.maria_login.json')
const Conn = require('../models/Db_maria');

module.exports.conn =  new Conn(login_info);


