import axios from 'axios';
import addOAuthInterceptor from 'axios-oauth-1.0a';

// Create a client whose requests will be signed
const client = axios.create();

// Specify the OAuth options
const options = {
    algorithm: 'HMAC-SHA1',
    key: '7m5CPb0Zh4Bk0bzhzK2wqBG3M',
    secret: 'NMNU1lxnjhEG5ckVXM5D5qTXh9CQjN4BprHLZKD95DtnVGKEKL',
};

// Add interceptor that signs requests
addOAuthInterceptor(client, options);

let response = await client.post({
    url: 'https://api.twitter.com/oauth/request_token?oauth_callback=oob'
})

console.log(response);