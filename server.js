const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
const secretKey = 'mysecretkey';

app.use(express.json());

app.listen(3000, function(){
    console.log('listening on 3000')
});

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
  
    try {

      const hashedPassword = await bcrypt.hash(password, 10);
  
      res.json({ success: true, message: '회원가입이 완료되었습니다.' });
    } catch (error) {
      res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
  });
  
  app.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {

      const storedUsername = 'myusername';
      const storedHashedPassword = '$2b$10$AopU5W7Z0z.S1uO9ulQ4R.8zzZDEkukjYOJ5LoB7vPD./d3Ccz5bK';
  
      if (username === storedUsername) {
        const result = await bcrypt.compare(password, storedHashedPassword);
        if (!result) {
          res.status(401).json({ success: false, message: '로그인 실패!' });
          return;
        }
  
        // JWT 토큰 생성
        const token = jwt.sign({ username }, secretKey);
  
        res.json({ success: true, token });
      } else {
        res.status(401).json({ success: false, message: '로그인 실패!' });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
  });
  
  app.get('/profile', (req, res) => {
    const token = req.headers.authorization;
  
    if (!token) {
      res.status(401).json({ success: false, message: '인증되지 않았습니다.' });
      return;
    }
  
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      res.status(401).json({ success: false, message: '유효하지 않은 토큰입니다.' });
      return;
    }

    req.user = decoded;

    next();
  });
}

app.get('/profile' , verifyToken , (req, res) => {

  const username = req.user.username;

  res.json({ success: true, username });
}));

app.get('/public', (req, res) => {
  res.json({ success: true, message: '공개 엔드포인트입니다.' });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});