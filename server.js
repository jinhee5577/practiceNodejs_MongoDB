const express = require('express');
const app = express();
app.use(express.urlencoded({extended: true}));
require('dotenv').config();
app.set('view engine', 'ejs');
const MongoClient = require('mongodb').MongoClient;

let db;
MongoClient.connect(process.env.DB_URL, { useUnifiedTopology: true }, (에러, client) => { 
    if (에러) return console.log(에러);
    
    db = client.db('todoapp');  // todoapp이라는 database 연결좀요.
    // database접속이 완료되면 콜백함수를 실행해준다. 
    app.listen(process.env.PORT, function() {    //  app.listen()은 원하는 포트에 서버를 오픈하는 문법이라고 보면 된다.
        console.log('listening on 8080');
    });
    // 여기까지가 서버를 띄우기 위해 작성할 기본 셋팅.
});


// 위 코드를 잘 작성하고 New Terminal 눌러 터미널을 켜서 node server.js를 입력하면 서버가 뜬다.
// 브라우저에서 localhost:8080 이라고 접속하면 확인가능하다. 



// 서버는 요청을 처리하는 기계라고 말했다.
// 브라우저를 켜서 주소창에 URL을 입력하시면 된다. 그게 가장쉬운 요청 방법이다.
// 전문용어로 GET 요청이라고 한다.

app.get('/pet', (요청, 응답) => { 
    응답.send('펫용품 입니다.');
});

app.get('/beauty', (요청, 응답) => { 
    응답.send('뷰티용품 입니다.');
});
// 그럼 누군가 우리 서버의 /pet 경로로 접속하면 '펫용품 입니다.' 라는 안내메세지를 띄워주는 서버가 만들어진다.  
// 브라우저 켜서 localhost:8080/pet 이라고 접속하면 펫용품 입니다.라는 안내문이 뜬다.
// (터미널에서 ctrl + c 누르시고 서버를 끈 다음 node server.js 입력해서 서버를 재시작 해야한다.)



// 껐다 키기 귀찮으니 nodemon 설치를 해보자 
// 터미널에서 npm install -g nodemon 입력하면 됩니다.
// 이제 서버를 실행할때 nodemon server.js 라고 입력해주면 된다.
// 그럼 파일 저장할때 마다 이제 지가 알아서 서버를 새로 시작해준다. 


app.get('/', (요청, 응답) => {
    응답.sendFile(__dirname + '/index.html');
});
// 그럼 누군가 / 경로로 접속시 (/ 하나만 있으면 홈페이지 이다)
// server.js랑 같은 경로에 있는 /index.html 이라는 파일을 보내준다. 
// sendFile() 함수를 쓰면 파일을 보낼수 있다.
// __dirname은 현재 파일의 경로를 뜻한다.

app.get('/write', (요청, 응답) => { 
    응답.sendFile(__dirname + '/write.html');
});



// 2021년 이후로 설치한 프로젝트들은 body-parser 라이브러리가 express에 기본 포함이라 
// 따로 npm으로 설치할 필요가없다. 
// app.use(express.urlencoded({extended: true}));  <-- 이 코드만 위쪽에 추가해주면 된다. 

app.post('/add', (요청, 응답) => {
    console.log(요청.body);  // { todo: 'any', date: '2.13' } 이렇게 나온다.
    const data = 요청.body;
    db.collection('post').insertOne(data, (에러, 결과) => { 
        console.log('저장완료.');
        응답.send('전송완료.');   
    });
});
// 누군가가 /add 경로로 post 요청을 할때 터미널 콘솔창에 요청.body를 출력해볼 수있다. 
// 요청.body는 폼에 입력한 제목과 날짜 데이터가 들어가있을 것이다. 




// server.js에서 DB접속하려면 
// 1.터미널 켜서 npm install mongodb@3.6.4 를 입력해서 라이브러리를 설치한다.
// MongoDB 접속을 쉽게 도와주는 라이브러리 이다.

// 2.server.js 상단에 다음 const MongoClient = require('mongodb').MongoClient; 코드를 추가한다.

// 3.그다음 하단에 다음 코드를 입력해준다. 
//  MongoClient.connect('챙겨온 접속URL', function(에러, client){
//     if (에러) return console.log(에러);
       //서버띄우는 코드 여기로 옮기기
//     app.listen('8080', function(){
//        console.log('listening on 8080');
//     });
//  });
// 접속 URL은 대충 이렇게 생겼는데
// mongodb+srv://디비계정아이디:디비계정패스워드@cluster0-qaxa3.mongodb.net/데이터베이스이름?retryWrites=true&w=majority
// 저부분 3개를 내가 만든걸로 잘채워 입력해야한다.

// 그리고 app.listen이라고 서버 띄우는 코드를 여기 안으로 옮겨주면 된다.
// 터미널에서 nodemon server.js로 서버를 실행해보면 listening on 8080이 잘뜨면 성공이다.



// db.collection('post').insertOne({name : 'jinhee', age : 15}, (에러, 결과) => { 
//    db.collection('post') 라는건 collection 중에 post 라는걸 선택한다는 뜻이고
//    insertOne()을 붙이면 자료를 추가할 수있다. (Object 자료형식으로 추가가능)
//    insertOne() 함수는 insertOne(추가할 자료, 콜백함수) 이렇게 쓰면된다.    
//    console.log('저장완료.')   
// });



// EJS 설치하자.
// EJS는 서버 데이터를 HTML에 쉽게쉽게 넣을수있게 도와주는 일종의 HTML렌더링 엔진이다. 
// 터미널에서 npm install ejs 하고, Server.js 상단에 app.set('view engine', 'ejs'); 적어주면 된다.


app.get('/list', (요청, 응답) => { 
    응답.render('list.ejs');    
});

// EJS 파일 만들때 주의할점 : 작업폴더 내에 views라는 폴더를 하나 만든후
// 거기에 list.ejs 파일을 만들어야 한다.  