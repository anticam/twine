import { program } from 'commander'

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pkg = require('../package.json')

import lookup from '../commands/lookup.js'
import util from '../lib/util.js'

program
    .version(pkg.version)

program
    .command('users [screen-names]')
    .description('Find users by their screen name')
    .action((names) => lookup
        .users(util.extractName(pkg.name), names)
        .catch(util.handleError)
    )

program
    .command('statuses [ids]')
    .description('Find statuses (tweets) by their ID')
    .action((ids) => lookup
        .statuses(util.extractName(pkg.name), ids)
        .catch(util.handleError)
    )

program
    .command('me')
    .description('Find me')
    .action((names) => lookup
        .me(util.extractName(pkg.name), names)
        .catch(util.handleError)
    )

program
    .parse(process.argv)

if (!process.argv.slice(2).length) {
    program.outputHelp()
}
