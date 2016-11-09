import express from 'express'
import passport, {isLoggedIn} from "../service/authentication";

var router = express.Router();


//必须先用bodyParser解析http body，passport.authenticate才能读取username和password
//还有可以添加options，如：passport.authenticate('local', {failureRedirect: '/login'})
router.post('/login', passport.authenticate('local'), (req, res)=> {
	res.sendStatus(200);
})

router.get('/profile', isLoggedIn, (req, res)=> {
	res.send(req.user.basicView());
})

router.get('/logout', (req, res)=> {
	req.logout();
	res.sendStatus(200);
})

//跳转到 post /user，307保持原来的请求方法,302/301只能用于get方法
router.post('/register', (req, res)=> {
	res.redirect(307, '/user');
});

export default router
