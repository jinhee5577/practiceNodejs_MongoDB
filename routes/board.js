// 연습으로 분리.
const router = require('express').Router();
// express라이브러리가 제공하는 Router()기능을 가져다 쓰고 있는 것이다.
// 라우트들을 관리할 수있게 도와주는 일종의 함수이며
// 이 함수의 도움을 받으면 이전에 app.get()하던 형식 똑같이 그대로 shop.js파일에도 작성 가능하다. 
// 방금 만든것 처럼 URL route들을 이리저리 안내해주는 파일을 라우터라고 칭하며

router.get('/sports', (요청, 응답) => {
   응답.send('스포츠 게시판');
});

router.get('/game', (요청, 응답) => {
   응답.send('게임 게시판');
});


module.exports = router;
// 그리고 파일 최하단에서 작성한 라우터를 module.exports라는 문법을 이용해 배출해준다.
// 이제 이 라우터를 server.js에 적용하는 일만 남았다.
