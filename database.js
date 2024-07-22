const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('users.db'); // 使用文件数据库而不是内存数据库

// 创建用户表，并设置用户名为唯一
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT)");
});

module.exports = db;
