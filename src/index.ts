require("dotenv").config()
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { ApolloServer, BaseContext } from '@apollo/server'

import { expressMiddleware } from "@apollo/server/express4"
import connectDB from './db'
// import typeDefs from './utils/getGqlTypes'
import resolvers from './utils/getGqlResolvers'
import { verifyJWT } from './middleware/auth.middleware'
import gql from 'graphql-tag'
import { buildSubgraphSchema } from '@apollo/subgraph'

import { DocumentNode } from 'graphql'
import { GraphQLSchemaModule } from '@apollo/subgraph/dist/schema-helper'
import {readFileSync} from 'fs'
import typeDefinations from './utils/getGqlTypes'
const PORT = Number(process.env.PORT) || 8080

async function init() {

    try {


        const app = express()
        const isProduction = process.env.NODE_ENV === 'production';

       
        const typeDefs = gql`
        ${typeDefinations}`;

        const gqlServer = new ApolloServer<BaseContext>({
            typeDefs,
            resolvers,
            introspection:true,

        })
        const corsOptions = {
            origin: [
                'https://swaggy-api-v1.vercel.app',
                'https://swaggy-e-comm.vercel.app',
                'https://dashboard-swaggy.vercel.app',
                'http://localhost:3000',// Add localhost with the appropriate port
            ],
            credentials: true, // Allow credentials (cookies, authorization headers, etc.)
          };
          

        // Middlewares
        app.use(express.json())
        app.use(cors(corsOptions));
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
            app.use("/graphql", handleAuth, expressMiddleware(gqlServer, {
                context: async ({ req, res }:{req:any,res:any}) => {
                    return({ req, res })
                },
              }))
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