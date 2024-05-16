module.exports = {
  env: {
    node: true
  },
  extends: ["@paciolan/react"],
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2020
  },
  rules: {
    "react/prop-types": 0
  },
  ignorePatterns: ["coverage/*", "dist/*"]
};
