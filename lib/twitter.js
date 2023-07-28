import crypto from 'crypto';
import OAuth from 'oauth-1.0a';
//import addOAuthInterceptor from 'axios-oauth-1.0a';
import axios from 'axios';
// import request from 'request';
import got from 'got';
import qs from 'querystring';


// this example uses PIN-based OAuth to authorize the user
const requestTokenURL = 'https://api.twitter.com/oauth/request_token?oauth_callback=oob';
const authorizeURL = new URL('https://api.twitter.com/oauth/authorize');
const accessTokenURL = 'https://api.twitter.com/oauth/access_token';


class Twitter {
    constructor(consumer_key, consumer_secret) {
        console.log('consumer_key: ', consumer_key)
        console.log('consumer_secret: ', consumer_secret)
        this.baseUrl = 'https://api.twitter.com'
        console.log('this.baseURL', this.baseUrl)
        this.token = {}

        this.oauth = OAuth({
            consumer: {
                key: consumer_key,
                secret: consumer_secret
            },
            signature_method: 'HMAC-SHA1',
            hash_function: (baseString, key) => crypto.createHmac('sha1', key).update(baseString).digest('base64')
        });

        // axios.interceptors.request.use((config) => {
        //     config.headers = oauth.toHeader(oauth.authorize({
        //         url: `${config.baseURL}${config.url}`,
        //         method: config.method,
        //         //params: config.params,
        //         data: config.data
        //     }, this.token))
        //     config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
        //     console.log('config baseURL   : ', config.baseURL)
        //     console.log('config url       : ', config.url)
        //     console.log('conifg params    : ', config.params)
        //     console.log('config header    : ', config.headers)
        //     console.log('conifg data      : ', config.data)
        //     return config
        // })
        // axios.defaults.baseURL = this.baseUrl
    }

    async requestToken() {
        let req
        try {
            const authHeader = this.oauth.toHeader(this.oauth.authorize({
                url: requestTokenURL,
                method: 'POST'
            }));

            req = await got.post(requestTokenURL, {
                headers: {
                    Authorization: authHeader["Authorization"]
                }
            });
        } catch (error) {
            handleTwitterError(error)
        }

        if (req.body) {
            //console.log(req.body);
            return qs.parse(req.body);

        } else {
            throw new Error('Cannot get an OAuth request token');
        }


    }


    setToken(key, secret) {
        this.token = { key, secret }
    }

    async getAxios(api) {
        try {
            let response = await axios.get(api) // axios
            return response.data
        } catch (error) {
            handleTwitterError(error)
        }
    }
    async postAxios(api, data) {
        console.log('POST api: ', api)
        console.log('POST data: ', data)

        try {
            let response = await axios.post(api, data) // axios
            return response.data
        } catch (error) {
            handleTwitterError(error)
        }
    }

    async accessToken({
        oauth_token,
        oauth_token_secret
    }, verifier) {

        const authHeader = this.oauth.toHeader(this.oauth.authorize({
            url: accessTokenURL,
            method: 'POST'
        }));

        const path = `https://api.twitter.com/oauth/access_token?oauth_verifier=${verifier}&oauth_token=${oauth_token}`

        const req = await got.post(path, {
            headers: {
                Authorization: authHeader["Authorization"]
            }
        });

        if (req.body) {
            return qs.parse(req.body);
        } else {
            throw new Error('Cannot get an OAuth request token');
        }
    }

    async post(endpointURL) {

        const authHeader = this.oauth.toHeader(this.oauth.authorize({
            url: `${this.baseURL}/${endpointURL}`,
            method: 'POST'
        }, this.token));

        try {
            const req = await got.post(`${this.baseURL}/${endpointURL}`, {
                headers: {
                    Authorization: authHeader["Authorization"]
                    //'user-agent': "v2TweetLookupJS"
                }
            })

            if (req.body) {
                return JSON.parse(req.body);
            } else {
                throw new Error('Unsuccessful request');
            }

        } catch (error) {
            handleTwitterError(error)
        }

    }

    async get(endpointURL) {
        const urlpath = `https://api.twitter.com/${endpointURL}`
        console.log('get urlpath:', urlpath)
        console.log('get this.URL', this.baseUrl)
        console.log('get this.token', this.token)

        const authHeader = this.oauth.toHeader(this.oauth.authorize({
            url: urlpath,
            method: 'GET'
        }, this.token));

        try {
            const req = await got(urlpath, {
                headers: {
                    Authorization: authHeader["Authorization"]
                    //'user-agent': "v2TweetLookupJS"
                }
            })

            if (req.body) {
                return JSON.parse(req.body);
            } else {
                throw new Error('Unsuccessful request');
            }

        } catch (error) {
            handleTwitterError(error)
        }

    }

    async verifyResponse() {
        const verifyURL = 'https://api.twitter.com/1.1/account/verify_credentials.json'
        //const verifyURL = 'https://api.twitter.com/1.1/statuses/update.json'

        const authHeader = this.oauth.toHeader(this.oauth.authorize({
            url: verifyURL,
            method: 'GET'
        }, this.token));

        const req = await got(verifyURL, {
            headers: {
                Authorization: authHeader["Authorization"],
                'user-agent': "v2TweetLookupJS"
            }
        });

        if (req.body) {
            return JSON.parse(req.body);
        } else {
            throw new Error('Unsuccessful request');
        }

    }

}

function handleTwitterError(error) {
    console.log(error)
    if (error.message.includes('401')) {
        throw new Error('Invalid Twitter credentials -- try running \'configure\' again')
    } else if (error.message.includes('429')) {
        throw new Error('Twitter rate limit reached -- try again later')
    } else if (error.message.includes('403')) {
        throw new Error('Twitter request not authorized -- check application API access')
    } else {
        throw new Error(`Twitter: ${error.message}`)
    }
}

export default Twitter