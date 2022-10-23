module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  extends: ["eslint:all", "plugin:@typescript-eslint/recommended"],
  plugins: ["@typescript-eslint", "import", "sort-keys-fix"],
  ignorePatterns: ["*.cjs"],
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2020,
  },
  plugins: [
    "@typescript-eslint",
    "typescript-sort-keys",
    "import",
    "sort-keys-fix",
  ],
  env: {
    browser: true,
    es2017: true,
    node: true,
  },
  rules: {
    // 配列の改行は prettier に任せる
    "array-element-newline": "off",

    // アロー関数のワンライナーを許可する
    "arrow-body-style": ["error", "as-needed"],

    // キャメルケースを強要しない
    camelcase: "off",

    // コメントアウトの文章の初めを大文字にしない
    "capitalized-comments": "off",

    // 末尾カンマを強制
    "comma-dangle": ["error", "always-multiline"],

    // 戻り値の値を強制しない
    "consistent-return": "off",

    // デフォルト値がある引数は最後にしなくても良い
    "default-param-last": "off",

    // function がズレるので無効
    "function-call-argument-newline": ["error", "consistent"],

    // function の括弧内での改行を強制しない
    "function-paren-newline": "off",

    // 1文字の変数を許可しない
    "id-length": ["error", { exceptions: ["_", "x", "y", "a"] }],

    // ワンライナーの改行許可
    "implicit-arrow-linebreak": "off",

    // import 文はソートする
    "import/order": ["error", { alphabetize: { order: "asc" } }],

    // インデントはスペース2個分
    indent: ["error", 2],

    // 初期化するときに初期値がなくても良い
    "init-declarations": "off",

    // コメントのみ最大列無視
    "max-len": [
      "error",
      {
        code: 160,
        ignoreComments: true,
        ignoreTemplateLiterals: true,
      },
    ],

    // ファイルの最大行数を制限しない
    "max-lines": "off",

    // 関数の最大行数制限なし
    "max-lines-per-function": "off",

    "max-statements": "off",

    // 複数行用のコメント記述法を強制しない
    "multiline-comment-style": "off",

    // 三項演算子は改行してもしなくても良い
    "multiline-ternary": ["error", "never"],

    // loop の中で await 使っても良い
    "no-await-in-loop": "off",

    // アロー関数を有効にする
    "no-confusing-arrow": "off",

    // コンソール ok
    "no-console": "off",

    "no-duplicate-imports": "off",

    "no-extra-parens": "off",

    // マジックナンバーを許可する
    "no-magic-numbers": "off",

    // 演算子の混在を許可する
    "no-mixed-operators": "off",

    // process.env 使用許可
    "no-process-env": "off",

    // return の時に変数に代入できる
    "no-return-assign": "off",

    // typescript で nest した [key in object] をするため
    "no-shadow": ["error", { allow: ["key"] }],

    // 三項演算子有効
    "no-ternary": "off",

    // undefined で初期化しても良い
    "no-undef-init": "off",

    "no-undef": "off",

    // undefined 使える
    "no-undefined": "off",

    "no-use-before-define": "off",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "error",

    // object 内の改行は prettier に任せる
    "object-curly-newline": "off",

    // object の隙間を開ける
    "object-curly-spacing": ["error", "always"],

    // const 宣言をまとめない
    "one-var": "off",

    // 空行は prettier に任せる
    "padded-blocks": "off",

    // object のプロパティを取得する際に { value } = object のような書き方をしなくても良い
    "prefer-destructuring": "off",

    // object key のダブルクォーツを強制しない
    "quote-props": ["error", "as-needed"],

    // import をソートする
    "sort-imports": "off",

    // object key をソートする
    "sort-keys-fix/sort-keys-fix": "error",

    // "use strict" を強要しない
    strict: ["error", "never"],

    "typescript-sort-keys/interface": "error",
    "typescript-sort-keys/string-enum": "error",

    "no-return-await": "off",
    "spaced-comment": "off",
    "id-length": "off",
    "no-invalid-this": "off",
    "no-unused-expressions": "off",
    "class-methods-use-this": "off",
    "prefer-promise-reject-errors": "off",
    "require-await": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/ban-types": "off",
  },
};
