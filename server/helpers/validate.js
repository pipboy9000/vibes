var axios = require('axios');

var {
    appId,
    appSecret
} = require('./facebook');

var accessTokens = {};

function validate(token) {
    //development
    if (accessTokens[token] && accessTokens[token].createdAt > (Date.now() - 3600000))
        return Promise.resolve(accessTokens[token].uid);

    return axios.get('https://graph.facebook.com/debug_token?&input_token=' + token + '&access_token=' + appId + '|' + appSecret)
        .then(res => {
            if (res.data.data.is_valid) {
                accessTokens[token] = {
                    uid: res.data.data.user_id,
                    createdAt: Date.now()
                };
                return res.data.data.user_id;
            }
        }).catch(err => {
            console.log(err.message);
            return false;
        });
}

module.exports = {
    validate
}