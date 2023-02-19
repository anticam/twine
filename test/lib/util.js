import chai from 'chai';
const expect = chai.expect
import dirtyChai from 'dirty-chai'
import util from '../../lib/util.js'

chai.use(dirtyChai)

// describe('the util module', () => {
//     context('the notEmptyfunction', () => {
//         it('should return true when given a string', () => {
//             expect(util.notEmpty('foo')).to.be.true
//         })
//         it('should return an error when given an empty string', () => {
//             expect(util.notEmpty('')).to.equal('This value is required')
//         })
//     })
// })
