const router = require('express').Router();

// 연습용으로 URL route 2개를 만들었다.
router.get('/shop/shirts', (요청, 응답) => {
   응답.send('셔츠 파는 페이지입니다.');
});

router.get('/shop/pants', (요청, 응답) => {
   응답.send('바지 파는 페이지입니다.');
});



module.exports = router; // (내보낼 변수명)
// 이파일에서 router라는 변수를 배출할게요. 라는 뜻이다.