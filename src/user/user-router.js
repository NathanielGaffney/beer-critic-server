const express = require('express')
const UserService = require('./user-service')

const UserRouter = express.Router()
const jsonBodyParser = express.json()

UserRouter
    .route('/user')
    .post(jsonBodyParser, (req, res, next) => {
        const { username, password } = req.body
        const newUser = { username, password }

        for (const [key, value] of Object.entries(newUser))
            if (value == null)
                return res.status(400).json({
                    error: `Missing '${key}' in request body`
                })
        
        UserService.insertUser(req.app.get('db'), newUser)

        .then(user => {
            console.log(user)
            console.log(`${req.originalUrl}/${user.id}`);
            res
                .status(201)
                .location(`${req.originalUrl}/${user.id}`)
                .json(`User ${user.username} successfully created.`)
        })
        .catch(next)
    })

module.exports = UserRouter