import Configstore from 'configstore';
import keytar from 'keytar';

export class CredentialManager {
    constructor(name) {
        this.conf = new Configstore(name)
        this.service = name
    }

    async getKeyAndSecret(prop) {
        let key, secret
        let envKeyName = `${this.service.toUpperCase()}_${prop.toUpperCase()}_KEY`
        if (envKeyName in process.env) {
            key = process.env[envKeyName]
        } else {
            key = this.conf.get(`keys.${prop}`)
        }

        //let key = this.conf.get(`keys.${prop}`)
        if (!key) {
            throw new Error(`Missing ${prop} key -- have you run 'configure ${prop}'?`)
        }

        let envSecretName = `${this.service.toUpperCase()}_${prop.toUpperCase()}_SECRET`
        if (envSecretName in process.env) {
            secret = process.env[envSecretName]
        } else {
            secret = await keytar.getPassword(this.service, key)
        }
        //let secret = await keytar.getPassword(this.service, key)
        if (!secret) {
            throw new Error(`Mssing ${prop} secret -- have you run 'configure ${prop}?'`)
        }
        return [key, secret]
    }

    async storeKeyAndSecret(prop, key, secret) {
        this.conf.set(`keys.${prop}`, key)
        await keytar.setPassword(this.service, key, secret)
    }

    async clearKeyAndSecret(prop) {
        let key = this.conf.get(`keys.${prop}`)
        this.conf.delete(`keys.${prop}`)
        await keytar.deletePassword(this.service, key)
    }

    async clearAll() {
        for (let prop of Object.keys(this.conf.get('keys'))) {
            await this.clearKeyAndSecret(prop)
        }
    }
}


export default CredentialManager
