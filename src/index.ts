require("dotenv").config()
import express from 'express'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from "@apollo/server/express4"
import connectDB from './db'
import typeDefs from './utils/getGqlTypes'
import resolvers from './utils/getGqlResolvers'

const PORT = Number(process.env.PORT) || 8080

async function init() {

    try {

        const app = express()
        const gqlServer = new ApolloServer({
            typeDefs,
            resolvers,

        })


        // Middlewares
        app.use(express.json())


        // Restful Routes
        app.get('/health-check', (req, res) => {
            res.json({ message: "server is up and running" })
        })

        // DB connection
        await connectDB().then(async () => {

            // GQL Server
            await gqlServer.start()
            app.use("/graphql", expressMiddleware(gqlServer))
            // HTTP Server
            app.listen(PORT, () => {
                console.log('Server is listning on PORT: ', PORT)
            })
        })
    } catch (error) {
        console.log(error)
    }

}
init();