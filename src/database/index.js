// classe que iniciará cada Model
import Sequelize from 'sequelize';
import mongoose from 'mongoose';

import User from '../app/models/User';
import File from '../app/models/File';
import Appointment from '../app/models/Appointment';

import databaseConfig from '../config/database';

const models = [User, File, Appointment];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig); // recebe a conexão

    models
      .map((model) => model.init(this.connection)) // inicia cada model com a conexão
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      ); // executa método associate se ele existir
  }

  mongo() {
    const stringUrl =
      `mongodb://` +
      `${process.env.DB_MONGO_USER}:${process.env.DB_MONGO_PASSWORD}@` +
      `${process.env.DB_HOST}:${process.env.DB_MONGO_PORT}/` +
      `${process.env.DB_MONGO_DATABASE}` +
      `?authSource=admin`;
    // query authSource=admin é usada porque não criei usuário para o banco gobarber
    // seria preciso relacionar um usuário ao banco gobarber com privilégios
    // estou utilizando o usuário root especificado no docker-compose
    this.mongoConnection = mongoose.connect(stringUrl, {
      useNewUrlParser: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
    });
  }
}

export default new Database();
