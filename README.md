# SPA de Calendário de Tarefas
Este projeto é uma Single Page Application (SPA) que permite aos usuários gerenciar suas tarefas diárias, semanais e mensais com facilidade e eficiência. Desenvolvido pensando em performance, segurança e escalabilidade.

# Funcionalidades
 - Cadastro de Tarefas: Permite ao usuário adicionar novas tarefas com título, descrição, data e hora, e duração.
 - Edição de Tarefas: Os usuários podem modificar detalhes de tarefas existentes.
 - Remoção de Tarefas: Funcionalidade para deletar tarefas indesejadas.
 - Visualização de Tarefas: Visualize tarefas em diferentes formatos - diário, semanal e mensal.
 - Busca de Tarefas: Busque tarefas pelo título ou tags.
 - Gerenciamento de Tags: Adicione, edite e remova tags das tarefas.
 - Feriados: Integração com uma API REST de feriados para destacar dias especiais.

# Tecnologias Utilizadas
 - Frontend: React + TypeScript
 - Backend: Node.js com Express
 - Database: MongoDB
 - Autenticação: JWT para autenticação segura
 - API de Feriados: Nager.Date API

# Configuração do Projeto
Pré-requisitos
 - Node.js
 - typescript
 - MongoDB
 - Git (opcional)
 
# Instalação
Clone o repositório (se estiver usando Git):
bash
Copy code
git clone https://seu-repositorio-aqui.git
cd nome-do-repositorio
Instale as dependências para o backend e o frontend:

# Instalar dependências do backend
```bash
    cd backend
    npm install
```
# Instalar dependências do frontend
```bash
    cd ../frontend
    npm install
```

# No diretório do backend
```bash
    npm start
```
# Em outro terminal, no diretório do frontend
```bash
    npm start
```

# Ou Use o Docker para carregar e depois disponibilizar todos os serviços necessários ao funcionamento:
```bash
    docker-compose up
```

Configure as variáveis de ambiente no backend:
Copie o arquivo .env.example para .env e ajuste as configurações conforme necessário.
Inicie o servidor do backend e o cliente do frontend:
bash
Copy code


Segurança
 - Utilização de JWT para a gestão de sessões e autenticação segura.
 - Validação de input para prevenir injeções SQL e XSS.
 - Escalabilidade
 - O backend é desenvolvido em Node.js, facilitando a escalabilidade horizontal com o uso de processos do cluster ou containers Docker.
 - O MongoDB oferece alta disponibilidade e escalabilidade automática conforme necessário.
 