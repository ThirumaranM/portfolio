// module.exports = {
// 	root: true,
// 	parser: '@typescript-eslint/parser',
// 	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
// 	plugins: ['svelte3', '@typescript-eslint'],
// 	ignorePatterns: ['*.cjs'],
// 	overrides: [{ files: ['*.svelte'], processor: 'svelte3/svelte3' }],
// 	settings: {
// 		'svelte3/typescript': () => require('typescript')
// 	},
// 	parserOptions: {
// 		sourceType: 'module',
// 		ecmaVersion: 2020
// 	},
// 	env: {
// 		browser: true,
// 		es2017: true,
// 		node: true
// 	}
// };

module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	plugins: ['svelte', '@typescript-eslint'],
	extends: [
	  'eslint:recommended',
	  'plugin:@typescript-eslint/recommended',
	  'plugin:svelte/recommended',
	  'prettier'
	],
	overrides: [
	  {
		files: ['*.svelte'],
		parser: 'svelte-eslint-parser',
		parserOptions: {
		  parser: {
			ts: '@typescript-eslint/parser',
		  },
		  extraFileExtensions: ['.svelte'],
		  ecmaVersion: 2020,
		  sourceType: 'module',
		},
	  }
	],
	env: {
	  browser: true,
	  es2017: true,
	  node: true,
	}
  };
  