const express = require('express');
const app = express();

app.listen(8080, function() {    //  app.listen()은 원하는 포트에 서버를 오픈하는 문법이라고 보면 된다.
    console.log('listening on 8080')
})

// 위 코드를 잘 작성하고 New Terminal 눌러 터미널을 켜서 node server.js를 입력하면 서버가 뜬다.
// 브라우저에서 localhost:8080 이라고 접속하면 확인가능하다. 