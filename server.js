var express = require('express')
var postgraphql = require('postgraphql').default

var app = express()

app.use(
    postgraphql(
        {
            user: process.env.POSTGRES_USERNAME,
            password: process.env.POSTGRES_PASSWORD,
            host: process.env.POSTGRES_HOST,
            port: process.env.POSTGRES_PORT,
            database: process.env.POSTGRES_DATABASE,
            ssl: true
        },
        'public',
        {
            graphiql: true
        }
    )
)

app.listen(3000)
