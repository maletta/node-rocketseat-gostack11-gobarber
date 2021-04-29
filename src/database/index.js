// classe que iniciará cada Model
import Sequelize from 'sequelize';

import User from '../app/models/User';
import File from '../app/models/File';
import Appointment from '../app/models/Appointment';

import databaseConfig from '../config/database';

const models = [User, File, Appointment];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig); // recebe a conexão

    models
      .map((model) => model.init(this.connection)) // inicia cada model com a conexão
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      ); // executa método associate se ele existir
  }
}

export default new Database();
