const router = require('express').Router();
// require('./파일경로') / require('라이브러리명')는
// 다른 파일이나, 라이브러리를 여기에 첨부하겠다.

const doLogin = (요청, 응답, next) => { // 미들웨어
  // 이함수는 "요청.user가 있으면 next()로 다음으로 통과시켜주고요, 없으면 에러메세지를 응답.send()해주세요" 라는 뜻이다.
    if(요청.user) {
       next(); 
    } else { 응답.send('로그인을 해주세요.'); }
};

router.use(doLogin);
// 이렇게 쓰면 이페이지에 있는 모든 라우터에 미들웨어를 적용할수있다.

router.use('/pants', doLogin);
// 이때는 특정경로(/shop/pants)로 요청(접속)할때만 미들웨어를 적용시켜준다.


// 연습용으로 URL route 2개를 만들었다.
router.get('/shirts', doLogin, (요청, 응답) => {
   응답.send('셔츠 파는 페이지입니다.');
});
// 개별 url라우터에 미들웨어 적용하고 싶으면 이렇게 써줘도 된다.

router.get('/pants', (요청, 응답) => {
   응답.send('바지 파는 페이지입니다.');
});



module.exports = router; // (내보낼 변수명)
// 이파일에서 router라는 변수를 배출할게요. 라는 뜻이다.
// 다른곳에서 shop.js를 가져다 쓸때 router라는 변수를 배출하겠다. 라는 뜻이다.