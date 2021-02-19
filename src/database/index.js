// classe que iniciará cada Model
import Sequelize from 'sequelize';

import User from '../app/models/User';

import databaseConfig from '../config/database';

const models = [User];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig); // recebe a conexão

    models.map((model) => model.init(this.connection)); // inicia cada model com a conexão
  }
}

export default new Database();
