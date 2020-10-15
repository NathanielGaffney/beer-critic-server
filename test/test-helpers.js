const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

function makeUsersArray() {
    return [
        {
            id: 1,
            username: 'test-user-1',
            password: 'password',
            date_created: new Date('2029-01-22T16:28:32.615Z'),
        },
        {
            id: 2,
            username: 'test-user-2',
            password: 'password',
            date_created: new Date('2029-01-22T16:28:32.615Z'),
        },
        {
            id: 3,
            username: 'test-user-3',
            password: 'password',
            date_created: new Date('2029-01-22T16:28:32.615Z'),
        },
        {
            id: 4,
            username: 'test-user-4',
            password: 'password',
            date_created: new Date('2029-01-22T16:28:32.615Z'),
        },
    ]
}

function makeItemsArray(users) {
    return [
        {
            id: 1,
            name: 'First test post!',
            rating: 4,
            price: 4.50,
            type: 'Stout',
            medium: 'Draft',
            favorite: false,
            user_id: users[0].id,
            date_modified: new Date('2029-01-22T16:28:32.615Z'),
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
        },
        {
            id: 2,
            name: 'First test post!',
            rating: 3,
            price: 3.50,
            type: 'Stout',
            medium: 'Draft',
            favorite: false,
            user_id: users[1].id,
            date_modified: new Date('2029-01-22T16:28:32.615Z'),
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
        },
        {
            id: 3,
            name: 'First test post!',
            rating: 5,
            price: 5.50,
            type: 'Stout',
            medium: 'Draft',
            favorite: false,
            user_id: users[1].id,
            date_modified: new Date('2029-01-22T16:28:32.615Z'),
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
        },
    ]
}

function makeExpectedItem(users, item) {
    const user = users
        .find(user => user.id === item.user_id)

    return {
        id: item.id,
        name: item.name,
        rating: item.rating,
        price: item.price,
        type: item.type,
        medium: item.medium,
        favorite: item.favorite,
        description: item.description,
        date_modified: item.date_modified.toISOString(),
        user_id: user.id
    }
}

function makeMaliciousItem(user) {
    const maliciousItem = {
        id: 911,
        date_modified: new Date(),
        name: 'Naughty naughty very naughty <script>alert("xss");</script>',
        rating: 5,
        price: 5.50,
        type: 'Stout',
        medium: 'Draft',
        user_id: 1,
        description: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
    }
    const expectedItem = {
        ...makeExpectedItem([user], maliciousItem),
        name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        description: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
    }
    return {
        maliciousItem,
        expectedItem,
    }
}

function makeItemsFixtures() {
    const testUsers = makeUsersArray()
    const testItems = makeItemsArray(testUsers)
    return { testUsers, testItems }
}

function cleanTables(db) {
    return db.transaction(trx =>
        trx.raw(
            `TRUNCATE
        users, items
      `
        )
            .then(() =>
                Promise.all([
                    trx.raw(`ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1`),
                    trx.raw(`ALTER SEQUENCE items_id_seq minvalue 0 START WITH 1`),
                    trx.raw(`SELECT setval('users_id_seq', 0)`),
                    trx.raw(`SELECT setval('items_id_seq', 0)`),
                ])
            )
    )
}

function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
        ...user,
        password: bcrypt.hashSync(user.password, 1)
    }))
    return db.into('users').insert(preppedUsers)
        .then(() =>
            db.raw(
                `SELECT setval('users_id_seq', ?)`,
                [users[users.length - 1].id],
            )
        )
}

function seedItemsTables(db, users, items = []) {
    return db.transaction(async trx => {
        await seedUsers(trx, users)
        await trx.into('items').insert(items)
        await trx.raw(
            `SELECT setval('items_id_seq', ?)`,
            [items[items.length - 1].id],
        )
    })
}

function seedMaliciousItem(db, user, item) {
    return seedUsers(db, [user])
        .then(() =>
            db
                .into('items')
                .insert([item])
        )
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ user_id: user.id }, secret, {
        subject: user.username,
        algorithm: 'HS256',
    })
    return `Bearer ${token}`
}

module.exports = {
    makeUsersArray,
    makeItemsArray,
    makeExpectedItem,
    makeMaliciousItem,

    makeItemsFixtures,
    cleanTables,
    seedItemsTables,
    seedMaliciousItem,
    makeAuthHeader,
    seedUsers,
}