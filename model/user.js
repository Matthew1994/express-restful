import {createHash, validatePassword} from "../util/password"

export default (orm, db)=> {
	var User = db.define("user", {
		username      : String,
		password   : String,
		email       : String,
		role      : Number,
		id: Number
	}, {
		methods: {
			setPassword: function(password) {
				this.password = createHash(password);
			},
			validPassword: function(password) {
				return validatePassword(password, this.password);
			},
			//基本的视图（password不能暴露出去）
			basicView: function() {
				return {
					username: this.username,
					email: this.email,
					role: this.role,
					id: this.id
				}
			}
		},
		validations: {
			username: [orm.enforce.security.username({expr: /^\w{6,20}$/}, '用户名由6 - 20位字母、阿拉伯数字和下划线组成！'), orm.enforce.unique("用户名必须唯一!")],
			password: orm.enforce.security.password('6', '密码至少6位！'),
			email: [orm.enforce.patterns.email('请输入正确的邮箱！'), orm.enforce.unique("邮箱必须唯一!")],
			role: orm.enforce.ranges.number(0, 10, "角色必须在1-10！"),
			id: orm.enforce.unique("id必须唯一!")
		}
	});



	return User;
}

