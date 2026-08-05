export default {
  extends: ['@commitlint/config-conventional'],

  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'refactor', 'perf', 'test', 'docs', 'chore', 'build', 'ci', 'revert'],
    ],

    'scope-empty': [0, 'never'],
    'scope-case': [2, 'always', 'lower-case'],

    'subject-empty': [2, 'never'],
    'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
    'subject-full-stop': [2, 'never', '.'],

    'header-max-length': [2, 'always', 72],
  },
};
