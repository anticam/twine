//import querystring from 'querystring'
import inquirer from 'inquirer'
import CredentialManager from '../lib/credential-manager.js';
import util from '../lib/util.js';
import Twitter from '../lib/twitter.js'
//import OAuth from 'oauth';
//import addOAuthInterceptor from 'axios-oauth-1.0a';
//import axios from 'axios';


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
        await creds.storeKeyAndSecret('consumer', answers.key, answers.secret) // apiKey
    },

    async getKeys(name) {
        let creds = new CredentialManager(name)
        console.log(`getKeys creds: ${name}`)
        let [apiKey, apiSecret] = await creds.getKeyAndSecret('consumer')
        return [apiKey, apiSecret]
    },

    async getOAuthKeys(name) {
        let creds = new CredentialManager(name)
        console.log(`getKeys creds: ${name}`)
        let [oauth_key, oauth_secret] = await creds.getKeyAndSecret('account')
        return [oauth_key, oauth_secret]
    },

    async account(name) {
        const authorizeURL = new URL('https://api.twitter.com/oauth/authorize');

        let creds = new CredentialManager(name)
        var [consumer_key, consumer_secret] = await creds.getKeyAndSecret('consumer')

        let twitter = new Twitter(consumer_key, consumer_secret)

        // Get request token
        let oAuthRequestToken = await twitter.requestToken();
        console.log(oAuthRequestToken.oauth_token);
        twitter.setToken(oAuthRequestToken.oauth_token, oAuthRequestToken.oauth_token_secret)

        // Get authorization
        authorizeURL.searchParams.append('oauth_token', oAuthRequestToken.oauth_token);
        console.log('Please go here and authorize:', authorizeURL.href);


        let answers = await inquirer.prompt({
            type: 'input',
            message: 'Enter the PIN provided by Twitter:',
            name: 'pin',
            validate: util.notEmpty
        })


        // Get the access token
        const oAuthAccessToken = await twitter.accessToken(oAuthRequestToken, answers['pin'].trim())


        twitter.setToken(
            oAuthAccessToken['oauth_token'],
            oAuthAccessToken['oauth_token_secret']
        )

        console.log('oAuthAccessToken: ', oAuthAccessToken)

        let verifyResponse = await twitter.verifyResponse()

        await creds.storeKeyAndSecret(
            'account',
            oAuthAccessToken['oauth_token'],
            oAuthAccessToken['oauth_token_secret']
        )
        console.log(`Account "${verifyResponse['screen_name']}" succesfully added`)

    }
}

export default configure