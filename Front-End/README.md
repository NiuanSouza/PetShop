# Front‑End (Static HTML/JS/CSS)

## Pré‑requisitos
- Navegador moderno (Chrome, Firefox, Edge…)
- **Node.js** (opcional) apenas para instalar dependências de desenvolvimento (Cypress, scripts).

## Instalação (opcional – para testes)
```bash
cd Front-End
pnpm install   # instala Cypress e scripts de teste
```

## Executar a aplicação
A UI é servida como arquivos estáticos. Você pode usar qualquer servidor HTTP:
```bash
# usando Python (já instalado)
python -m http.server 8080   # abre em http://localhost:8080
```
ou
```bash
# usando pnpm http‑server
npx http-server . -p 8080
```

## Testes end‑to‑end (Cypress)
```bash
pnpm run cypress:run   # roda os testes em modo headless
```

## Build (opcional)
Se quiser gerar uma versão otimizada para produção, basta copiar todo o conteúdo da pasta `Front-End/` para um diretório servido pelo seu servidor web (NGINX, Apache, etc.). Não há bundling adicional.

---
Este README foi gerado automaticamente para facilitar o desenvolvimento e a execução da interface do PetShop.
