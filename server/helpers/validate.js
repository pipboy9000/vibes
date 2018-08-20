var axios = require("axios");
var chalk = require("chalk");

var {
  appId,
  appSecret
} = require("./facebook");


//https: //graph.facebook.com/debug_token?&input_token=EAAOsItZCIcdUBABmObiBzvc46tCNZChZBpzxmmYIw6TwLEfYlpOSbQgS8a6DdM3BO3C2s1JqQn2ox5frRx5oIoLDqx5lgzB0Cb4ezD7i4yU96KPhwXq8550keIGUj2xywO2AEKmv8OHGMkpkzxeC5LZCOtE1ZBLQL753qTXIXwS9ZCXJZAA6rZACi1K07krCyqViHhcwHVNvZCAZDZD&access_token=1033690713453013|e8408dd116c7abe3d6242969b9bf4b6c

var accessTokens = {};

function validate(token) {
  //development
  // var user = {
  //   fbid: "10156492526329808",
  //   name: "Dan Levin",
  //   createdAt: Date.now()
  // };
  // return Promise.resolve(user);

  if (accessTokens[token] && accessTokens[token].createdAt > Date.now() - 86400000)
    return Promise.resolve(accessTokens[token]);

  console.log(chalk.blue("validate token with fb"));
  return axios.get("https://graph.facebook.com/debug_token?&input_token=" + token + "&access_token=" + appId + "|" + appSecret)
    .then(res => {
      if (res.data.data.is_valid) {
        var fbid = res.data.data.user_id;
        return axios.get("https://graph.facebook.com/" + fbid + "?fields=name&access_token=" + token).then(res => {

          var user = {
            fbid: res.data.id,
            name: res.data.name,
            createdAt: Date.now()
          };
          //cache it in accessToken
          accessTokens[token] = user;
          console.log(chalk.green("valid"));
          return user;
        }).catch(err => {
          console.log(err)
          return false;
        })
      } else {
        console.log(chalk.red("user credentials invalid-"));
        console.log(res.data.data.error);
        return false;
      }
    }).catch(err => {
      console.log(chalk.red(err.message));
      return false;
    });
}

module.exports = {
  validate
};