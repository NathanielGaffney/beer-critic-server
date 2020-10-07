

const UserService = {
    insertUser(db, newUser){
        return db
            .insert(newUser)
            .into('users')
            .returning('*')
            .then(user =>
             user[0] 
            )
    }
}

module.exports = UserService;