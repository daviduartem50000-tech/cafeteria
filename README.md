# Aroma & Arte — Sistema de Cafeteria

## Objetivo
Sistema completo para uma cafeteria gerenciar o cadastro de **comidas** e **bebidas**, contemplando banco de dados, backend (API REST), frontend responsivo, documentação, versionamento e publicação online — desenvolvido para o Trabalho de Recuperação.

## Tecnologias utilizadas
- **Backend:** Node.js, Express, Cors, Mysql2 (promise), Dotenv
- **Banco de dados:** MySQL
- **Frontend:** HTML5, CSS3, JavaScript puro (fetch API)
- **Deploy:** Railway
- **Versionamento:** Git / GitHub

## Estrutura de pastas
```
/backend
  /js
    server.js       -> configura o Express, serve o frontend e expõe a API
  /db
    db.js            -> pool de conexão com o MySQL
  /public
    index.html        -> página do site
    style.css          -> estilos
    a.js                -> consome a API (fetch) e controla o carrinho
  package.json
  .env.example
/database
  cafeteria.sql        -> CREATE DATABASE, CREATE TABLE e INSERTs
README.md
```

O backend serve tanto a **API** (`/api/...`) quanto o **frontend estático** (pasta `public`), então tudo roda em um único serviço no Railway.

## Modelo do banco de dados
Banco: `cafeteria`

**bebidas**: id, nome, descricao, preco, categoria, tamanho, imagem
**comidas**: id, nome, descricao, preco, categoria, tamanho, imagem

Script completo com os `CREATE TABLE` e 5 registros de exemplo em cada tabela: `database/cafeteria.sql`.

## Endpoints da API

| Método | Rota                | Descrição                  |
|--------|----------------------|------------------------------|
| GET    | /api/status           | Verifica se a API está online |
| GET    | /api/bebidas          | Lista todas as bebidas        |
| POST   | /api/bebidas          | Cadastra uma bebida           |
| DELETE | /api/bebidas/:id      | Exclui uma bebida pelo id     |
| GET    | /api/comidas          | Lista todas as comidas        |
| POST   | /api/comidas          | Cadastra uma comida           |
| DELETE | /api/comidas/:id      | Exclui uma comida pelo id     |

Exemplo de corpo para POST:
```json
{
  "nome": "Espresso Clássico",
  "descricao": "Intenso, encorpado e aromático.",
  "preco": 8.50,
  "categoria": "Quente",
  "tamanho": "Único",
  "imagem": "https://exemplo.com/imagem.jpg"
}
```

O frontend (`public/a.js`) consome esses endpoints com `fetch('/api/bebidas')` e `fetch('/api/comidas')` para montar o cardápio dinamicamente na tela.

## Como executar o projeto localmente

1. Instale o MySQL na sua máquina e rode o script `database/cafeteria.sql`:
   ```
   mysql -u root -p < database/cafeteria.sql
   ```
2. Entre na pasta do backend e instale as dependências:
   ```
   cd backend
   npm install
   ```
3. Copie `.env.example` para `.env` e ajuste usuário/senha do seu MySQL local.
4. Rode o servidor:
   ```
   npm start
   ```
5. Acesse `http://localhost:3001` no navegador — o site completo (frontend + API) já estará funcionando.

## Como realizar o deploy (Railway)

1. Suba o projeto para um repositório no **GitHub**, mantendo a estrutura acima (`backend`, `database`, `README.md` na raiz do repositório).
2. Acesse [railway.app](https://railway.app) → **New Project → Deploy from GitHub repo** e selecione o repositório.
3. No mesmo projeto, clique em **New → Database → Add MySQL** para criar o banco gerenciado pelo Railway.
4. Abra o serviço do MySQL, use o **Query Editor** (ou conecte com MySQL Workbench usando os dados do botão "Connect") e rode o conteúdo de `database/cafeteria.sql`.
5. Clique no serviço do **backend** (Node) → aba **Settings**:
   - **Root Directory:** `backend`
   - **Start Command:** `npm start`
6. Ainda no serviço do backend, aba **Variables**: confirme se ele enxerga as variáveis do MySQL (`MYSQLHOST`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`, `MYSQLPORT`). Se o banco e o backend estão no mesmo projeto Railway, isso costuma ser linkado automaticamente; se não aparecer, copie manualmente os valores do serviço MySQL.
7. O Railway detecta a porta pela variável `PORT` automaticamente — o código já usa `process.env.PORT`.
8. Clique em **Deploy**. Ao finalizar, gere o domínio público em **Settings → Networking → Generate Domain**.
9. Acesse a URL pública gerada — o site completo (com o cardápio vindo da API) deve carregar direto nela, sem precisar de nenhuma configuração extra no frontend.

## Autor
Davi Duarte
