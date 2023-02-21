import chai from 'chai';
const expect = chai.expect
import dirtyChai from 'dirty-chai'
import sinon from 'sinon'
import axios from 'axios'
import Twitter from '../../lib/Twitter.js'
import OAuth from 'axios-oauth-1.0a'

chai.use(dirtyChai)

describe('the twitter module', () => {
    var twitter
    before(() => {
        twitter = new Twitter('key', 'secret')
    })
    it('should set a token', () => {
        twitter.setToken('abc', '123')
        expect(twitter.token).to.include({ key: 'abc' })
        expect(twitter.token).to.include({ secret: '123' })
    })
    it('should invoke GET APIs', async () => {
        sinon.stub(axios, 'get').resolves({ data: 'foo' })
        let response = await twitter.get('/api')
        expect(response).to.be.equal('foo')
        axios.get.restore()
    })
    it('should invoket POST APIs', async () => {
        sinon.stub(axios, 'post').resolves({ data: 'bar' })
        let response = await twitter.post('/api', 'stuff')
        expect(response).to.equal('bar')
        axios.post.restore()
    })

})