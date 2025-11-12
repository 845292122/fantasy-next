module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 允许的类型
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'chore', 'revert']
    ],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'subject-empty': [2, 'never'],
    'subject-max-length': [2, 'always', 72],
    // 允许中文与任意大小写: 关闭 subject 大小写限制
    'subject-case': [0],
    // 可选: 关闭 scope 限制
    'scope-empty': [0],
    // 头部最大长度
    'header-max-length': [2, 'always', 100]
  }
}
