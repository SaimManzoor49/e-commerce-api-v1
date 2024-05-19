require("dotenv").config()
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { ApolloServer } from '@apollo/server'

import { expressMiddleware } from "@apollo/server/express4"
import connectDB from './db'
import typeDefs from './utils/getGqlTypes'
import resolvers from './utils/getGqlResolvers'
import { verifyJWT } from './middleware/auth.middleware'

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
        app.use(cors({
            origin: ["http://localhost:3000", "*"],
            credentials: true
        }));
        app.use(cookieParser());

        // index route
        app.get('/', (req, res) => {
            res.json({ message: "Hello World!!!" })
        })
        // Restful Routes
        app.get('/health-check', (req, res) => {
            res.json({ message: "server is up and running" })
        })

        const handleAuth = (req: any, res: any, next: any) => {
            // console.log(req?.headers)
            // add route name in if block to protect them // private routes
            if (req?.body?.operationName == 'GetUser') { // update
                verifyJWT(req, res, next);
            } else {
                // all public 
                next();
            }
        }
        // DB connection
        await connectDB().then(async () => {

            // GQL Server
            await gqlServer.start()
            app.use("/graphql", handleAuth, expressMiddleware(gqlServer))
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