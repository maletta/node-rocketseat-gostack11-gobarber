// classe que iniciará cada Model
import Sequelize from 'sequelize';

import User from '../app/models/User';
import File from '../app/models/File';
import Appointments from '../app/models/Appointments';

import databaseConfig from '../config/database';

const models = [User, File, Appointments];

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
