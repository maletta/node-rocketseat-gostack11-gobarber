import Sequelize, { Model } from 'sequelize';

class File extends Model {
  static init(connection) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
      },
      {
        sequelize: connection, // necessário passar esse segundo parâmetro para init()
      }
    );

    return this;
  }
}

export default File;
