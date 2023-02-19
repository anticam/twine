import fs from 'fs'
import path from 'path'
import chai from 'chai'
const expect = chai.expect
import dirtyChai from 'dirty-chai'
import inquirer from 'inquirer';
import sinon from 'sinon';
import configure from '../../commands/configure.js';
import CredentialManager from '../../lib/credential-manager.js';

chai.use(dirtyChai)

describe('the configuration module', () => {
    var creds
    before(() => {
        creds = new CredentialManager('twine-test')
    })

    it('should add credetnials when none are found', async () => {
        sinon.stub(inquirer, 'prompt').resolves({ key: 'one', secret: 'two' })
        await configure.consumer('twine-test')
        let [key, secret] = await creds.getKeyAndSecret()
        expect(key).to.equal('one')
        expect(secret).to.equal('two')
        expect(inquirer.prompt.calledOnce).to.be.true
        inquirer.prompt.restore()
    })

    it('should overwrite existing credentials', async () => {
        sinon.stub(inquirer, 'prompt').resolves({ key: 'three', secret: 'four' })
        await configure.consumer('twine-test')
        let [key, secret] = await creds.getKeyAndSecret()
        expect(key).to.equal('three')
        expect(secret).to.equal('four')
        expect(inquirer.prompt.calledOnce).to.be.true()
        inquirer.prompt.restore()
    })

    after((done) => {
        fs.unlink(path.join(process.env.HOME, '.config', 'configstore', 'twine-test.json'), done)

    })
})