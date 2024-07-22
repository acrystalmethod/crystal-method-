const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const db = require('./database');
const app = express();
const PORT = process.env.PORT || 3000;

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

// 解析 JSON 请求体
app.use(bodyParser.json());

// 登录处理
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    if (row) {
      res.json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Login failed' });
    }
  });
});

// 注册处理
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], function(err) {
    if (err) {
      if (err.code === 'SQLITE_CONSTRAINT') {
        return res.status(400).json({ message: 'Username already exists' });
      } else {
        return res.status(500).json({ message: 'Registration failed' });
      }
    }
    res.json({ message: 'Registration successful' });
  });
});

// 重定向根路径到 login.html
app.get('/', (req, res) => {
  res.redirect('/login.html');
});

// 处理其他路径
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', req.path));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
