const xss = require('xss')

const ItemsService = {
    getAllItems(db, user_id) {
        return db
            .from('items')
            .select('*')
            // .where('user_id', user_id)
    },

    getById(db, id) {
        return ItemsService.getAllItems(db)
            .where('id', id)
            .first()
    },

    insertItem(db, newItem){
        return db
            .insert(newItem)
            .into('items')
            .returning('*')
            .then(item => 
                item[0]
            )
    },

    updateItem(db, id, updatedItem){
        return db('items')
            .where('id', id)
            .update(updatedItem)
            .returning('*')
            .then(item =>
                item[0]
            )
    },

    deleteItem(db, id){
        return db('items')
            .where('id', id)
            .delete()
            .returning('*')
            .then(item =>
                item[0]    
            )
            
    },

    serializeItem(item) {
        return {
            id: item.id,
            name: xss(item.name),
            rating: Number(item.rating),
            price: Number(item.price),
            type: xss(item.type),
            medium: xss(item.medium),
            user_id: Number(item.user_id),
            date_modified: new Date(item.date_modified),
            description: xss(item.description),
            favorite: (item.favorite)
        }
    },
}

module.exports = ItemsService