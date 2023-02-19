#!/usr/bin/env node

import { program } from 'commander'
import CredentialManager from '../lib/credential-manager.js';
import pkg from '../package.json' assert { type: "json"}

program
    .version(pkg.version)
    .command('configure', 'configure Twitter-related credentials')
    .parse(process.argv)




// //const CredentialManager = require('../lib/credential-manager');

// async function main() {
//     const creds = new CredentialManager('twine')
//     let [key, secret] = await creds.getKeyAndSecret()
//     console.log(key, secret)
// }

// main().catch(console.error)