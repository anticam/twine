import through2 from 'through2';
import ps from 'promise-streams';
import split from 'split2';
import parallel from 'parallel-transform';
import from from 'from2-array';
import JSONStream from 'JSONStream';
import CredentialManager from '../lib/credential-manager.js';
import Twitter from '../lib/twitter.js'
import batch from '../lib/batch-stream.js'



const doLookup = async function (api, name, items, inout = process) {
    let creds = new CredentialManager(name)
    let [key, secret] = await creds.getKeyAndSecret('consumer')
    let twitter = new Twitter(key, secret)
    let [token, tokenSecret] = await creds.getKeyAndSecret('account')
    twitter.setToken(token, tokenSecret)
    return ps.pipeline(
        items ? from.obj(items.split(',')) : inout.stdin.pipe(split()),
        batch(100),
        parallel(2, function (data, next) {
            twitter.get(`${api}${data.join(',')}`)
                .then((results) => next(null, results))
                .catch(next)
        }),
        through2.obj(function (chunk, enc, next) {
            chunk.forEach((c) => this.push(c))
            next()
        }),
        JSONStream.stringify(),
        inout.stdout
    )
}

const doLookup2 = async function (api, name, items, inout = process) {
    let creds = new CredentialManager(name)
    //console.log(`creds name: ${name}`)

    let [key, secret] = await creds.getKeyAndSecret('consumer')
    //console.log(`key: ${key} secret: ${secret}`)

    let twitter = new Twitter(key, secret)
    let [token, tokenSecret] = await creds.getKeyAndSecret('account')
    //console.log(`key: ${token} secret: ${tokenSecret}`)

    twitter.setToken(token, tokenSecret)


    const result = await twitter.get(`${api}`)
    //process.stdout.write(result)
    console.log(result)



}

const lookup = {
    async users(...args) {
        await doLookup('1.1/users/lookup.json?screen_name=', ...args)
    },

    async statuses(...args) {
        await doLookup('1.1/statuses/lookup.json?id=', ...args)
    },

    async me(...args) {
        // https://developer.twitter.com/en/docs/api-reference-index#twitter-api-v2
        // https://developer.twitter.com/en/docs/twitter-api/users/lookup/api-reference/get-users-me#tab0

        await doLookup2('2/users/me', ...args) // works
    }

}

export default lookup