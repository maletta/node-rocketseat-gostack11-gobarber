import Sequelize, { Model } from 'sequelize';
import { isBefore, subHours } from 'date-fns';

class Appointments extends Model {
  static init(sequelize) {
    super.init(
      {
        date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
        past: {
          type: Sequelize.VIRTUAL, // campo não existe na tabela, somente no js
          get() {
            // verifica se já é uma data passada
            return isBefore(this.date, new Date());
          },
        },
        cancelable: {
          type: Sequelize.VIRTUAL,
          get() {
            // verificar se é cancelável
            // pode cancelar até 2 horas antes
            return isBefore(new Date(), subHours(this.date, 2));
          },
        },
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
