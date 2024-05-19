"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getGqlTypes_1 = __importDefault(require("./utils/getGqlTypes"));
const config = {
    overwrite: true,
    schema: getGqlTypes_1.default,
    generates: {
        "src/generated/graphql.ts": {
            plugins: ["typescript", "typescript-resolvers", "typescript-mongodb", "typescript-document-nodes"]
        },
        "./graphql.schema.json": {
            plugins: ["introspection"]
        }
    }
};
exports.default = config;
