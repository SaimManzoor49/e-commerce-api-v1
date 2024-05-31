"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const db_1 = __importDefault(require("./db"));
// import typeDefs from './utils/getGqlTypes'
const getGqlResolvers_1 = __importDefault(require("./utils/getGqlResolvers"));
const auth_middleware_1 = require("./middleware/auth.middleware");
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const getGqlTypes_1 = __importDefault(require("./utils/getGqlTypes"));
const PORT = Number(process.env.PORT) || 8080;
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const app = (0, express_1.default)();
            const isProduction = process.env.NODE_ENV === 'production';
            const typeDefs = (0, graphql_tag_1.default) `
        ${getGqlTypes_1.default}`;
            const gqlServer = new server_1.ApolloServer({
                typeDefs,
                resolvers: getGqlResolvers_1.default,
                introspection: true,
            });
            const corsOptions = {
                origin: [
                    'https://swaggy-api-v1.vercel.app',
                    'https://swaggy-e-comm.vercel.app',
                    'http://localhost:3000', // Add localhost with the appropriate port
                ],
                credentials: true, // Allow credentials (cookies, authorization headers, etc.)
            };
            // Middlewares
            app.use(express_1.default.json());
            app.use((0, cors_1.default)(corsOptions));
            app.use((0, cookie_parser_1.default)());
            // index route
            app.get('/', (req, res) => {
                res.json({ message: "Hello World!!!" });
            });
            // Restful Routes
            app.get('/health-check', (req, res) => {
                res.json({ message: "server is up and running" });
            });
            const handleAuth = (req, res, next) => {
                var _a;
                // console.log(req?.headers)
                // add route name in if block to protect them // private routes
                if (((_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.operationName) == 'GetUser') { // update
                    (0, auth_middleware_1.verifyJWT)(req, res, next);
                }
                else {
                    // all public 
                    next();
                }
            };
            // DB connection
            yield (0, db_1.default)().then(() => __awaiter(this, void 0, void 0, function* () {
                // GQL Server
                yield gqlServer.start();
                app.use("/graphql", handleAuth, (0, express4_1.expressMiddleware)(gqlServer, {
                    context: (_a) => __awaiter(this, [_a], void 0, function* ({ req, res }) {
                        return ({ req, res });
                    }),
                }));
                // HTTP Server
                app.listen(PORT, () => {
                    console.log('Server is listning on PORT: ', PORT);
                });
            }));
        }
        catch (error) {
            console.log(error);
        }
    });
}
init();
