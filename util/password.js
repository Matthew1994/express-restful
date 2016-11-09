import crypto from "crypto"

const SALT_LENGTH = 10;

// 用md5对入库的密码进行加密

function md5(string) {
	return crypto.createHash('md5').update(string).digest('hex');
}

function generateSalt() {
	const collection = "0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ";
	let len = collection.length,
			salt = '';
	for (let i = 0; i < SALT_LENGTH; i++) {
		let index = Math.floor(Math.random() * len);
		salt += collection[index];
	}
	return salt;
}

export function createHash(password) {
	let salt = generateSalt();
	return salt + md5(password+salt);
}

export function validatePassword(password, hash) {
	let salt = hash.substring(0, SALT_LENGTH);
	return hash === salt + md5(password+salt);
}

