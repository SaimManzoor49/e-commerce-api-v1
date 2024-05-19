
import type { CodegenConfig } from '@graphql-codegen/cli';
import typeDefinations from './utils/getGqlTypes' 
const config: CodegenConfig = {
  overwrite: true,
  schema: typeDefinations,
  generates: {
    "src/generated/graphql.ts": {
      plugins: ["typescript", "typescript-resolvers", "typescript-mongodb", "typescript-document-nodes"]
    },
    "./graphql.schema.json": {
      plugins: ["introspection"]
    }
  }
};

export default config;
