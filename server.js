const express = require('express');
const app = express();
app.use(express.urlencoded({extended: true}));
app.use('/public', express.static('public'));  // static파일을 보관하기위해 public폴더를 쓸거다. 라는 미들웨어
require('dotenv').config();
app.set('view engine', 'ejs');
const MongoClient = require('mongodb').MongoClient;
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
// 로그인, 로그인검증, 세션생성을 도와주는 라이브러리 들이다.
// (실제 서비스시 express-session말고 MongoDB에 세션데이터를 저장해주는 라이브러리를 이용하면 좋다.)
app.use(session({secret : '비밀코드', resave : true, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session()); 


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
   
   db.collection('post').updateOne({_id: parseInt(요청.body.id)}, {$set: obj}, (에러, 결과) => { 
      응답.redirect('/list');
      // 성공이든 실패든 응답을 꼭 해주어야한다. 왜냐면 응답을 안해주면 브라우저가 멈출수 있다.
   });
});

// 사용법은 updateOne( 1.업데이트할게시물찾기, 2.수정할내용, 3.콜백함수) 라고한다. 
// 1. 업데이트할 게시물을 찾으려면 기존 게시물의 _id 같은걸 작성해주면 된다. 
// 2. 그게시물을 업데이트 하려면 $set 이런 operator를 사용하면 된다.
// 그러면 기존값을 수정/(없으면) 추가 해준다.
// 3. 콜백함수는 업데이트 완료시 실행할 코드를 적으면 된다.  

// 따라서 "사용자가 /edit으로 PUT요청을 하면"
// "post라는 콜렉션에 있는 {_id : 요청.body.id } 데이터를 찾아서
// {제목: 요청.body.title, 날짜: 요청.body.date}로 바꿔주세요" 입니다.



// app.use(미들웨어) 어쩌구 부분은 '미들웨어를 쓰겠다'라는 뜻이다.
// 미들웨어가 뭐냐면.. 서버는 요청을 받으면 응답을 해주는 기계랬죠?
// 그런데 요청과 응답 사이에 뭔가 실행시키는 코드들이 바로 미들웨어이다.
// 요청이 적법한지 검사하는 그런 기능들을 미들웨어에 많이 담는다.
// app.use안에 담는 코드들은 전부 미들웨어 역할을 할수있다.
// 위에있는 코드중에 passport.initialize() 그리고 passport.session() 이런 코드들이
// 모든 요청과 응답 중간에 실행된다는 뜻이다.
// 나중에 미들웨어를 직접 하나 만들고 싶다면 그것도 가능하다.
// 그냥 app.use() 안에 집어넣어주면 된다. 



app.get('/login', (요청, 응답) => { 
    응답.render('login.ejs');
});

// 어떤 흐름으로 개발할 것이냐면..
// 어떤사람이 로그인을 하면 일단 그사람의 id와 pw가 DB에있는 아이디와 비번이 맞는지 검사해야한다.
// 그리고 검사 결과가 맞으면 세션을 하나 생성해주고 성공페이지로 이동시키기,
// 실패하면 실패페이지로 이동시킵니다. 


// 로그인시 그냥 홈으로 이동시키기만 하면 되는게 아니라 중간에 검사를 해야한다.
// 아이디랑 비번이 맞나요? 이렇게 물어보면 된다.
app.post('/tologin', passport.authenticate('local', {failureRedirect : '/fail'}), (요청, 응답) => {
    // post()함수 둘째 파라미터로 미들웨어를 추가해주면 요청과 응답 사이에 특정기능을 실행할수있다.
    // passport 라이브러리가 제공하는 '아이디, 비번 인증도와주는 코드'이다.
    // 응답해주기 전에 local방식으로 아이디,비번을 인증해주세요. 라는 뜻으로 해석하면 된다.
    // (failureRedirect라는 부분은 로그인 인증 실패시 이동시켜줄 경로를 적으면 된다. 위의 코드는 실패시 /fail경로로 유저를 이동시켜준다.)
    응답.redirect('/'); // 로그인 인증 성공하면 홈으로 보내주세요.
});

app.get('/fail', (요청, 응답) => {
    // 로그인 인증 실패시 /fail로 이동하면 원하는 페이지 보여줘라.
});

// 로그인을 시키려면. 아이디/비번을 DB와 검사하고 그게 맞으면 세션을 하나 만들어주면 되겠군요.

