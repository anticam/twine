import chai from 'chai'
const expect = chai.expect
import chaiAsPromised from 'chai-as-promised'
import dirtyChai from 'dirty-chai'
import sinon from 'sinon'
import lookup from '../../commands/lookup.js'
import CredentialManager from '../../lib/credential-manager.js'
import Twitter from '../../lib/twitter.js'
import { ReadableMock, WritableMock } from 'stream-mock'

chai.use(chaiAsPromised)
chai.use(dirtyChai)

describe('the lookup module', () => {
    var sandbox
    beforeEach(() => {
        sandbox = sinon.sandbox.create()
    })

    context('users', () => {
        beforeEach(() => {
            sandbox.stub(CredentialManager.prototype, 'getKeyAndSecret')
                .resolves(['key', 'secret'])
            sandbox.stub(Twitter.prototype, 'get')
                .callsFake((url) => {
                    let response = url.slice(url.indexOf('=') + 1)
                        .split(',').map((n) => ({ screen_name: n }))
                    return Promise.resolve(response)
                })
        })
    })


    it('should lookup users piped to stdin', (done) => {
        let stdin = new ReadableMock(['foo\n', 'bar\n'], { objectMode: true })
        let stdout = new WritableMock()
        lookup.users('twine-test', null, { stdin, stdout })
        stdout.on('finish', () => {
            expect(JSON.parse(stdout.data))
                .to.deep.equal([{ screen_name: 'foo' }, { screen_name: 'bar' }])
            done()
        })
    })

    it('should lookup more than 100 users piped to stdin', (done) => {
        let users = [...Array(101).keys()].map((n) => `foo${n}`)
        let stdin = new ReadableMock(users.map((u) => `${u}\n`), { objectMode: true })
        let stdout = new WritableMock()
        lookup.users('twine-test', null, { stdin, stdout })
        stdout.on('finish', () => {
            expect(JSON.parse(stdout.data))
                .to.deep.equal(users.map((u) => ({ screen_name: u })))
            done()
        })
    })


    it('should lookup users on the command line', (done) => {
        let stdout = new WritableMock()
        lookup.users('twine-test', 'foo,bar', { stdout })
        stdout.on('finish', () => {
            expect(JSON.parse(stdout.data))
                .to.deep.equal([{ screen_name: 'foo' }, { screen_name: 'bar' }])
            done()
        })
    })

    it('should reject on error', async () => {
        Twitter.prototype.get.restore()
        sandbox.stub(Twitter.prototype, 'get').rejects(new Error('Test Error'))
        let stdout = new WritableMock()
        await expect(lookup.users('twine-test', 'foo', { stdout })).to.be.rejectedWith('Test Error')
    })


    afterEach(() => {
        sandbox.restore()
    })
})