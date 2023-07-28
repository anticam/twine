#!/usr/bin/env node

import { program } from 'commander'
//import CredentialManager from '../lib/credential-manager.js';
//import pkg from '../package.json' assert { type: "json"}
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pkg = require('../package.json')
import updateNotifier from 'update-notifier';

updateNotifier({ pkg }).notify({ isGlobal: true })

program
    .version(pkg.version)
    .command('configure', 'configure Twitter-related credentials')
    .command('lookup', 'lookup thinks on Twitter')
    .parse(process.argv)