// 그냥 저렇게만 냅두면 자동으로 인증해주진 않는다.
// 어떻게 인증할건지 세부코드를 잘 정의해줘야한다.
passport.use(new LocalStrategy({
  usernameField: 'id', // 사용자가 제출한 아이디가 어떤<input>의 name속성값을 적어주면 된다.
  passwordField: 'pw', // 마찬가지다.
  session: true, // 세션을 하나 만들어줄건지 이다. 만들어줘야 나중에 다시 로그인 안해도 되겠죠?
  passReqToCallback: false, // 사용자의 아이디/비번 말고도 다른정보를 검사해야할 경우 true로 바꿔주면 된다.
}, function (입력한아이디, 입력한비번, done) {
   // true로 바꾸면 콜백함수의 첫째 파라미터로 기타정보들이 들어가는데 파라미터.body 이런식으로 출력해보면 알수있다.
   // 아직은 쓸일이 없기 때문에 쓸일 있으면 그때 구글에 사용법을 찾아서 쓰도록 하자.
  //console.log(입력한아이디, 입력한비번);
  db.collection('login').findOne({ id: 입력한아이디 }, function (에러, 결과) {
    if (에러) return done(에러)

    if (!결과) return done(null, false, { message: '존재하지않는 아이디요' });
    if (입력한비번 == 결과.pw) {
      return done(null, 결과);
      // done(서버에러, 다맞으면 어디로 보내줄 사용자DB데이터, 에러메시지);
      // 1)서버에러는 if(에러)문으로 많이처리해서 별로 안중요함.
      // 2)둘째 파라미터는 id/pw 안맞으면 flase넣어야함.
    } else {
      return done(null, false, { message: '비번틀렸어요' });
    }
  })
}));
// 이것이 아이디/ 비번을 검사해주는 코드이다.
// LocalStrategy()는 이게 local방식으로 아이디/비번 검사를 어떻게 할지 도와주는 부분이라고 보면된다.
// 그리고 그안에 세부설정을 해주면된다.
// LocalStrategy({ 설정 }, function(){ 아이디비번 검사하는 코드 }) 이런 흐름으로 되어있다.


// 하지만 문제점이 하나 있다.
// if(입력한비번 == 결과.pw)라는 부분에서 사용자가 입력한 비밀번호와 DB의pw 항목을 같은지 비교하고 있는데
// 애초에 DB에 pw를 저장할 때 암호화해서 저장하는 것이 좋으며
// 사용자가 입력한 비번을 암호화해준 뒤에 이게 결과.pw와 같은지 비교하는게 조금더 보안에 신경쓴 방법이다.
// 나중에 구글에 좋은 비번저장 예제를 찾아서 한번 그대로 적용해보길 바란다.

// 그다음 세션 만들고 세션아이디 발급해서 쿠키로 보내주기
// 아이디/비번을 DB데이터와 비교해서 이게 맞다면 어떻게 해야합니까.
// 세션방식을 적용한다고 했으니 세션데이터를 하나 만들어주면 되겠죠? (이건 라이브러리가 알아서 한다)
// 그리고 세션데이터에 포함된 세션아이디를 발급해서 유저에게 보내면 된다.
// 실은 쿠키로 만들어서 보내주면 된다.


// 세션을 저장시키는 코드 (로그인 성공시 발동).
passport.serializeUser((user, done) => {
  done(null, user.id);
  // -유저의 id데이터를 바탕으로 세션데이터를 만들어주고
  //  유저의 id만 뽑아서 암호문으로 만들어서 세션에 저장시킨다.
  // -그 세션데이터의 아이디를 쿠키로 만들어서 사용자의 브라우저로 보내준다.
});

// 이세션 데이터를 가진 사람을 DB에서 찾아주세요.(마이페이지 접속시 발동).
passport.deserializeUser((아이디, done) => {
   // 파라미터 아이디는 위에 user.id와 동일한 의미이다. 
  db.collection('login').findOne({id: 아이디}, (에러, 결과) => {
    // done(null, {});
     done(null, 결과);
     // 마이페이지 같은거 접속시마다 DB에서 {id:어쩌고}인걸 찾아서 그결과를 보내줌.
     //-그러면 DB에서 {id : 세션아이디에 숨겨져있던 유저의 아이디}인 게시물을 하나 찾아서
     //-찾은 DB데이터 결과를 done(null, 결과) 이렇게 해준다.
     //-그러면 결과가 요청.user 부분에 꽂히게 된다.
  });
  
  // 얘는 이제 로그인 된 유저가 마이페이지 등을 접속했을때 실행되는 함수이다.
  // 이사람이 세션이 있는지 없는지 찾을때 실행되는 함수.
  // 로그인한 유저의 개인정보를 DB에서 찾는 역활.
});


