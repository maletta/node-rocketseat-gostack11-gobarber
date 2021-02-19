import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(connection) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        sequelize: connection, // necessário passar esse segundo parâmetro para init()
      }
    );

    this.addHook('beforeSave', async (user) => {
      console.log('password_hash sendo gerado ', user.password);
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  checkPassword(password) {
    console.log(
      'check_password ',
      password,
      ' check_password_hash ',
      this.password_hash
    );
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
