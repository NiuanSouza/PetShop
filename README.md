# PetShop 🐾

Plataforma completa de Pet Shop com:
- 🛍️ **Catálogo de Produtos** — alimentação, brinquedos, acessórios, higiene e medicamentos
- 🐕 **Animais à Venda** — cachorros, gatos, peixes, aves e roedores
- 💈 **Serviços** — banho, tosa, consulta veterinária, vacinação e hospedagem
- 📅 **Agendamento** — cadastre seu pet e agende serviços
- 🛒 **Carrinho de Compras** — com checkout integrado
- 🔐 **Autenticação** — registro e login de usuários

## Estrutura

```
PetShop/
├── Back-End/          # API Node.js + Express + Prisma + PostgreSQL
│   ├── prisma/        # Schema, migrations e seed
│   └── src/           # Routes, middleware, validation
├── Front-End/         # SPA vanilla HTML/CSS/JS
│   ├── app.js         # Aplicação principal com hash routing
│   ├── style.css      # Design system premium
│   └── index.html     # Shell SPA
├── render.yaml        # Deploy config (Render)
└── docker-compose.yml # Dev environment
```

## Tech Stack

| Componente | Tecnologia |
|---|---|
| Back-End | Node.js, Express 5, TypeScript |
| ORM | Prisma |
| Banco de Dados | PostgreSQL (Aiven) |
| Front-End | HTML, CSS, JavaScript (vanilla SPA) |
| Deploy | Render (Static Site + Web Service) |

## Desenvolvimento Local

```bash
# Back-End
cd Back-End
cp .env.example .env  # Configure DATABASE_URL
pnpm install
pnpm prisma:migrate
pnpm prisma:seed
pnpm dev

# Front-End
# Abrir Front-End/index.html no navegador
# Ou servir com: npx serve Front-End -p 8000
```

## Deploy

O deploy é automático via Render quando push na branch `main`.

- **Front-End**: https://petshop-front-end.onrender.com
- **Back-End**: https://petshop-back-end-wujv.onrender.com