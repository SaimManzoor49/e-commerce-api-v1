"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function extractGraphQLTypes(folderPath) {
    const gqlTypes = [];
    fs_1.default.readdirSync(folderPath).forEach(file => {
        const filePath = path_1.default.join(folderPath, file);
        if (fs_1.default.statSync(filePath).isFile() && path_1.default.extname(filePath) === '.gql') {
            const content = fs_1.default.readFileSync(filePath, 'utf-8');
            // console.log(content)
            gqlTypes.push(content);
            // const types = content.match(/type\s+(\w+)\s+/g);
            // if (types) {
            //     types.forEach(type => {
            //         const typeName = type.split(/\s+/)[1];
            //         gqlTypes.push(typeName);
            //     });
            // }
        }
    });
    return gqlTypes;
}
const typesFolderPath = path_1.default.join(__dirname, '../graphql/types/');
let gqlTypes = extractGraphQLTypes(typesFolderPath);
let typeDefs = gqlTypes.join(' ');
// console.log(typeDefs); 
exports.default = typeDefs;
