import fs from 'fs';
import path from 'path';

function extractGraphQLTypes(folderPath: string): string[] {
    const gqlTypes: string[] = [];

    fs.readdirSync(folderPath).forEach(file => {
        const filePath = path.join(folderPath, file);
        if (fs.statSync(filePath).isFile() && path.extname(filePath) === '.gql') {
            const content = fs.readFileSync(filePath, 'utf-8');
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

const typesFolderPath = path.join(__dirname, '../graphql/types/');
let gqlTypes = extractGraphQLTypes(typesFolderPath);
let typeDefs = gqlTypes.join(' ')
// console.log(typeDefs); 

export default typeDefs
