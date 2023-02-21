import opn from 'opn'

const notEmpty = (input) => (input === '' ? 'This value is required' : true)
const openBrowser = (url) => opn(url)

export default { notEmpty, openBrowser }