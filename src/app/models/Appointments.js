import Sequelize, { Model } from 'sequelize';

class Appointments extends Model {
  static init(sequelize) {
    super.init(
      {
        date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  // atributo user_id criado automaticamente na classe devido ao método belongsTo
  // atributo provdider_id criado automaticamente na classe devido ao método belongsTo
  static associate(models) {
    // obrigatório ter apelido as porque tem dois relaciomentos com a mesma tabela
    // assim o sequelize não se perder de qual relaciomento utilizar
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.User, { foreignKey: 'provider_id', as: 'provider' });
  }
}

export default Appointments;
