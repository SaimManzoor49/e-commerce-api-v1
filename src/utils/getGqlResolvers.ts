import fs from 'fs';
import path from 'path';

interface ResolverObject {
    [key: string]: any;
}

function getResolvers(resolverFolderPath: string): ResolverObject {
    const resolvers: ResolverObject = {};

    const processFolder = (folderPath: string) => {
        fs.readdirSync(folderPath).forEach(file => {
            const filePath = path.join(folderPath, file);
            if (fs.statSync(filePath).isFile() && path.extname(filePath) === '.ts') {
                const resolver = require(filePath);
                Object.assign(resolvers, resolver);
            } else if (fs.statSync(filePath).isDirectory()) {
                processFolder(filePath);
            }
        });
    };

    processFolder(resolverFolderPath);

    return resolvers;
}

const resolverFolderPath = path.join(__dirname, '../graphql/resolvers/');
const allResolvers = getResolvers(resolverFolderPath);
console.log(allResolvers);
