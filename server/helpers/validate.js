var axios = require("axios");
var chalk = require("chalk");
var fs = require("fs");

var {
  appId,
  appSecret
} = require("./facebook");


//https: //graph.facebook.com/debug_token?&input_token=EAAOsItZCIcdUBABmObiBzvc46tCNZChZBpzxmmYIw6TwLEfYlpOSbQgS8a6DdM3BO3C2s1JqQn2ox5frRx5oIoLDqx5lgzB0Cb4ezD7i4yU96KPhwXq8550keIGUj2xywO2AEKmv8OHGMkpkzxeC5LZCOtE1ZBLQL753qTXIXwS9ZCXJZAA6rZACi1K07krCyqViHhcwHVNvZCAZDZD&access_token=1033690713453013|e8408dd116c7abe3d6242969b9bf4b6c

var accessTokens = {};
var userTokensMap = {};

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

          //remove old access token
          if (userTokensMap[user.fbid])
            delete accessTokens[userTokensMap[user.fbid]]

          //cache it in accessToken and userTokensMap
          accessTokens[token] = user;
          userTokensMap[user.fbid] = token;

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

function save() {
  var data = {
    accessTokens,
    userTokensMap
  }
  fs.writeFile("tokens.json", JSON.stringify(data), err => {
    if (err)
      throw err;
  })
}

function load() {
  fs.readFile("tokens.json", (err, str) => {
    if (err)
      throw err;

    data = JSON.parse(str);
    if (data.hasOwnProperty(accessTokens))
      accessTokens = data.accessTokens;

    if (data.hasOwnProperty(userTokensMap))
      userTokensMap = data.userTokensMap;
  })
}

function init() {
  load();
  setInterval(save, 5000);
}

init();

module.exports = {
  validate
};