const customEnv = require('custom-env');

// seleciona o arquivo .env de acordo com a variável definida nos scripts do package.json
customEnv.env(process.env.NODE_ENV);

export default {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
};
