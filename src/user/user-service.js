const xss = require('xss')
const bcrypt = require('bcryptjs')

const UserService = {
    insertUser(db, newUser){
        return db
            .insert(newUser)
            .into('users')
            .returning('*')
            .then(user =>
             user[0] 
            )
    },
    hashPassword(password){
        return bcrypt.hash(password, 12)
    },
    serializeUser(user){
        return {
            id: user.id,
            user_name: xss(user.username)
        }
    }
}

module.exports = UserService;