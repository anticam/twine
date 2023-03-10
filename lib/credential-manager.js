//const Configstore = require('configstore');
//const inquirer = require('inquirer');

import Configstore from 'configstore';
// inquirer from 'inquirer';
import keytar from 'keytar';

export class CredentialManager {
    constructor(name) {
        this.conf = new Configstore(name)
        this.service = name
    }

    async getKeyAndSecret(prop) {
        let key = this.conf.get(prop)
        if (!key) {
            throw new Error('API Key not found')
        }
        let secret = await keytar.getPassword(this.service, key)
        return [key, secret]
    }

    async storeKeyAndSecret(prop, key, secret) {
        this.conf.set(prop, key)
        await keytar.setPassword(this.service, key, secret)
    }

    async clearKeyAndSecret(prop) {
        let key = this.conf.get(prop)
        this.conf.delete(prop)
        await keytar.deletePassword(this.service, key)
    }
}


export default CredentialManager
