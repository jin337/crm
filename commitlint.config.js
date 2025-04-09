export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
      'feat',
      'fix',
      'build',
      'revert',
      'docs',
      'style',
      'ci',
      'chore'
    ]],
    'type-empty': [2, 'never'],
    'subject-empty': [2, 'never'],
    'scope-empty': [0, 'never'],  // 不强制校验
    'body-empty': [0, 'never'],   // 不强制校验
    'footer-empty': [0, 'never']  // 不强制校验
  },
  prompt: {
    settings: {
      enableMultipleScopes: false,
      scopeEnumSeparator: ','
    },
    messages: {
      skip: '按回车跳过',
      max: '最多 %d 字符',
      min: '至少 %d 字符',
      emptyWarning: '不能为空'
    },
    questions: {
      type: {
        description: '选择提交类型（必填）',
        enum: {
          feat: { title: 'feat', description: 'feat:新增功能' },
          fix: { title: 'fix', description: 'fix:修复缺陷' },
          build: { title: 'build', description: 'build:项目打包' },
          revert: { title: 'revert', description: 'revert:回退代码 ' },
          docs: { title: 'docs', description: 'docs:文档更新' },
          style: { title: 'style', description: 'style:代码格式' },
          ci: { title: 'ci', description: 'ci:配置文件和脚本' },
          chore: { title: 'chore', description: 'chore:其他修改' },
        }
      },
      subject: {
        description: '简短描述修改（必填）',
        validate (input) {
          return !!input.trim();
        }
      },
      scope: { skip: true },  // 跳过scope
      body: { skip: true },   // 跳过body
      footer: { skip: true }  // 跳过footer
    }
  }
};
