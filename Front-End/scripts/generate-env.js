#!/usr/bin/env node
/**
 * generate-env.js
 * Gera o arquivo env.js com a variável API_URL injetada em runtime.
 * Substitui o `envsubst` que não funciona de forma confiável no Render Static Site.
 *
 * Uso: node scripts/generate-env.js
 * Variável de ambiente necessária: API_URL
 */

import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const API_URL = process.env.API_URL;

if (!API_URL) {
  console.error('❌ Variável de ambiente API_URL não definida.');
  console.error('   Defina API_URL antes de rodar este script.');
  process.exit(1);
}

const content = `// Arquivo gerado automaticamente — NÃO edite manualmente
window.API_URL = '${API_URL}';
`;

const outputPath = resolve(__dirname, '..', 'env.js');
writeFileSync(outputPath, content, 'utf8');
console.log(`✅ env.js gerado com API_URL = ${API_URL}`);
