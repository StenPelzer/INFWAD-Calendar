import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const generatedFile = join(__dirname, '../src/graphql/generated.ts');
const content = readFileSync(generatedFile, 'utf-8');

// Fix the Apollo import to use the react module
const fixedContent = content.replace(
  /import \* as Apollo from '@apollo\/client';/,
  "import * as Apollo from '@apollo/client/react';"
);

writeFileSync(generatedFile, fixedContent, 'utf-8');
console.log('✅ Fixed Apollo Client import in generated.ts');

