/* eslint-env node */
// require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  extends: ['plugin:vue/vue3-essential', 'eslint:recommended', '@vue/eslint-config-typescript', '@vue/eslint-config-prettier', 'plugin:prettier/recommended', 'plugin:vue/essential'],
  settings: {
    'import/extensions': ['.js', '.ts', '.vue', '.es6', '.sass', '.scss', '.json']
  },
  parserOptions: {
    ecmaVersion: 'latest'
  },
  ignorePatterns: ['*.css', '*.html'],
  rules: {
    'vue/multi-word-component-names': 'off',
    'vue/no-reserved-component-names': 'off',
    'vue/no-v-model-argument': 'off',
    'vue/no-multiple-template-root': 'off',
    'vue/component-tags-order': [
      'error',
      {
        order: ['script', 'template', 'style']
      }
    ]
  }
};
