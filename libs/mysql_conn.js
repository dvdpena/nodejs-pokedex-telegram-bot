const login_info = require('../.mysql_login.json')
const Conn = require('../models/Db_mysql');

module.exports.conn =  new Conn(login_info);


