const router = require('express').Router();
// require('./파일경로') / require('라이브러리명')는
// 다른 파일이나, 라이브러리를 여기에 첨부하겠다.

// 연습용으로 URL route 2개를 만들었다.
router.get('/shirts', (요청, 응답) => {
   응답.send('셔츠 파는 페이지입니다.');
});

router.get('/pants', (요청, 응답) => {
   응답.send('바지 파는 페이지입니다.');
});



module.exports = router; // (내보낼 변수명)
// 이파일에서 router라는 변수를 배출할게요. 라는 뜻이다.
// 다른곳에서 shop.js를 가져다 쓸때 router라는 변수를 배출하겠다. 라는 뜻이다.