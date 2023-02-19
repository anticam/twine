import path from 'path';
import fs from 'fs';
import chai from 'chai'
const expect = chai.expect
import dirtyChai from 'dirty-chai'
import chaiAsPromised from 'chai-as-promised'
//import inquirer from 'inquirer'
//import sinon from 'sinon'
import CredentialManager from '../../lib/credential-manager.js';

chai.use(chaiAsPromised);
chai.use(dirtyChai)

describe('the credential manager', () => {
    var creds
    before(() => {
        creds = new CredentialManager('twine-test')
    })
    it('should return credenitals when they are found', async () => {
        await creds.storeKeyAndSecret('apiKey', 'foo', 'bar')
        let [key, secret] = await creds.getKeyAndSecret('apiKey')
        expect(key).to.equal('foo')
        expect(secret).to.equal('bar')
    })
    it('should reject when no credentials are found', async () => {
        await creds.clearKeyAndSecret('apiKey')
        expect(creds.getKeyAndSecret('apiKey')).to.be.rejected()
    })

    after((done) => {
        fs.unlink(path.join(process.env.HOME, '.config', 'configstore', 'twine-test.json'), done)

    })
})