# Display the CLP/USD exchange rate over time

## Dev environment

### Tested on

* Ubuntu 18.10
* Node v10.15.2
* npm  6.9.0
* Firefox 67 / Chrome 75

### Installing and running

1. Clone Repo
1. create file `.env.local`, and add:

    `REACT_APP_SBIF_API_KEY=<api key>`, substituting `<api key>` for your API key

1. Run `npm i`
1. Run `npm start`

### Developer guidelines

* Compiler settings are strict- do not commit any code with warnings or errors!
* Do not use the null-assertion (`!`) operator!
* Linting:
  * vscode default formatter
  * Markdown linted with [markdownlint](https://github.com/DavidAnson/markdownlint)

---

## Technology choices

| Choice   |      Why      |    Potential Issues    |
|----------|---------------|------------------------|
| React    |  project requirement |
| Typescript |    increase velocity with compiler help; decrease defects; decrease cognative load | additional build tooling adds complexity |
| [create-react-app](https://facebook.github.io/create-react-app/docs/adding-typescript) | increase velocity by lowering cognative load | opinionated |
| Linux | familiarity, ease of use, pricing | may miss errors in Windows / Mac dev environments |
| [Recharts](http://recharts.org/en-US) | tested and it works, designed for React, large adoption based on npm package use and github potpularity | unfamiliar, so I might run into unknown unknowns |
| [ant design](https://ant.design/)| uniform design language, batteries included, increased velocity | opinionated |
| [moment](https://momentjs.com/)| recommended date parser for antd, large adoption| increased bundle size|

---

## Troubleshooting

### Error: `npm does not support Node.js v10.15.2`

* Problem: npm is wrong version
* Solution: `sudo npm install npm -g`

### Error: Hot reloading not working

* Problem: some limit being hit by the watcher
* Solution: `sudo echo 1048576 > /proc/sys/fs/inotify/max_user_watches`
* [Source](https://stackoverflow.com/a/42311067)

---