// 그럼 어떤사람이 DB에 저장된 아이디/비번 한쌍으로 로그인시
// 쿠키가 만들어져서 고객의 브라우저로 전송되어야한다.
// 로그인 성공시 session 어쩌구라고 적힌 쿠키가 새로 하나 생성되면 성공이다.



const doLogin = (요청, 응답, next) => { // 미들웨어
  // 이함수는 "요청.user가 있으면 next()로 다음으로 통과시켜주고요, 없으면 에러메세지를 응답.send()해주세요" 라는 뜻이다.
    if(요청.user) {
       next(); 
    } else { 응답.send('로그인을 해주세요.'); }
};
// 로그인한 유저만 마이페이지를 보여주고 싶기 때문에 여기다가 미들웨어를 하나 추가해보자.
// 미들웨어는 mypage를 요청시 mypage.ejs를 응답해주기 전에 실행할 짧은 코드를 의미한다.
// 미들웨어에서 "야 너 로그인했니?" 라고 물어보면 좋지 않을까요?

app.get('/mypage', doLogin, (요청, 응답) => {
   // 마이페이지 같은거 접속할때마다 deserializeUser에서 찾아서 보내준 유저정보가 요청.user에 다 담겨있다.
    console.log(요청.user);
    응답.render('mypage.ejs', {user: 요청.user});
  // -누군가 mypage로 요청시 방문자가 세션아이디 쿠키가 존재하면
  // -deserializeUser라는 함수 덕분에 항상 요청.user라는 데이터가 존재한다.
  // -출력해보면 로그인한 유저의 정보가 나오쥬?
  // -결론은 요청.user는 deserializeUser가 보내준 로그인한 유저의 DB데이터이다.
});
// 1.get()이런 함수안에 저렇게 미들웨어를 집어넣을 수있다.
// 그러면 /mypage요청과 mypage.ejs응답 사이에 doLogin라는 코드를 실행시켜준다.


// 요청.user 라는건 뭡니까?
// 로그인한 유저의 DB상 정보이다. (아이디, 비번, 유저명 등)
// 하지만 그냥 출력해보면 아무것도 없고, 이걸 사용하려면 deserializeUser라는 부분 기능개발이 필요하다.
// deserializeUser라는 부분은 고객의 세션아이디를 바탕으로 이 유저의 정보를 DB에서 찾아주세요~ 역할을하는 함수이다.
// 찾은 그결과를 요청.user부분에 꽂아준다.



app.get('/logout', (요청, 응답) => {
  // 멋지게 로그아웃시키는 방법은 누군가 /logout페이지 방문시(GET요청시) 요청.logout()이라는 짧은 코드를 실행하면 된다.
  // (작성할 때 까먹지 말고 응답도 꼭 해줘야한다.) 
    console.log('되냐?');
    요청.logout(() => { 응답.send('로그아웃 되었습니다.'); });    
});



// 서버에서 query string 확인하는 법
app.get('/search', (요청, 응답) => {
   console.log(요청.query);
   // 요청.query 하면 query string을 전부 꺼내볼 수있다.
   // 이건 object자료로 전달되기 때문에 요청.query.value 하면 아까 작성했던 입력한값 데이터가 잘출력된다. 
   db.collection('post').find({todo: 요청.query.value}).toArray((에러, 결과) => {
    // 글의 제목이 "사용자가 입력한 검색어"인 게시물을 꺼내보자.
    // find() 안에 저렇게만 쓰면 index활용 안하고 모든항목을 찾아보는 full scan할듯.
      console.log(결과);
      응답.render('search.ejs', {search: 결과});
   });
});
// '이닦기' 검색하면 진짜 콘솔창에 '이닦기'라는 제목의 게시물이 출력된다.
// 근데 문제는 정확히 제목이 일치하는 것만 찾아준다.
// 제목이 "이닦기입니다" 이런 게시물은 안찾아준다는 것임.


// 문제점 : 정확히 일치하는 것만 찾아준다.
// "글쓰기"라고 검색하면 "글쓰기를 잘해야합니다" 이런 게시물은 못찾는다.
// 어떻게 해결하냐면

