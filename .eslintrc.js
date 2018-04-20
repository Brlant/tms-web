// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  env: {
    es6: true,
    browser: true
  },
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  'globals': {'Promise': true},
  'extends': 'elemefe',
  // add your custom rules here
  'rules': {
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'space-before-function-paren': [0, 'ignore'],
    'indent': [0, 'ignore'],
    'no-unused-vars': [0, 'ignore'],
    'spaced-comment': [0]
  }
};
