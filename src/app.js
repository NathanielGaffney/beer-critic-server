require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const ItemsRouter = require('./item/item-router');
const UserRouter = require('./user/user-router');
const authRouter = require('./auth/auth-router');

const app = express();

const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

app.use('/api', UserRouter)
app.use('/api', ItemsRouter)
app.use('/api/auth', authRouter)

app.get('/', (req, res) => {
    res.send('Hello, world!')
})

app.use(function errorHandler(error, req, res, next) {
    let response
    if(NODE_ENV === 'development') {
        response = { error: { message: 'server error'}}
        console.error(error)
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})

module.exports = app;