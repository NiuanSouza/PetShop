# Backend (Node.js + Express + Prisma)

## Pré‑requisitos
- **Node.js** (versão >= 18) e **pnpm** instalado.  
- **SQLite** será usado como banco de dados de desenvolvimento (arquivo `prisma/dev.db`).

## Instalação
```bash
# na pasta Back-End
cd Back-End
pnpm install   # instala dependências (express, prisma, zod, etc.)
```

## Banco de dados
```bash
# Gera o cliente Prisma
pnpm prisma:generate

# Executa migrações e seed inicial
pnpm prisma:migrate && pnpm prisma:seed
```

## Executar o servidor
```bash
pnpm dev   # ou: node src/index.js (transpilado) 
# O servidor roda em http://localhost:3000
```

## Testes
```bash
pnpm test   # testes unitários (Vitest)
```

## Deploy (Render)
- O arquivo `render.yaml` já está configurado.
- O script `render-deploy.sh` (na raiz) executa `render deploy`.
- O seed será rodado automaticamente na primeira inicialização.

---
Este README foi gerado automaticamente para facilitar o desenvolvimento e o deploy.
