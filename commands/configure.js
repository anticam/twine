import inquirer from 'inquirer'
import CredentialManager from '../lib/credential-manager.js';
import util from '../lib/util.js';

const configure = {
    async consumer(name) {
        let creds = new CredentialManager(name)
        let answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'key',
                message: 'configure.js - Enter your Twitter API Key:',
                validate: util.notEmpty
            },
            {
                type: 'password',
                name: 'secret',
                message: 'Enter your Twitter API Secret:',
                validate: util.notEmpty
            }
        ])
        await creds.storeKeyAndSecret(answers.key, answers.secret)
    }
}

export default configure