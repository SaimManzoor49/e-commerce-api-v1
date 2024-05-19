import fs from 'fs';
import path from 'path';
import { Resolvers } from '../generated/graphql';

interface DynamicResolvers {
  [key: string]: any;
}

const getResolvers = (folderPath: string): Resolvers => {
  const resolvers: DynamicResolvers = {};

  const readFiles = (dir: string): void => {
    fs.readdirSync(dir).forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        readFiles(filePath);
      } else if (file.endsWith('.js') || file.endsWith('.ts')) {
        const module = require(filePath);
        const keys = Object.keys(module);

        keys.forEach(key => {
          if (typeof module[key] === 'object') {
            resolvers[key] = { ...resolvers[key], ...module[key] };
          }
        });
      }
    });
  };

  readFiles(folderPath);

  return resolvers as Resolvers;
};

// Usage example:
const resolverFolderPath = path.join(__dirname, '../graphql/resolvers/');
const resolvers = getResolvers(resolverFolderPath);

export default resolvers;
