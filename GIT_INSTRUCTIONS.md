# Instruções do Projeto e Configuração do Git

Este documento contém o conteúdo recomendado para o arquivo `.gitignore` do projeto, instruções de uso e um guia passo-a-passo para reescrever o histórico do Git retroativamente conforme a nova proposta do PetShop.

## 1. Arquivo `.gitignore`

Crie um arquivo `.gitignore` na raiz do projeto com o seguinte conteúdo:

```gitignore
node_modules/
dist/
build/
.env
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
.pnpm-store

# Prisma
Back-End/prisma/*.db
Back-End/prisma/*.db-journal

# Cypress
cypress/videos/
cypress/screenshots/

# Editor directories and files
.idea
.vscode/
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
```

## 2. Instruções de Desenvolvimento

O projeto foi reformulado para utilizar estritamente o `pnpm`. **Nunca utilize `npm`**.

### Instalação
```bash
# Na pasta Back-End
cd Back-End
pnpm install

# Na pasta Front-End (se houver dependências de teste, como Cypress)
cd ../Front-End
pnpm install
```

### Rodando Localmente
```bash
# Back-End (inicia o servidor de desenvolvimento)
cd Back-End
pnpm dev

# Front-End (inicia servidor estático, ex: via http-server)
cd Front-End
pnpm dlx http-server . -p 8000
```

## 3. Guia: Reescrevendo o Histórico do Git Retroativamente

Você solicitou a alteração retroativa do projeto e de seus commits para refletir a nova proposta arquitetônica do PetShop (mudança de loja de animais para serviços, produtos, etc.).

Como as mudanças do código já foram aplicadas no diretório de trabalho, podemos fazer um _soft reset_ para agrupar as alterações em novos commits lógicos, ou usar _rebase interativo_ para alterar commits passados. 

### Opção A: Achatar tudo em um novo commit inicial (Recomendado se o histórico anterior não for mais útil)

Se os commits antigos refletem a arquitetura antiga que não existe mais e você quer um histórico limpo:

1. Apague o histórico local do Git e crie um novo:
```bash
rm -rf .git
git init
git add .
git commit -m "feat: versão inicial da nova plataforma PetShop (produtos, serviços, agendamentos)"
```

2. Force o envio para o repositório remoto (CUIDADO: isso sobrescreve o histórico no servidor):
```bash
git remote add origin <URL_DO_SEU_REPOSITORIO>
git push -u origin master --force
# ou origin main, dependendo do nome da branch
```

### Opção B: Fazer um Soft Reset para o primeiro commit (Preserva a data original, mas junta as mudanças)

```bash
# Volta o ponteiro do git para o primeiro commit sem alterar os arquivos no disco
git reset $(git rev-list --max-parents=0 HEAD) --soft

# Adiciona todas as mudanças atuais
git add .

# Faz um commit substituindo as mudanças retroativamente
git commit --amend -m "feat: reformulação completa da arquitetura do PetShop (serviços e produtos)"

# Força o push
git push --force
```

### Opção C: Usar Rebase Interativo (Para alterar commits específicos)

Se quiser reescrever as mensagens dos commits antigos para parecer que eles foram construídos com a nova proposta desde o início:

1. Inicie um rebase interativo desde o primeiro commit:
```bash
git rebase -i --root
```
2. Mude a palavra `pick` para `reword` ou `edit` nos commits que deseja alterar.
3. Se escolheu `edit`, o rebase vai pausar no commit. Você pode aplicar as mudanças do novo código ali:
```bash
git add .
git commit --amend
git rebase --continue
```
4. Finalize forçando o envio:
```bash
git push --force
```
