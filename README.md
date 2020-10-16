Beer Critic Server

This is the server side of the beer critic application.

The api can be reached at https://limitless-coast-38251.herokuapp.com/api

Endpoints

/api/user
    POST:  { username, password }

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