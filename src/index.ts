require("dotenv").config()
import express from 'express'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from "@apollo/server/express4"
import connectDB from './db'
import typeDefs from './utils/getGqlTypes'

async function init() {

    const app = express()
    const gqlServer = new ApolloServer({
        typeDefs,
        resolvers: {
            Query:{
                hello:()=>"Hello World!",
                say:()=>"Hello World!"
            }
        },
    })

    const PORT = Number(process.env.PORT) || 8080

    app.use(express.json())

    app.get('/health-check', (req, res) => {
        res.json({ message: "server is up and running" })
    })

    await connectDB().then(async()=>{

        await gqlServer.start()
        app.use("/graphql", expressMiddleware(gqlServer))
        app.listen(PORT, () => {
            console.log('Server is listning on PORT: ', PORT)
        })
    })

}
init();