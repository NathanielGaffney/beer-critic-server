Beer Critic Server
==================

This is the server side of the beer critic application.

The api can be reached at https://limitless-coast-38251.herokuapp.com/api

The client can be reached at https://beer-critic-client.vercel.
app/

>Dummy User Account
>
>username: testUser
>
>password: password

Tech Stack
----------

Front end
* React
* Vercel

Back end
* Express
* knex
* postgresql
* heroku

Endpoints
---------

/api/user
>    POST:  { username, password }

/api/items (requires authorization)
>    GET:   returns all items in database
>
>    POST:   {
            name,
            rating,
            price,
            type,
            medium,
            description,
            favorite,
            user_id
        }

/api/items/:itemId (requires authorization)
>    GET: requires id in params, e.g. "/items/2"
>
>    PATCH: requires id in params, and any of the below items to be changed.

        {
            name,
            rating,
            price,
            type,
            medium,
            description,
            favorite,
            user_id
        }
>
>    DELETE: requires id in params