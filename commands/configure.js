import querystring from 'querystring'
import inquirer from 'inquirer'
import CredentialManager from '../lib/credential-manager.js';
import util from '../lib/util.js';
import Twitter from '../lib/twitter.js'
import opn from 'opn'

const configure = {
    async consumer(name) {
        let creds = new CredentialManager(name)
        let answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'key',
                message: 'configure.js - Enter your Twitter API Key:',
                validate: util.notEmpty
            },
            {
                type: 'password',
                name: 'secret',
                message: 'Enter your Twitter API Secret:',
                validate: util.notEmpty
            }
        ])
        await creds.storeKeyAndSecret('apiKey', answers.key, answers.secret)
    },
    async account(name) {
        let creds = new CredentialManager(name)
        var [apiKey, apiSecret] = await creds.getKeyAndSecret('apiKey')
        let twitter = new Twitter(apiKey, apiSecret)
        let response = querystring.parse(await twitter.post('oauth/request_token'))
        twitter.setToken(response['oauth_token'], response['oauth_token_secret'])
        await inquirer.prompt({
            type: 'input',
            message: 'Press enter to open Twitter in your default browser to authorize access',
            name: 'continue'
        })

        util.openBrowser(`${twitter.baseUrl}oauth/authorize?oauth_token=${response['oauth_token']}`)
        let answers = await inquirer.prompt({
            type: 'input',
            message: 'Enter the PIN provided by Twitter',
            name: 'pin',
            validate: util.notEmpty
        })

        let tokenResponse = querystring.parse(
            await twitter.post('oauth/access_token', `oauth_verifier=${answers['pin']}`)
        )
        twitter.setToken(tokenResponse['oauth_token'], tokenResponse['oauth_token_secret'])

        let verifyResponse = await twitter.get('1.1/account/verify_credentials.json')
        await creds.storeKeyAndSecret(
            'accountToken',
            tokenResponse['oath_token'],
            tokenResponse['oauth_token_secret']
        )
        console.log(`Account "${verifyResponse['screen_name']}" succesfully added`)

    }
}

export default configure