import Sequelize, { Model } from 'sequelize';

class File extends Model {
  static init(connection) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `http:${process.env.DB_HOST}:3333/files/${this.path}`;
          },
        },
      },
      {
        sequelize: connection, // necessário passar esse segundo parâmetro para init()
      }
    );

    return this;
  }
}

export default File;
