module.exports = {
  parser: 'babel-eslint',
  extends: ['plugin:prettier/recommended'],
  plugins: ['prettier'],
  env: {
    browser: true,
  },
  rules: {
    'import/no-extraneous-dependencies': 'off',
    'no-console': 'off',
  },
};
