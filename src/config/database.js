// utiliza module.exports porque vai ser acessado pelo sequelize-cli ele não reconhecer o novo import/export

module.exports = {
  dialect: 'postgres',
  host: process.env.DB_HOST, // '192.168.0.26',
  username: process.env.DB_USER, // 'postgres', //  process.env.DB_USER,
  password: process.env.DB_PASSWORD, // 'docker',
  database: process.env.DB_DATABASE,
  define: {
    // algumas configurações para a conexão
    timestamps: true, // garante que terá uma coluna createdAt updatedAt
    underscored: true, // não usara padrão camelcase para criar tabela SellinU30 => sellin_u30
    underscoredAll: true, // não usará camelcase para nome de colunas e relacionamentos
  },
};
