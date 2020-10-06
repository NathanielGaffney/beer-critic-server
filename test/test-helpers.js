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
            user_id: users[1].id,
            date_modified: new Date('2029-01-22T16:28:32.615Z'),
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
        },
    ]
}

// function makeCommentsArray(users, items) {
//     return [
//         {
//             id: 1,
//             text: 'First test comment!',
//             item_id: items[0].id,
//             user_id: users[0].id,
//             date_created: new Date('2029-01-22T16:28:32.615Z'),
//         },
//         {
//             id: 2,
//             text: 'Second test comment!',
//             item_id: items[0].id,
//             user_id: users[1].id,
//             date_created: new Date('2029-01-22T16:28:32.615Z'),
//         },
//         {
//             id: 3,
//             text: 'Third test comment!',
//             item_id: items[0].id,
//             user_id: users[2].id,
//             date_created: new Date('2029-01-22T16:28:32.615Z'),
//         },
//         {
//             id: 4,
//             text: 'Fourth test comment!',
//             item_id: items[0].id,
//             user_id: users[3].id,
//             date_created: new Date('2029-01-22T16:28:32.615Z'),
//         },
//         {
//             id: 5,
//             text: 'Fifth test comment!',
//             item_id: items[items.length - 1].id,
//             user_id: users[0].id,
//             date_created: new Date('2029-01-22T16:28:32.615Z'),
//         },
//         {
//             id: 6,
//             text: 'Sixth test comment!',
//             item_id: items[items.length - 1].id,
//             user_id: users[2].id,
//             date_created: new Date('2029-01-22T16:28:32.615Z'),
//         },
//         {
//             id: 7,
//             text: 'Seventh test comment!',
//             item_id: items[3].id,
//             user_id: users[0].id,
//             date_created: new Date('2029-01-22T16:28:32.615Z'),
//         },
//     ];
// }

function makeExpectedItem(users, item) {
    const user = users
        .find(user => user.id === item.user_id)

    return {
        id: item.id,
        name: item.name,
        rating: item.rating,
        description: item.description,
        date_modified: item.date_modified.toISOString(),
        user_id: user.id
    }
}

// function makeExpectedItemComments(users, articleId, comments) {
//     const expectedComments = comments
//         .filter(comment => comment.article_id === articleId)

//     return expectedComments.map(comment => {
//         const commentUser = users.find(user => user.id === comment.user_id)
//         return {
//             id: comment.id,
//             text: comment.text,
//             date_created: comment.date_created.toISOString(),
//             user: {
//                 id: commentUser.id,
//                 user_name: commentUser.user_name,
//                 full_name: commentUser.full_name,
//                 nickname: commentUser.nickname,
//                 date_created: commentUser.date_created.toISOString(),
//                 date_modified: commentUser.date_modified || null,
//             }
//         }
//     })
// }


//START HERE//
function makeMaliciousItem(user) {
    const maliciousItem = {
        id: 911,
        style: 'How-to',
        date_created: new Date(),
        title: 'Naughty naughty very naughty <script>alert("xss");</script>',
        author_id: user.id,
        content: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
    }
    const expectedItem = {
        ...makeExpectedItem([user], maliciousItem),
        title: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        content: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
    }
    return {
        maliciousItem,
        expectedItem,
    }
}

function makeArticlesFixtures() {
    const testUsers = makeUsersArray()
    const testArticles = makeArticlesArray(testUsers)
    const testComments = makeCommentsArray(testUsers, testArticles)
    return { testUsers, testArticles, testComments }
}

function cleanTables(db) {
    return db.transaction(trx =>
        trx.raw(
            `TRUNCATE
        blogful_articles,
        blogful_users,
        blogful_comments
      `
        )
            .then(() =>
                Promise.all([
                    trx.raw(`ALTER SEQUENCE blogful_articles_id_seq minvalue 0 START WITH 1`),
                    trx.raw(`ALTER SEQUENCE blogful_users_id_seq minvalue 0 START WITH 1`),
                    trx.raw(`ALTER SEQUENCE blogful_comments_id_seq minvalue 0 START WITH 1`),
                    trx.raw(`SELECT setval('blogful_articles_id_seq', 0)`),
                    trx.raw(`SELECT setval('blogful_users_id_seq', 0)`),
                    trx.raw(`SELECT setval('blogful_comments_id_seq', 0)`),
                ])
            )
    )
}

function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
        ...user,
        password: bcrypt.hashSync(user.password, 1)
    }))
    return db.into('blogful_users').insert(preppedUsers)
        .then(() =>
            // update the auto sequence to stay in sync
            db.raw(
                `SELECT setval('blogful_users_id_seq', ?)`,
                [users[users.length - 1].id],
            )
        )
}

function seedArticlesTables(db, users, articles, comments = []) {
    // use a transaction to group the queries and auto rollback on any failure
    return db.transaction(async trx => {
        await seedUsers(trx, users)
        await trx.into('blogful_articles').insert(articles)
        // update the auto sequence to match the forced id values
        await trx.raw(
            `SELECT setval('blogful_articles_id_seq', ?)`,
            [articles[articles.length - 1].id],
        )
        // only insert comments if there are some, also update the sequence counter
        if (comments.length) {
            await trx.into('blogful_comments').insert(comments)
            await trx.raw(
                `SELECT setval('blogful_comments_id_seq', ?)`,
                [comments[comments.length - 1].id],
            )
        }
    })
}

function seedMaliciousArticle(db, user, article) {
    return seedUsers(db, [user])
        .then(() =>
            db
                .into('blogful_articles')
                .insert([article])
        )
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ user_id: user.id }, secret, {
        subject: user.user_name,
        algorithm: 'HS256',
    })
    return `Bearer ${token}`
}

module.exports = {
    makeUsersArray,
    makeArticlesArray,
    makeExpectedArticle,
    makeExpectedArticleComments,
    makeMaliciousArticle,
    makeCommentsArray,

    makeArticlesFixtures,
    cleanTables,
    seedArticlesTables,
    seedMaliciousArticle,
    makeAuthHeader,
    seedUsers,
}