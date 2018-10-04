/* global window, FB, document */

import {
  loginDetails,
  userDetail,
  userDetails
} from "./facebookDetails";

export function loadFbSdk(appId, version) {
  //TODO: add all the options from below
  return new Promise(resolve => {
    resolve();
  });

  // return new Promise(resolve => {
  //   window.fbAsyncInit = function () { // eslint-disable-line func-names
  //     FB.init({
  //       appId,
  //       xfbml: false,
  //       version,
  //       cookie: true
  //     });
  //     FB.AppEvents.logPageView();
  //     resolve('SDK Loaded!');
  //   };
  //   (function (d, s, id) { // eslint-disable-line func-names
  //     const fjs = d.getElementsByTagName(s)[0];
  //     if (d.getElementById(id)) {
  //       return;
  //     }
  //     const js = d.createElement(s);
  //     js.id = id;
  //     js.src = 'https://connect.facebook.net/en_US/sdk.js';
  //     fjs.parentNode.insertBefore(js, fjs);
  //   }(document, 'script', 'facebook-jssdk'));
  // });
}

export function getLoginStatus() {
  return new Promise(resolve => {
    resolve(loginDetails); //dev
    // facebookConnectPlugin.getLoginStatus(responseStatus => {
    //   resolve(responseStatus);
    // });
  });
}

export function fbLogin(options) {
  return new Promise(resolve => {
    resolve(loginDetails); //dev
    // console.log("calling fb login")
    // facebookConnectPlugin.login(['email'], response => {
    //   console.log("fb response:")
    //   console.dir(response)
    //   resolve(response)
    // }, (err) => {
    //   console.log("fb error:")
    //   console.log(err)
    //   resolve(err)
    // });
  });
}
export function fbLogout() {
  return new Promise(resolve => {
    facebookConnectPlugin.logout(response => resolve(response));
  });
}

export function fbGetUserDetails() {
  return new Promise(resolve => {
    resolve(userDetails);
    // console.log('calling facebookConnectPlugin.api /me')
    // facebookConnectPlugin.api('/me', ["email"], details => {
    //     console.log('facebookConnectPlugin.api success function') 
    //     resolve(details)
    //   },
    //   error => {
    //     console.log('facebookConnectPlugin.api failure function. error:')
    //     console.log(error)
    //   });
  })
}
