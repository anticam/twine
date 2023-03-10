import fs from 'fs'
import path from 'path'
import chai from 'chai'
const expect = chai.expect
import dirtyChai from 'dirty-chai'
import inquirer from 'inquirer';
import sinon from 'sinon';
import configure from '../../commands/configure.js';
import CredentialManager from '../../lib/credential-manager.js';
import Twitter from '../../lib/twitter.js';
import util from '../../lib/util.js';

chai.use(dirtyChai)

describe('the configuration module', () => {
    var creds
    var sandbox
    before(() => {
        creds = new CredentialManager('twine-test')
    })

    beforeEach(() => {
        sandbox = sinon.sandbox.create()
    })

    it('should add credentials when none are found', async () => {
        sandbox.stub(inquirer, 'prompt').resolves({ key: 'one', secret: 'two' })
        await configure.consumer('twine-test')
        let [key, secret] = await creds.getKeyAndSecret('apiKey')
        expect(key).to.equal('one')
        expect(secret).to.equal('two')
        expect(inquirer.prompt.calledOnce).to.be.true()
    })

    it('should overwrite existing credentials', async () => {
        sandbox.stub(inquirer, 'prompt').resolves({ key: 'three', secret: 'four' })
        await configure.consumer('twine-test')
        let [key, secret] = await creds.getKeyAndSecret('apiKey')
        expect(key).to.equal('three')
        expect(secret).to.equal('four')
        expect(inquirer.prompt.calledOnce).to.be.true()
    })

    it('should add an account', async () => {
        sandbox.stub(CredentialManager.prototype, 'getKeyAndSecret')
            .resolves(['key', 'secret'])
        sandbox.stub(Twitter.prototype, 'post')
            .onFirstCall().resolves('oauth_token=abc&oauth_token_secret=def')
            .onSecondCall().resolves('oauth_token=ghi&oauth_token_secret=jkl')
        sandbox.stub(Twitter.prototype, 'get').resolves({ screen_name: 'foo' })
        sandbox.stub(inquirer, 'prompt')
            .onFirstCall().resolves({ constinue: '' })
            .onSecondCall().resolves({ pin: '1234' })
        sandbox.stub(util, 'openBrowser').returns('')
        sandbox.spy(console, 'log')
        await configure.account('twine-test')
        CredentialManager.prototype.getKeyAndSecret.restore()
        let [token, secret] = await creds.getKeyAndSecret('accountToken')
        expect(token).to.equal('ghi')
        expect(secret).to.equal('jkl')
        expect(console.log.calledWith('Account "foo" successfully added')).to.be.true()


    })

    afterEach(() => {
        sandbox.restore()
    })

    after((done) => {
        fs.unlink(path.join(process.env.HOME, '.config', 'configstore', 'twine-test.json'), done)

    })
})