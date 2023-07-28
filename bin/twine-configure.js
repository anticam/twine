import { program } from 'commander';
//import pkg from '../package.json' assert { type: "json"};
import configure from '../commands/configure.js';
import util from '../lib/util.js';
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pkg = require('../package.json')

program
    .version(pkg.version)

program
    .command('consumer')
    .description('Add a Twitter API key and secret')
    .action(() => configure
        .consumer(util.extractName(pkg.name))
        .catch(util.handleError)
    )

program
    .command('account')
    .description('Authorize access to a Twitter account')
    .action(() => configure
        .account(util.extracteName(pkg.name))
        .catch(util.handleError)
    )

program
    .command('showkeys')
    .description('show consumer Key and consumer Secret')
    .action(async () => {
        let [apiKey, apiSecret] = await configure.getKeys(util.extractName(pkg.name))
        console.log('apiKey', apiKey)
        console.log('apiSecret', apiSecret)
        let [oauth_key, oauth_secret] = await configure.getOAuthKeys(util.extractName(pkg.name))
        console.log('oauth_key: ', oauth_key)
        console.log('oauth_secret: ', oauth_secret)
    })

program
    .parse(process.argv)

if (!process.argv.slice(2).length) {
    program.outputHelp()
}