import crypto from 'crypto';
//import OAuth from 'oauth-1.0a';
import addOAuthInterceptor from 'axios-oauth-1.0a'
import axios from 'axios';

class Twitter {
    constructor(consumerKey, consumerSecret) {
        this.baseUrl = 'https://api.twitter.com'
        this.token = {}
        let oauth = addOAuthInterceptor({
            consumer: {
                key: consumerKey,
                secret: consumerSecret
            },
            signature_method: 'HMAC-SHA1',
            hash_funciton(baseString, key) {
                return crypto.createHmac('sha1', key).update(baseString).digest('base64')
            }
        })
        axios.interceptors.request.use((config) => {
            config.headers = oauth.toHeader(oauth.authorize({
                url: `${config.baseURL}${config.url}`,
                method: config.method,
                data: config.data
            }, this.token))
            config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
            return config
        })
        axios.defaults.baseURL = this.baseUrl
    }
    setToken(key, secret) {
        this.token = { key, secret }
    }
    async get(api) {
        let response = await axios.get(api)
        return response.data
    }
    async post(api, data) {
        let response = await axios.post(api, data)
        return response.data
    }


}

export default Twitter