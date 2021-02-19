module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
  },
  rules: {
    "prettier/prettier": "error",
    "class-methods-use-this": "off", // em momentos não vou querer usar this em métodos de classes
    "no-param-reassign": "off", // o sequelize vai alterar (reassign) os valores das variáveis passadas por parâmetro
    "camelcase": "off", // em momentos não vou querer usar camel case
    "no-unused-vars": ["error", { "argsIgnorePattern": "next" }], // ignora erro de variável que não vou usar
  },
};