// 간단한 해결책 : 정규식을 쓴다.
// 정규식은 문자를 검사하는 식이다. / / 안에다가 문자를 담으면 검사해준다.
// /abc/ 이렇게 적으면 문자에 abc라는게 들어있냐~ 라고 검사해줄 수 있으니 이거 쓰면 해결입니다.
// db.collection('post').find({todo : /글쓰기/})
// 그니까 find() 함수쓸때 이렇게 검색하면 되는 것임.

// Database가 게시물을 찾는 방법
// 원래 게시물을 그냥 찾으면 매우 느리다.
// 원하는걸 찾으려면 게시물 100만개를 전부 탐색해야하니까.
// 그래서 데이터베이스는 보통 Binary Search라는걸 사용할수 있다.
// 거의 모든 Database들은 기본적으로 이걸로 게시물을 찾아준다.

// 그럼 글제목도 빠르게 찾으려면
// 미리 정렬해두면 되지 않을까요? (글자도 정렬이 가능하다)
// 이걸 멋진 용어로 indexing이라고 한다.
// indexing을 해두면 이제 글자로 뭔가 검색할때 매우 빠르게 찾을수있다.
// indexing 하려면 MongoDB Atlas 들어가서
// 원하는 Collection안에서 Index 만들기 누르면 된다.

// 그다음에 이렇게 설정해주면 된다.
// {인덱스만들항목이름 : 'text'}이렇게 기입하면 끝이다.
// 글자인 경우 'text' 숫자인 경우 1 또는 -1을 기입하면 끝이다.
// 그러면 index가 생성된다.
// 인덱싱이라는 용어가 어려워 보이지만 그냥 collection을 사본을 하나더 만들어주는 작업일 뿐이다. 근데 정렬된 사본임
// index를 만들어두면 빠르게 찾아낼 수있는데 한글 게시물들의 경우 문제점이 있을수있다.
// 다음시간에 해결해보도록 하자. 

// (참고) 정규식을 사용하면 항상 index를 사용하는게 아니다.
// 정규식을 쓸때 시작하는 단어가 '이닦기'인걸 찾아주세요~ 라고 명령을 주면 index를 사용하고,
// '이닦기'가 포함된걸 다찾아주세요~ 라고 명령을 주면 index를 사용하지 않는다.
// 그래서 인덱싱 이런게 항상 만능은 아니다.
// 이문제도 다음시간에 해결하자.


// 인덱스를 활용하여 검색하려면, 예시
app.get('/search2', (요청, 응답)=>{
  console.log(요청.query);
  db.collection('post').find({$text: { $search: 요청.query.value }}).toArray((에러, 결과)=>{
    // find()안에 $text 어쩌구로 시작하면 만들어둔 text인덱스에서 검색이 가능하다.
    console.log(결과)
    응답.render('search.ejs', {posts : 결과})
  })
});
// 이렇게 기능개발 해놓으면 간단한 검색엔진처럼 검색도 가능한데
// 검색창에
// 이닦기 글쓰기라고 검색하면 이닦기 or 글쓰기가 둘중에 하나라도 단어가 포함된 모든문서를 찾아줌.
// 이닦기 -글쓰기라고 검색하면 이닦기인데 글쓰기라는 단어 제외검색.
// "이닦기 글쓰기" 라고 검색하면 정확히 이닦기 글쓰기 라는 phrase가 포함된 문서 검색.
// text인덱스를 만들어두면 자동으로 사용할수 있는 검색기능 이다.

// 심각한 단점 :
// 글쓰기라고 검색하라면 글쓰기입니다~ 이런 문장은 못찾아준다.
// text인덱스 만들때 띄어쓰기 기준으로 단어를 저장하고 정렬함.
// 영어는 상관없는데 영어가 아닌 언어들은 그래서 text search기능을 쓸수가 없다.
// 그래서 그냥 영어서비스 개발할거면 쓰시고 아니라면 지웁시다.
// 그럼 100만개에서 '글쓰기'라는 단어가 포함된 문서를 검색해야하면 어떻게 하죠 ㄷㄷ


// 해결책 1. 검색할 문서의양을 제한을 둔다.
// 미리 날짜를 저장해두면 DB에다가 검색요청을 날릴때 특정 날짜에서만 검색하라고 요구할 수도있고
// skip(), limit()이런 함수를 이용하면 pagination기능을 개발할 수있다.
// 그니까 맨처음 검색할땐 맨앞에 20개만 찾아줘~
// 그 다음엔 다음 20개를 찾아줘~
// 이렇게 요구할수 있다는 거다. 대부분의 게시판들은 이런 방법을 이용한다.

