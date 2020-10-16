const express = require('express')
const ItemsService = require('./item-service')
const { requireAuth } = require('../middleware/jwt-auth');

const ItemsRouter = express.Router()
const jsonBodyParser = express.json();

ItemsRouter
    .route('/items')
    .all(requireAuth)
    .get((req, res, next) => {
        ItemsService.getAllItems(req.app.get('db'))
            .then(items => {
                res.json(items.map(ItemsService.serializeItem))
            })
            .catch(next)
    })
    .post(jsonBodyParser, (req, res, next) => {
        const {
            name,
            rating,
            price,
            type,
            medium,
            description,
            favorite,
            user_id
        } = req.body
        const newItem = {
            name,
            rating,
            price,
            type,
            medium,
            description,
            favorite,
            user_id
        }

        for (const [key, value] of Object.entries(newItem))
            if (value == null)
                return res.status(400).json({
                    error: `Missing '${key}' in request body`
                })

        ItemsService.insertItem(
            req.app.get('db'),
            newItem
        )
            .then(item => {
                console.log(`${req.originalUrl}/${item.id}`);
                res
                    .status(201)
                    .location(`${req.originalUrl}/${item.id}`)
                    .json(ItemsService.serializeItem(item))
            })
            .catch(next)
    })

ItemsRouter
    .route('/items/:id')
    .all(requireAuth)
    .all(checkItemExists)
    .get((req, res) => {
        res.json(ItemsService.serializeItem(res.item))
    })
    .patch(jsonBodyParser, (req, res, next) => {
        const patchItem = req.body

        const id = req.params.id
        ItemsService.updateItem((req.app.get('db')), id, patchItem)
            .then(item => {
                res
                    .status(200)
                    .json(ItemsService.serializeItem(item))
            })
            .catch(next)
    })
    .delete((req, res, next) => {
        const id = req.params.id
        ItemsService.deleteItem((req.app.get('db')), id)
            .then(item => {
                res
                    .status(200)
                    .json({"message": `Item at id ${id} successfully deleted.`, "item": item})
            })
            .catch(next)
    })

async function checkItemExists(req, res, next) {
    try {
        const item = await ItemsService.getById(
            req.app.get('db'),
            req.params.id
        )

        if (!item)
            return res.status(404).json({
                error: `Item doesn't exist`
            })

        res.item = item;
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = ItemsRouter