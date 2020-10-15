const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Items Endpoints', function() {
  let db

  const {
    testUsers,
    testItems,
  } = helpers.makeItemsFixtures()


  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe(`GET /api/items`, () => {
    context(`Given no items`, () => {
      it(`responds with 200 and an empty list`, () => {
        helpers.seedUsers(db, testUsers)
        return supertest(app)
          .get('/api/items')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200, [])
      })
    })

    context('Given there are items in the database', () => {
      beforeEach('insert items', () =>
        helpers.seedItemsTables(
          db,
          testUsers,
          testItems,
        )
      )

      it('responds with 200 and all of the Items', () => {
        const expectedItems = testItems.map(item =>
          helpers.makeExpectedItem(
            testUsers,
            item,
          )
        )
        return supertest(app)
          .get('/api/items')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedItems)
      })
    })

    context(`Given an XSS attack item`, () => {
      const testUser = helpers.makeUsersArray()[0]
      const {
        maliciousItem,
        expectedItem,
      } = helpers.makeMaliciousItem(testUser)

      beforeEach('insert malicious Item', () => {
        return helpers.seedMaliciousItem(
          db,
          testUser,
          maliciousItem,
        )
      })

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/items`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200)
          .expect(res => {
            expect(res.body[0].title).to.eql(expectedItem.title)
            expect(res.body[0].content).to.eql(expectedItem.content)
          })
      })
    })
  })

  describe(`GET /api/items/:item_id`, () => {
    context(`Given no items`, () => {
      beforeEach(() =>
        helpers.seedUsers(db, testUsers)
      )

      it(`responds with 404`, () => {
        const itemId = 123456
        return supertest(app)
          .get(`/api/items/${itemId}`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(404, { error: `Item doesn't exist` })
      })
    })

    context('Given there are items in the database', () => {
      beforeEach('insert items', () =>
        helpers.seedItemsTables(
          db,
          testUsers,
          testItems,
        )
      )

      it('responds with 200 and the specified item', () => {
        const itemId = 2
        const expectedItem = helpers.makeExpectedItem(
          testUsers,
          testItems[itemId - 1],
        )

        return supertest(app)
          .get(`/api/items/${itemId}`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedItem)
      })
    })

    context(`Given an XSS attack item`, () => {
      const testUser = helpers.makeUsersArray()[0]
      const {
        maliciousItem,
        expectedItem,
      } = helpers.makeMaliciousItem(testUser)

      beforeEach('insert malicious Item', () => {
        return helpers.seedMaliciousItem(
          db,
          testUser,
          maliciousItem,
        )
      })

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/items/${maliciousItem.id}`)
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200)
          .expect(res => {
            expect(res.body.title).to.eql(expectedItem.title)
            expect(res.body.content).to.eql(expectedItem.content)
          })
      })
    })
  })
})