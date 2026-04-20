# 🆘 AbrigoSeguro - Gestão de Abrigos em Tempo Real

## 1. Apresentação da Ideia
Este projeto foi desenvolvido como solução para uma situação problema sobre enchentes. A ideia surgiu da observação de que, em cenários de desastre, a informação sobre onde há vagas para acolhimento é extremamente volátil. O **AbrigoSeguro** visa centralizar e facilitar a atualização desses dados para que voluntários e desabrigados tomem decisões rápidas e seguras.

## 2. Problema Escolhido
**Caso 1 - Falta de Informação sobre Abrigos.** O projeto foca na dificuldade de encontrar locais disponíveis e evitar deslocamentos desnecessários para abrigos que já atingiram sua capacidade máxima.

## 3. Solução Proposta
Uma plataforma Full Stack que permite:
* **Cadastro rápido** de novos pontos de abrigo.
* **Visualização em tempo real** da disponibilidade de vagas.
* **Atualização simplificada** (um clique) do número de vagas por voluntários no local.
* **Filtros visuais** baseados em necessidades específicas (Aceita pets, possui cozinha).

## 4. Estrutura do Sistema

### Front-end
* **Tecnologia:** React.js (Vite)
* **Bibliotecas:** Axios (para integração com API)
* **Destaque:** Interface responsiva e interativa com feedback visual de cores para lotação.

### Back-end
* **Tecnologia:** Node.js com Express
* **Segurança:** Implementação de CORS para integração segura e Dotenv para variáveis de ambiente.
* **Regras de Negócio:** Validações de integridade (impede vagas negativas ou acima da capacidade).

### Banco de Dados
* **Tecnologia:** PostgreSQL
* **Modelo:** Tabela `abrigos` contendo metadados geográficos, de contato e de infraestrutura.

## 5. Como Rodar o Projeto

### Pré-requisitos
* Node.js instalado
* PostgreSQL rodando localmente

### Passo 1: Configurar o Banco
1. Crie um banco de dados chamado `abrigo_db`.
2. Execute o script SQL presente em `backend/src/database.sql` (ou os comandos de criação de tabela fornecidos).

### Passo 2: Configurar o Back-end
1. Entre na pasta `backend`: `cd backend`
2. Instale as dependências: `npm install`
3. Crie um arquivo `.env` com suas credenciais do Postgres.
4. Inicie o servidor: `npm start` ou `npx nodemon index.js`

### Passo 3: Configurar o Front-end
1. Entre na pasta `frontend`: `cd frontend`
2. Instale as dependências: `npm install`
3. Inicie o projeto: `npm run dev`
4. Acesse o link gerado no terminal (geralmente `localhost:5173`).

---
Desenvolvido por Isaac Gabriel - 2026.
