//import opn from 'opn'
import open from 'open'
import chalk from 'chalk';

const notEmpty = (input) => (input === '' ? 'This value is required' : true)
const openBrowser = (url) => open(url)
const handleError = (message) => {
    console.error(chalk.redBright(message))
    process.exitCode = 1
}

const extractName = (pkgName) => pkgName.substr(pkgName.indexOf('/') + 1)

export default { notEmpty, openBrowser, handleError, extractName }