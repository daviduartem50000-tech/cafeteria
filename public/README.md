# Cafeteria Aroma & Arte — Backend

## Objetivo
API REST para gerenciar o cadastro de **comidas** e **bebidas** da cafeteria, atendendo ao Trabalho de Recuperação.

## Tecnologias utilizadas
- Node.js
- Express
- Cors
- Mysql2 (promise)
- Dotenv

## Estrutura de pastas
```
/backend
  /js
    server.js      -> configura o Express e as rotas da API
  /db
    db.js           -> pool de conexão com o MySQL
  package.json
  .env.example
/database
  cafeteria.sql      -> CREATE DATABASE, CREATE TABLE e INSERTs
```

## Modelo do banco de dados
Banco: `cafeteria`

**bebidas**: id, nome, descricao, preco, categoria, tamanho
**comidas**: id, nome, descricao, preco, categoria, tamanho

Script completo em `database/cafeteria.sql`.

## Endpoints da API

| Método | Rota                | Descrição                  |
|--------|---------------------|-----------------------------|
| GET    | /api/bebidas         | Lista todas as bebidas      |
| POST   | /api/bebidas         | Cadastra uma bebida         |
| DELETE | /api/bebidas/:id     | Exclui uma bebida pelo id   |
| GET    | /api/comidas         | Lista todas as comidas      |
| POST   | /api/comidas         | Cadastra uma comida         |
| DELETE | /api/comidas/:id     | Exclui uma comida pelo id   |

Exemplo de corpo para POST:
```json
{
  "nome": "Espresso Clássico",
  "descricao": "Intenso, encorpado e aromático.",
  "preco": 8.50,
  "categoria": "Quente",
  "tamanho": "Único"
}
```

## Como executar o projeto localmente

1. Instale o MySQL na sua máquina e rode o script `database/cafeteria.sql` (pode usar o MySQL Workbench, DBeaver ou o terminal: `mysql -u root -p < database/cafeteria.sql`).
2. Entre na pasta do backend:
   ```
   cd backend
   npm install
   ```
3. Copie `.env.example` para `.env` e ajuste usuário/senha do seu MySQL local.
4. Rode o servidor:
   ```
   npm start
   ```
5. A API sobe em `http://localhost:3001`. Teste com `http://localhost:3001/api/bebidas`.

## Como fazer o deploy no Railway

1. Suba este projeto para um repositório no **GitHub** (o `backend` pode ser a raiz do repo, ou um repo próprio só para o backend).
2. Acesse [railway.app](https://railway.app) e crie um novo projeto: **New Project → Deploy from GitHub repo**, selecionando o repositório.
3. No mesmo projeto, clique em **New → Database → Add MySQL** para criar o banco gerenciado pelo Railway.
4. Abra o serviço do MySQL, vá em **Data** (ou use o botão "Connect") e rode o conteúdo de `database/cafeteria.sql` (ex.: pelo Query Editor do Railway, ou conectando com MySQL Workbench usando as credenciais mostradas em "Connect").
5. Volte ao serviço do **backend** (Node) e confira em **Variables** se ele já enxerga as variáveis do MySQL (`MYSQLHOST`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`, `MYSQLPORT`) — se o MySQL e o backend estão no mesmo projeto, o Railway costuma linkar isso automaticamente. Se não, adicione manualmente copiando os valores do serviço MySQL.
6. Em **Settings** do serviço backend, confirme:
   - Root Directory: `backend` (se o repo tiver outras pastas na raiz, como frontend)
   - Start Command: `npm start`
7. O Railway detecta a porta automaticamente pela variável `PORT` — o código já usa `process.env.PORT`, então não precisa mexer em nada.
8. Clique em **Deploy**. Quando terminar, o Railway gera uma URL pública (em **Settings → Networking → Generate Domain**).
9. Teste a URL pública, por exemplo: `https://SEU-PROJETO.up.railway.app/api/bebidas`.
10. Anote essa URL: é ela que o frontend (`fetch`) vai usar no lugar de `http://localhost:3001`.

## Próximo passo (frontend)
O `index.html`/`style.css` já existentes usam dados fixos no HTML. Para consumir a API, os cards de comidas e bebidas precisam ser gerados dinamicamente via `fetch('https://SUA-URL-RAILWAY/api/bebidas')` e `fetch('.../api/comidas')` dentro do `script.js`. Posso montar esse `script.js` também, se quiser.
