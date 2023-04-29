const express = require('express');
const app = express();
app.use(express.urlencoded({extended: true}));
app.use('/public', express.static('public'));  // static파일을 보관하기위해 public폴더를 쓸거다. 라는 미들웨어
require('dotenv').config();
app.set('view engine', 'ejs');
const MongoClient = require('mongodb').MongoClient;
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

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
    // 응답.sendFile(__dirname + '/index.html');
    응답.render('index.ejs');
});
// 그럼 누군가 / 경로로 접속시 (/ 하나만 있으면 홈페이지 이다)
// server.js랑 같은 경로에 있는 /index.html 이라는 파일을 보내준다. 
// sendFile() 함수를 쓰면 파일을 보낼수 있다.
// __dirname은 현재 파일의 경로를 뜻한다.

app.get('/write', (요청, 응답) => { 
    // 응답.sendFile(__dirname + '/write.html');
    응답.render('write.ejs');
});



// 2021년 이후로 설치한 프로젝트들은 body-parser 라이브러리가 express에 기본 포함이라 
// 따로 npm으로 설치할 필요가없다. 
// app.use(express.urlencoded({extended: true}));  <-- 이 코드만 위쪽에 추가해주면 된다. 

app.post('/add', (요청, 응답) => {
    console.log(요청.body);  // { todo: 'any', date: '2.13' } 이렇게 나온다.

    db.collection('index').findOne({name : '게시물갯수'}, (에러, 결과) => { 
       console.log(결과.totalIndex);
       const totalInd = 결과.totalIndex;  
       
       const data = {_id : totalInd + 1, ...요청.body}; 
       db.collection('post').insertOne(data, (에러, 결과) => { 
          console.log('저장완료.');
          응답.send('전송완료.');   
          db.collection('index').updateOne({name : '게시물갯수'}, {$inc : {totalIndex : 1}}, (에러, 결과) => { 
             // {$inc : { totalPost : 1 }} 기존값에 1만큼 더해준다. 
             if(에러){return console.log(에러);}
          });
       });
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
    db.collection('post').find().toArray((에러, 결과) => {
       console.log(결과);  // collection('post')에 있는 모든데이터를 Array자료형으로 가져온다. 
       응답.render('list.ejs', {posts : 결과});  // 결과 데이터를 posts라는 이름으로 ejs파일에 보내준다.    
    });
});

// EJS 파일 만들때 주의할점 : 작업폴더 내에 views라는 폴더를 하나 만든후
// 거기에 list.ejs 파일을 만들어야 한다.  



// _id를 달아서 저장하자.
// 다른DB에선 _id를 자동으로 1증가시켜서 추가해주는 이런기능이 있는데 (Auto Increment라고 한다)
// MongoDB는 그런거 없다. (실은 별로 필요없어서 그렇다. 정수말고 자동으로 부여되는 ObjectId도 전혀 문제없음) 
// 그래서 직접 지금까지 몇번 게시물을 발행했는지를 따로 기록해 두어야한다.

// collection을 하나 더 만들자.
// index컬렉션 에서 totalPost라는 곳에 지금까지 몇번게시물을 발행했는지를 저장할 것이다.  



// DB데이터를 수정하고 싶으면 updateOne을 쓰면 된다. 
// db.collection('counter').updateOne({요런 이름의 자료를} , {이렇게 수정해주세요} , (에러, 결과) => {
//    updateOne함수엔 파라미터가 세개가 필요하다. 
//    왼쪽엔 {name : '게시물갯수'} 이렇게 자료를 찾을 수있는 쿼리문을 적어주면 된다.  
//    가운데는 수정할 값을 입력해주면 된다.
//    {$set : {totalPost : 100}} 이렇게 넣어서 값을 아예 100으로 변경할 수도있고
//    {$inc : {totalPost : 5}} 이렇게 넣어서 기존값에 5만큼 더해줄 수도있다. 
//    $표시 붙은게 operator 라는 문법이다. 여러 종류가 있으니 나머지는 필요할 때 찾아쓰도록 하자. 
//    마지막은 그냥 콜백함수 이다. 수정이 실패나 성공시 실행할 코드를 안에 담으면 된다.
    
//    console.log('수정완료');
// });



app.delete('/delete', (요청, 응답) => { 
    //  /delete경로로 DELETE요청을 하면 ~~해주세요. 라는 코드다.
    console.log(요청.body);  // 요청할때 함께보낸 data가 요청.body에 들어있다. ex) {_id : '2'}
    요청.body._id = parseInt(요청.body._id);

    db.collection('post').deleteOne(요청.body, (에러, 결과) => {
       // deleteOne 함수를 쓰면 원하는 데이터를 삭제 가능하다.
       // deleteOne(삭제원하는 데이터이름, () => {}) 이렇게 쓰면된다. 
       console.log('삭제완료.'); 
       응답.status(200).send({message : '성공했습니다.'});  
       // 응답코드를 이용해 요청이 성공했는지, 실패했는지 판정해줄 수있다.
    });
});



// 서버가 요청에 응답할 수 있는 여러가지 방법 

// ex) app.get('/어쩌구', function(요청, 응답){
//       응답.send('<p>some html</p>')  : send는 간단한 문자나 HTML을 보낼 수있다. 
//       응답.status(404).send('Sorry, we cannot find that!')  : status는 응답코드를 보낼 수있다. 
//       응답.sendFile('/uploads/logo.png')  : sendFile은 static파일들을 보낼 수있다. 
//       응답.render('list.ejs', { ejs에 보낼 데이터 })  : render는 ejs등의 템플릿이 적용된 페이지들을 렌더링해줄 수있다. 
//       응답.json(제이슨데이터)  : json은 제이슨 데이터를 담아보낼 수있다. 
//     });



app.get('/detail/:id', (요청, 응답) => { 
 // URL에 콜론(:)기호를 붙여주면 누군가 /detail/뒤에 아무 숫자나 문자열을 입력하면~ 이라는 뜻이다.     
    db.collection('post').findOne({_id : parseInt(요청.params.id)}, (에러, 결과) => { 
       // 요청.params.id 는 url파라미터 중에 :id라는 뜻이다. 
       응답.render('detail.ejs', {result : 결과});

    });
});




// CSS파일은 보통 관습적으로 public폴더에 보관한다.
// CSS, 이미지 처럼 자주 바뀌지 않는 static파일들을 다 public에 넣어주면 된다.
// (public폴더는 views폴더 옆에 나란하게 만들자.)

// HTML이나 EJS파일에 가서 <link>로 CSS첨부해주고,
// 하지만 그냥 넣으면 동작하지 않는다. Node.js에게 "나는 public폴더도 있다"라고 알려주어야한다. 
// 상단에 app.use('/public', express.static('public')); 이걸 추가해준다.
// "/public 위치에 있는 폴더를 쓰겠다"라는 뜻이다. 




app.get('/edit/:id', (요청, 응답) => { 
    db.collection('post').findOne({_id : parseInt(요청.params.id)}, (에러, 결과) => { 
       console.log(결과); 
       응답.render('edit.ejs', {data : 결과});
    });
});



// form태그 내에선 POST, GET이 두가지 방식만 지원한다.
// 해결책은.. DELETE 강의 처럼 AJAX를 쓰던가.. 아니면
// PUT을 기어코 form에 쓰려면 method-override라는 라이브러리를 설치하면 된다.
// method-override는 form에서 PUT, DELETE요청을 쓸수있도록 도와주는 라이브러리다.  

// 1. 터미널에 npm install method-override 를 입력해서 설치하면 된다.
// 2. 설치를 완료하기 위해 server.js 상단에 다음 코드를 추가한다.
// const methodOverride = require('method-override');
// app.use(methodOverride('_method')); 
// 3. 이제 form태그에 PUT요청을 사용할 수있다. 
// <form action="/add?_method=PUT" method="POST"> 이렇게 수정해주면
// 폼 전송시 /add 경로로 PUT요청을 해준다.



app.put('/edit', (요청, 응답) => {
   let obj = { // 수정 data.
       todo: 요청.body.todo,
       date: 요청.body.date
   };
   console.log(요청.body);
   db.collection('post').updateOne({_id: 요청.body.id}, {$set: obj}, (에러, 결과) => { 
      응답.redirect('/list');
   });
});