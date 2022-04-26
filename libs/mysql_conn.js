const login_info = require('../.mysql_login.json')
const Conn = require('../controllers/Db_mysql');

module.exports.conn =  new Conn(login_info);


