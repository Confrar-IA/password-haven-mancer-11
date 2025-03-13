
# Password Vault - Cofre de Senhas

Um sistema seguro para gerenciar senhas com suporte a armazenamento local ou MySQL.

## Funcionalidades

- Armazenamento de senhas com categorização
- Suporte a múltiplos usuários e grupos de permissões
- Interface intuitiva e responsiva
- Modo offline (localStorage) ou conectado a banco de dados MySQL
- Geração de senhas seguras
- Registro de atividades (logs)

## Configuração Rápida

Para instruções detalhadas de instalação e uso, consulte o [Manual de Utilização](./MANUAL.md).

### Requisitos

- Node.js (v16+)
- MySQL (para modo de banco de dados)

### Instalação

```bash
# Instalar dependências
npm install

# Iniciar servidor backend
node server.js

# Em outro terminal, iniciar frontend
npm run dev
```

### Configuração do Banco de Dados

1. Crie um banco de dados MySQL chamado `password_vault`
2. Importe o esquema do banco de dados:
   ```bash
   mysql -u USUARIO -p password_vault < src/services/storage/schema.sql
   ```
3. Configure a conexão nas configurações do aplicativo

## Tecnologias Utilizadas

- Frontend: React, TypeScript, Tailwind CSS, Shadcn/UI
- Backend: Node.js, MySQL
- Armazenamento: LocalStorage (modo offline) ou MySQL (modo conectado)

## Segurança

- O sistema suporta criptografia de senhas (implemente em ambientes de produção)
- Controle de acesso baseado em usuários e grupos
- Logging de atividades para auditoria

## Licença

Este projeto está licenciado sob a licença MIT - consulte o arquivo LICENSE para obter detalhes.
