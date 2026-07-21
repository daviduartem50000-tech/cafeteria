# Aroma & Arte — Sistema de Cadastro de Cafeteria

## Objetivo

Sistema desenvolvido como Trabalho de Recuperação, contemplando banco de dados, backend, frontend, documentação, versionamento e publicação da aplicação. O sistema permite o gerenciamento (cadastro, listagem e exclusão) de dois tipos de produtos de uma cafeteria: **Bebidas** e **Comidas**.

## Tecnologias utilizadas

**Backend**
- Node.js
- Express
- Cors
- Mysql2 (com suporte a Promises)
- Dotenv

**Banco de Dados**
- MySQL

**Frontend**
- HTML5
- CSS3 (responsivo)
- JavaScript (Fetch API)

**Infraestrutura**
- Git / GitHub (versionamento)
- Railway (deploy do backend, do banco de dados MySQL e do frontend)

## Estrutura das pastas

```
cafeteria/
├── backend/
│   ├── js/
│   │   └── server.js        # Configuração do Express e definição das rotas da API
│   ├── db/
│   │   └── db.js             # Conexão com o MySQL (pool de conexões)
│   ├── package.json
│   └── .env.example          # Modelo das variáveis de ambiente
│
├── frontend/
│   ├── index.html             # Página principal (site da cafeteria)
│   ├── admin.html              # Painel administrativo
│   ├── style.css                # Estilos do site e do painel admin
│   ├── a.js                      # Lógica do cardápio e carrinho (index.html)
│   └── admin.js                   # Lógica de cadastro/exclusão de itens (admin.html)
│
├── cafeteria.sql               # Script de criação do banco e inserts iniciais
├── .gitignore
└── README.md
```

> Observação: o `server.js` serve os arquivos do frontend estaticamente (`express.static`), portanto o backend e o frontend rodam a partir do mesmo servidor Node quando executados localmente ou publicados juntos no Railway.

## Modelo do banco de dados

Banco de dados: `cafeteria` (nome usado localmente, conforme `.env.example`; no ambiente de deploy do Railway o serviço de MySQL provisiona o banco como `railway`, referenciado via `DATABASE_URL`).

### Tabela `bebidas`

| Campo      | Tipo          | Descrição                          |
|------------|---------------|-------------------------------------|
| id         | INT (PK, AI)  | Identificador único                 |
| nome       | VARCHAR(100)  | Nome da bebida                      |
| descricao  | VARCHAR(255)  | Descrição do produto                |
| preco      | DECIMAL(10,2) | Preço                                |
| categoria  | VARCHAR(50)   | Ex: Quente, Gelada                  |
| tamanho    | VARCHAR(50)   | Ex: Pequeno, Médio, Grande          |
| imagem     | VARCHAR(500)  | URL ou caminho da imagem do card    |

### Tabela `comidas`

| Campo      | Tipo          | Descrição                          |
|------------|---------------|-------------------------------------|
| id         | INT (PK, AI)  | Identificador único                 |
| nome       | VARCHAR(100)  | Nome da comida                      |
| descricao  | VARCHAR(255)  | Descrição do produto                |
| preco      | DECIMAL(10,2) | Preço                                |
| categoria  | VARCHAR(50)   | Ex: Doce, Salgado                   |
| tamanho    | VARCHAR(50)   | Ex: Único, Fatia, Porção            |
| imagem     | VARCHAR(500)  | URL ou caminho da imagem do card    |

O script completo de criação das tabelas e os inserts (5 registros em cada tabela) estão em [`cafeteria.sql`](./cafeteria.sql).

## Endpoints da API

Rota base: `/api`

### Status

| Método | Rota          | Descrição                          |
|--------|---------------|-------------------------------------|
| GET    | `/api/status` | Verifica se a API está online       |

### Bebidas

| Método | Rota                 | Descrição                              |
|--------|----------------------|------------------------------------------|
| GET    | `/api/bebidas`       | Lista todas as bebidas cadastradas      |
| POST   | `/api/bebidas`       | Cadastra uma nova bebida                |
| DELETE | `/api/bebidas/:id`   | Exclui uma bebida pelo id               |

**Corpo esperado no POST** (`nome` e `preco` são obrigatórios):
```json
{
  "nome": "Latte de Baunilha",
  "descricao": "Café cremoso com toque de baunilha",
  "preco": 15.00,
  "categoria": "Quente",
  "tamanho": "Médio",
  "imagem": "https://exemplo.com/foto.jpg"
}
```

### Comidas

| Método | Rota                 | Descrição                              |
|--------|----------------------|------------------------------------------|
| GET    | `/api/comidas`       | Lista todas as comidas cadastradas      |
| POST   | `/api/comidas`       | Cadastra uma nova comida                |
| DELETE | `/api/comidas/:id`   | Exclui uma comida pelo id               |

**Corpo esperado no POST** (`nome` e `preco` são obrigatórios):
```json
{
  "nome": "Croissant Francês",
  "descricao": "Manteiga pura e massa folhada",
  "preco": 12.00,
  "categoria": "Salgado",
  "tamanho": "Único",
  "imagem": "https://exemplo.com/foto.jpg"
}
```

## Como executar o projeto

### Pré-requisitos
- Node.js >= 18
- MySQL instalado localmente (ou acesso a um servidor MySQL)

### Passo a passo

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/cafeteria.git
cd cafeteria/backend
```

2. Instale as dependências:
```bash
npm install
```

3. Crie o banco de dados executando o script `cafeteria.sql` no seu MySQL local (ajuste o `CREATE DATABASE` para `cafeteria` se necessário):
```bash
mysql -u root -p < ../cafeteria.sql
```

4. Copie o arquivo de exemplo de variáveis de ambiente e preencha com seus dados locais:
```bash
cp .env.example .env
```
Variáveis usadas em ambiente local (`.env`):
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=cafeteria
DB_PORT=3306
PORT=3001
```

5. Inicie o servidor:
```bash
npm start
```
Ou, em modo desenvolvimento (com reinício automático via nodemon):
```bash
npm run dev
```

6. Acesse no navegador:
- Site: `http://localhost:3001`
- Painel administrativo: `http://localhost:3001/admin.html`

## Como realizar o deploy

O projeto foi publicado no **Railway**, utilizando três serviços dentro do mesmo projeto:

1. **Serviço de banco de dados (MySQL)**: adicionado via plugin do Railway, que provisiona automaticamente as variáveis `MYSQLHOST`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`, `MYSQLPORT` e `MYSQL_URL`/`DATABASE_URL`.

2. **Serviço de backend**: conectado ao repositório do GitHub (pasta `backend`), com deploy automático a cada push. A variável `DATABASE_URL` é referenciada a partir do `MYSQL_URL` do serviço de banco, e o `db.js` usa essa string de conexão automaticamente quando disponível.

3. **Serviço de frontend**: publica os arquivos estáticos (`index.html`, `admin.html`, `style.css`, `a.js`, `admin.js`). Como o frontend e o backend ficam em domínios diferentes no Railway, as chamadas `fetch` em `a.js` e `admin.js` apontam explicitamente para a URL completa do backend (`API_BASE`), e não para um caminho relativo.

Após o deploy, a aplicação fica acessível pela URL pública gerada pelo Railway para o serviço de frontend, e a API pode ser testada diretamente pela URL pública do serviço de backend (ex: `https://<seu-backend>.up.railway.app/api/status`).

## Autor

Trabalho de Recuperação — Cafeteria Aroma & Arte.
