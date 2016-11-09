import express from "express";

//Router
import userRouter from './router/user'
import authRouter from './router/auth'

//service
import passport, {isLoggedIn} from './service/authentication'

// util
import bodyParser from 'body-parser'
import cookieParser from "cookie-parser"
import expressSession from "express-session";
import orm from 'orm'

//model
import Model from './model/index'

var app = express();

app.use(cookieParser())

//使用qs库，解析x-www－form－urlencoded格式的body
app.use(bodyParser.urlencoded({ extended: true }))
//解析 application/json格式的body
app.use(bodyParser.json())
//若要解析multipart/form-data，则使用中间件multer

app.use(expressSession({ secret: 'keyboard cat', resave: true, saveUninitialized: true, cookie:{maxAge: 86400000}}))

//创建orm
Model(app);

// 初始化passport
app.use(passport.initialize());
app.use(passport.session());

//注入Router
app.use(authRouter);
app.use(userRouter);

app.listen(3000, ()=> {
	console.log('app listening on port 3000!');
})