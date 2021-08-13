# 💈 Go Barber 💈
> Sim, mais um projeto rocketseat, porém adiocionando algumas ideias complementares

Go barber é uma web api rest para agendamento de clientes, baseada no curso da rocketseat, com implementações de serviços diferentes do curso para o meu exercício de programação e engenharia de sistemas.

## Funcionalidades

- 👷‍♂️ CRUD usuários (perfil cliente e prestador de serviços)
- 📅 CRUD agendamentos
- 🔊 Notificações de consulta
- 👮‍♀️ Autenticação jwt
- 📂 Gerenciamento de filas de mensagens e serviços em segundo plano

## Tecnologias

- [Javascript](https://nodejs.org/) - na plataforma Node em conjunto com Express para a criação do serviço web
- [Express](https://nodejs.org/) - framework para criação da api
- [PostgreSQL](https://www.postgresql.org/) - banco de dados principal, utilizado para guardar dados sensíveis de cada usuário e agendamentos
- [Sequelize](http://sequelize.org/) - ORM para banco de dados estruturados, implementado com postgreSQL
- [MongoDB](https://www.mongodb.com/try/download/community) - banco de dados utilizado para registrar alertas de notificações de agendamentos
- [Mongoose](https://www.npmjs.com/package/mongoose) - ORM para banco de dados não relacionais, implementado com mongoDB
- [Redis](https://redis.io/) - banco de dados em memória utilizado para cachear valores para processos em background, utilizado como enfileirador de mensagens
- [Docker](https://docs.docker.com/get-started/)  - ferramenta para gerenciar o ambiente das dependências da aplicação
- [Rabbitmq](https://www.rabbitmq.com/#getstarted) - protocolo de pub/sub para mensagens em filas, utilizado para publicar dados que serão consumidos em background por outra api



## Docker

>Os serviços utilizados pela aplicação já estão configurados em arquivos docker, mas você pode preferir baixá-los independentemente no seu sistema operacional.

Após ter o [docker instalado](https://docs.docker.com/get-docker/), entre no diretório clone deste projeto e edite os volumes para poder armazenas os dados no seu sistema operacional.

##### 🐳 Docker Linux
Altere os volumes dos serviços no arquivo docker-compose.yml.
Após isso basta executar o docker-compose no diretório do projeto:

```sh
cd node-rocketseat-gostack11-gobarber
docker-compose -f docker-compose.yml up
```

##### 🐳 Docker Windows - WSL
Altere os volumes dos serviços no arquivo docker-compose-windows-wsl.yml.
Após isso basta executar o docker-compose no diretório do projeto:

```sh
cd node-rocketseat-gostack11-gobarber
docker-compose -f docker-compose-windows-wsl.yml up
```

## Banco de dados
No seu banco de dados relacional, crie uma database com o nome que quiser e informe na variável de ambiente **DB_DATABASE**.

## Variáveis de ambiente
Após configurar os serviços com ou sem docker, é necessário informar onde esses serviços estão hospedados, a porta onde podem ser acessados e as credenciais de alguns serviços, seguindo o exemplo de variáveis de ambiente do arquivo env.sample:

```javascript
DB_HOST =
DB_DATABASE =
DB_PASSWORD =
DB_USER =
DB_MONGO_PORT =
DB_MONGO_DATABASE =
DB_MONGO_USER =
DB_MONGO_PASSWORD =
REDIS_HOST =
REDIS_PORT =
```

## Inicialização
Inicie os serviços externos com docker.

Na primeira vez que executar o projeto, instale as dependências do node com:
```sh
yarn install
```

Na primeira vez que executar o projeto, é preciso executar o script de criação das tabelas de acordo com o ORM modelado no código javascript:
```sh
yarn dev:migrate
```

Feito isso, finalmente execute a api:
```sh
yarn dev
```

## Licença

MIT

**Software livre**
