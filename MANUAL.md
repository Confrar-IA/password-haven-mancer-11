
# Manual de Utilização - Password Vault

Este manual fornece instruções detalhadas para a instalação e execução do sistema Password Vault (Cofre de Senhas) em um servidor local, com o banco de dados MySQL instalado na mesma máquina.

## Índice
1. [Pré-requisitos](#pré-requisitos)
2. [Instalação](#instalação)
3. [Configuração do Banco de Dados](#configuração-do-banco-de-dados)
4. [Configuração do Servidor](#configuração-do-servidor)
5. [Inicialização do Sistema](#inicialização-do-sistema)
6. [Uso do Sistema](#uso-do-sistema)
7. [Solução de Problemas](#solução-de-problemas)

## Pré-requisitos

Antes de iniciar a instalação, certifique-se de ter os seguintes componentes instalados:

- **Node.js** (versão 16 ou superior) - [Download](https://nodejs.org/)
- **MySQL Server** (versão 5.7 ou superior) - [Download](https://dev.mysql.com/downloads/mysql/)
- **Git** (opcional, para clonar o repositório) - [Download](https://git-scm.com/downloads)

## Instalação

1. Clone ou baixe o repositório do Password Vault:

```bash
git clone [URL_DO_REPOSITÓRIO]
cd password-vault
```

2. Instale as dependências:

```bash
npm install
```

## Configuração do Banco de Dados

1. Acesse o MySQL e crie um novo banco de dados:

```sql
CREATE DATABASE password_vault;
```

2. Configure um usuário e senha para o MySQL (ou use o usuário root apenas para testes):

```sql
CREATE USER 'admin'@'localhost' IDENTIFIED BY 'senha_segura';
GRANT ALL PRIVILEGES ON password_vault.* TO 'admin'@'localhost';
FLUSH PRIVILEGES;
```

3. Importe o esquema do banco de dados (dentro da pasta do projeto):

```bash
mysql -u admin -p password_vault < src/services/storage/schema.sql
```

## Configuração do Servidor

1. Abra o arquivo `server.js` no diretório raiz do projeto e verifique as configurações de conexão com o banco de dados:

```javascript
// Configuração do Banco de Dados
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'senha_segura',
  database: process.env.DB_NAME || 'password_vault'
};
```

2. Você pode modificar essas configurações diretamente no código ou definir variáveis de ambiente para sobrescrever os valores padrão:

```bash
# No Linux/Mac
export DB_HOST=localhost
export DB_PORT=3306
export DB_USER=admin
export DB_PASSWORD=senha_segura
export DB_NAME=password_vault
export PORT=3000

# No Windows (Command Prompt)
set DB_HOST=localhost
set DB_PORT=3306
set DB_USER=admin
set DB_PASSWORD=senha_segura
set DB_NAME=password_vault
set PORT=3000

# No Windows (PowerShell)
$env:DB_HOST="localhost"
$env:DB_PORT=3306
$env:DB_USER="admin"
$env:DB_PASSWORD="senha_segura"
$env:DB_NAME="password_vault"
$env:PORT=3000
```

## Inicialização do Sistema

1. Inicie o servidor backend:

```bash
node server.js
```

Você deverá ver a mensagem: "Servidor rodando na porta 3000" (ou o número da porta que você configurou).

2. Em outro terminal, inicie a aplicação frontend:

```bash
npm run dev
```

A aplicação frontend estará disponível em `http://localhost:8080` por padrão.

## Uso do Sistema

1. Acesse o frontend no navegador: `http://localhost:8080`

2. Na página de configurações, ajuste o modo de armazenamento para MySQL:
   - Clique no botão de toggle "Usar Banco de Dados MySQL"
   - Verifique se as configurações de conexão estão corretas:
     - Nome do Banco: password_vault
     - Host: localhost
     - Porta: 3306
     - Usuário: admin (ou o usuário que você configurou)
     - Senha: senha_segura (ou a senha que você configurou)
   - Clique em "Salvar Configurações"

3. O sistema irá verificar a conexão e começar a utilizar o banco de dados MySQL.

## Funções Principais

### Gerenciamento de Categorias
- Adicione categorias como "Redes Sociais", "Bancos", "E-mails", etc.

### Gerenciamento de Senhas
- Adicione senhas com título, usuário, senha e URL
- Atribua senhas a categorias
- Visualize, edite e exclua senhas

### Geração de Senhas
- Use o gerador de senhas para criar senhas fortes e seguras

### Gerenciamento de Usuários
- Crie e gerencie usuários com diferentes níveis de acesso

## Solução de Problemas

### Problemas de Conexão com o Banco de Dados

Se o sistema mostrar mensagens de erro como "Falha na comunicação com o servidor. Usando modo de simulação":

1. Verifique se o servidor MySQL está em execução:
```bash
# No Linux
sudo systemctl status mysql

# No Mac
brew services list

# No Windows
Se estiver usando XAMPP ou similar, verifique o painel de controle
```

2. Confirme que as credenciais do banco de dados estão corretas na interface de configurações do aplicativo.

3. Tente reiniciar o servidor backend.

### Verificação da API

Para testar se a API do servidor está funcionando corretamente:

```bash
curl http://localhost:3000/api/status
```

Você deve receber uma resposta JSON indicando que a conexão com o banco de dados está funcionando.

### Logs e Depuração

Se encontrar problemas, verifique os logs no console do servidor backend e no console do navegador (F12) para identificar erros específicos.

## Considerações de Segurança

1. Em ambiente de produção, sempre use senhas fortes para o banco de dados.
2. Considere configurar HTTPS para o frontend e backend em produção.
3. Não armazene senhas em texto plano no banco de dados em um ambiente real.
4. Implemente autenticação segura para acesso ao sistema.

---

Para quaisquer problemas não abordados neste manual, consulte a documentação oficial ou entre em contato com o suporte.
