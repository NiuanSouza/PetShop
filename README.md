# PetShop

Criação de um sistema de PetShop seguindo o padrão MVC usando PHP.

## 💻 Tecnologias e Arquitetura

Este projeto foi construído utilizando as seguintes tecnologias e conceitos:

* **Linguagem:** PHP.
* **Padrão:** MVC (Model-View-Controller).
* **Autoload:** Composer (PSR-4 para `App\` e `Core\`).
* **Roteamento:** Implementação de roteador customizado (`Core\Router`).
* **Banco de Dados:** MySQL com conexão via PDO (`Core\Database`).
* **Frontend:** HTML, CSS e JavaScript com a biblioteca Bootstrap v5.3.3.

## 📂 Estrutura do Projeto

O projeto segue uma estrutura MVC simplificada, com os seguintes diretórios principais:

| Diretório | Descrição |
| :--- | :--- |
| `app/Controllers` | Contém a lógica de controle da aplicação (e.g., `PetController`, `Controller` base). |
| `app/Models` | Define as classes de domínio (`Pet`, `Prontuario`, `Raca`, `Especie`). |
| `app/Views` | Contém os arquivos HTML e PHP para apresentação (`navbar.php`, `index.php`). |
| `core/` | Contém as classes essenciais do framework (`Router.php`, `Database.php`). |
| `public/` | O ponto de entrada da aplicação (`index.php`). |
| `server/` | Contém o script SQL para criação do banco de dados e dados iniciais. |

## ⚙️ Configuração e Instalação

Siga os passos abaixo para configurar e rodar o projeto em seu ambiente local.

### 1. Requisitos

* Servidor web (e.g., Apache) com suporte a PHP.
* MySQL.
* Composer instalado.

### 2. Configuração do Servidor Web (`.htaccess`)

O projeto utiliza URLs amigáveis, reescrevendo requisições para o arquivo `public/index.php`. O arquivo `.htaccess` está configurado para uma base `/PetShop/public/`:

```apache
RewriteEngine On
RewriteBase /PetShop/public/
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^(.*)$ index.php?url=$1 [QSA,L]