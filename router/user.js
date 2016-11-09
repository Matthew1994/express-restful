import express from 'express'
import {createHash} from "../util/password"


var router = express.Router();

var isAuthorized = (req, res, next)=> {
	if (req.isAuthenticated() && req.user.id === parseInt(req.params.id)) {
		next();
	}
	else {
		res.sendStatus(401);
	}
}

// 预处理id 和 password
var bodyPreHandler = (option)=> {
	if (option['id'])
		option['id'] = undefined
	if (option.password) {
		option.password = createHash(option.password);
	}
}

router.route('/user/:id')
	.all(isAuthorized)
	.get((req, res, next)=> {
		let id = req.params.id;
		let userPromise = new Promise((resolve, reject) => {
			req.models.User.one({id: id}, (err, user)=> {
				if (err) {
					reject(err);
					return;
				}
				else 
					resolve(user);
			});	
		});
		userPromise.then((user)=> {
			res.send(user.basicView());
		})
		.catch((err)=> {
			console.log(err)
			res.sendStatus(404);
		});
	})
	.delete((req, res, next)=> {
		let id = req.params.id;
		let userPromise = new Promise((resolve, reject) => {
			req.models.User.one({id: id}, (err, user)=> {
				if (err) {
					reject(err);
					return;
				}
				if (!user) {
					reject(`id ${id} Not Existed!`);
					return;
				}
				user.remove((err)=> {
					if (err) {
						reject(err);
						return;
					}
					else
						resolve();
				});
			});
		});
		userPromise.then(()=> {
			res.send({'success': {id: id}});
		}).catch((err)=> {
			res.send({'error': err});
		})
	})
	.put((req, res, next)=> {
		let id = req.params.id,
		    option = typeof req.body === "object" ? req.body : {};
		bodyPreHandler(option);
		let userPromise = new Promise((resolve, reject) => {
			req.models.User.one({id, id}, (err, user)=> {
				if (err) {
					reject(err);
					return;
				}
				if (!user) {
					reject(`id ${id} Not Existed!`);
					return;
				}
				for (let key in option) {
					user[key] = option[key];
				}
				user.save((err)=> {
					if (err) {
						reject(err.msg || err);
						return;
					}
					resolve();	
				});
			})
		});
		userPromise.then(()=> {
			res.send({'success': {id: id}})
		}).catch((err)=> {
			res.send({'error': err})
		})
	});

router.post('/user', (req, res, next)=> {
	let userPromise = new Promise((resolve, reject) => {
		let option = typeof req.body === "object" ? req.body : {};
		bodyPreHandler(option);
		req.models.User.create(option, (err, result)=> {
			if (err) {
				reject({'error' : err.msg || err});
				return;
			}
			else {
				resolve({'success': result.basicView()});
			}
		});	
	});
	userPromise.then((user)=> {
		res.send(user);
	}).catch((err)=> {
		res.send(err);
	});
});

export default router