// 해결책 3. Search index를 사용한다.
// MongoDB Atlas에서만 제공하는 기능인데
// 클러스터 들어가보면 아마 Search어쩌구라는 메뉴가 있다. 그거 누르면 된다.
// 그러면 Search index라는걸 만들 수있다. 이름 잘지어서 만들어주자.
// index이름은 자유 작명이고 어떤 collection에 있는 항목을 indexing할건지 선택하면 된다.
// 그리고 Analyzer를 설정하는 부분이 있다.
// 이걸 lucene.korean으로 바꿔주면 똑똑하게 한국어에 딱맞게 인덱싱을 해준다.
// lucene이 뭐냐면 그 형태소분석기 이런건데 한국어는 조사 이런게 붙잖아
// 글쓰기를  글쓰기입니다  글쓰기지만  글쓰기라도
// 이런식으로 단어뒤에 쓸데없는 조사가 붙는데 이걸다 제거하고 필요한 단어만 남긴다고 보면된다. 
// 이렇게 하면 Search index를 만들수 있다. 끝

// Search index이용해서 검색요청하는 법
app.get('/realsearch', (요청, 응답) => {
  console.log(요청.query);
  const searchCondition = [
    {$search: {
        index: 'titleSearch', // 님이만든인덱스명.
        text: {
          query: 요청.query.value, // 입력한 검색어.
          path: 'todo'  // 어떤 항목에서 찾을건지. 할일,날짜에서 동시에 찾고 싶으면 ['todo', 'date'] 이렇게 써준다.
        }
    }}
  ];

  db.collection('post').aggregate(searchCondition).toArray((에러, 결과) => {
    // find()함수와 같은기능인 aggregate()함수를 쓰는데 이건 검색조건 여러개를 붙이고 싶을때 유용한 함수이다.
    // aggregate()안에 [{검색조건1}, {검색조건2} ...] 이렇게 조건을 여러개 집어넣을 수있다.
    // 데이터 꺼내는 pipeline구축가능.
    // 지금은 하나만 집어넣어봄.
    console.log(결과);
    응답.render('search.ejs', {search : 결과});
  })
});
// 연산자인 $search를 넣으면 search index에서 검색이 된다고 한다.
// 길어보이지만 search index쓰는 방법을 카피해서 썼을뿐, 이것도 원리 이해보다는 복붙의 영역임.
// 저렇게 쓰면 '글쓰기' 라고 검색했을때 '글쓰기합니다~' 이런 문장들도 잘 검색해준다. 끝

// 여러가지 검색용 연산자
const 검색조건 = [
  {
    $search: {
      index: 'titleSearch', // 님이만든인덱스명.
      text: {
//      query: 요청.query.value, // 입력한 검색어.
        path: 'todo'  // 어떤 항목에서 찾을건지. 할일,날짜에서 동시에 찾고 싶으면 ['todo', 'date'] 이렇게 써준다.
      }
    }
  },
  {$sort: {_id : 1}}, // -1은 내림차순.
  {$limit: 10},
  {$project: {제목: 1, _id: 0}}
];
// aggregate()안에 [{검색조건1}, {검색조건2} ...] 이렇게 여러개 넣을수 있댔는데
// $sort를 쓰면 결과를 정렬해서 가져온다. _id를 오름차순으로 정렬해주세요~ 라고 썼다.
// $limit을 쓰면 결과를 제한해준다. 맨위의 10개만 가져오라고 시켰다.
// $project를 쓰면 찾아온 결과 중에 원하는 항목만 보여준다. 0은 안보여주고 1은 보여주라는 뜻이다.
// 위의 코드는 _id는 빼고 제목만 가져오겠군요.
// 이 외에도 백만개의 $연산자가 있다고 한다. 필요할때 찾아서 쓰자.




// router폴더와 파일을 만들어 API들 관리하기

// app.use('/', require('./routes/shop.js'));
// 고객이 /경로로 요청했을때 이런 미들웨어(방금만든 라우터)를 적용해주세요. 라는 뜻이다.


app.use('/shop', require('./routes/shop.js'));
// 고객이 /shop경로로 요청(접속)하면 shop.js라우터를 이용하겠다. 라는 뜻이다.

app.use('/board/sub', require('./routes/board.js'));
// 연습으로 나눈 라우터 미들웨어.
