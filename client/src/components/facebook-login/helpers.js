/* global window, FB, document */


export function loadFbSdk(appId, version) {
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
    facebookConnectPlugin.getLoginStatus(responseStatus => {
      resolve(responseStatus);
    });
  });
}

export function fbLogin(options) {
  return new Promise(resolve => {
    facebookConnectPlugin.login(['email'], response => resolve(response));
  });

  return new Promise(resolve => {
    facebookConnectPlugin.login(response => resolve(response), options);
  });
}
export function fbLogout() {
  return new Promise(resolve => {
    facebookConnectPlugin.logout(response => resolve(response));
  });
}

export function fbGetUserDetails() {
  return new Promise(resolve => {
    facebookConnectPlugin.api('/me', {}, details => resolve(details));
  })
}
