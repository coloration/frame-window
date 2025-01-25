import antfu from '@antfu/eslint-config'

export default antfu(
  {
    unocss: true,
    formatters: true,
    ignores: ['**/*.js'],
    rules: {
      'no-console': 'off',
      'node/prefer-global/process': 'off'
    },
  },
)
