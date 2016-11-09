import orm from 'orm'
import User from './user'
var models = {};

export default (app)=> {
	//设置orm
	app.use(orm.express("mysql://root:123456@localhost/test", {
	    define: function (db, models, next) {
	      models.User = User(orm, db);
	      next();
	    }
	}));
}

