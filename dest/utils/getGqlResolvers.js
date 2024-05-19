"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const getResolvers = (folderPath) => {
    const resolvers = {};
    const readFiles = (dir) => {
        fs_1.default.readdirSync(dir).forEach(file => {
            const filePath = path_1.default.join(dir, file);
            const stat = fs_1.default.statSync(filePath);
            if (stat.isDirectory()) {
                readFiles(filePath);
            }
            else if (file.endsWith('.js') || file.endsWith('.ts')) {
                const module = require(filePath);
                const keys = Object.keys(module);
                keys.forEach(key => {
                    if (typeof module[key] === 'object') {
                        resolvers[key] = Object.assign(Object.assign({}, resolvers[key]), module[key]);
                    }
                });
            }
        });
    };
    readFiles(folderPath);
    return resolvers;
};
// Usage example:
const resolverFolderPath = path_1.default.join(__dirname, '../graphql/resolvers/');
const resolvers = getResolvers(resolverFolderPath);
exports.default = resolvers;
