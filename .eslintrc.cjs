module.exports = {
	rules: {
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/no-empty-function": "off",
		"@typescript-eslint/ban-types": "off",
		"@typescript-eslint/no-unused-vars": [
			"error",
			{
				argsIgnorePattern: "^_",
				varsIgnorePattern: "^_",
				caughtErrorsIgnorePattern: "^_"
			}
		],
		"@typescript-eslint/no-empty-interface": "off",
		"@typescript-eslint/explicit-function-return-type": "error",
		"no-async-promise-executor": "off",
		"no-useless-catch": "off"
	},
	parser: "@typescript-eslint/parser",
	extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
	plugins: ["@typescript-eslint"],
	env: {
		node: true
	}
};
