const loadScript = (src, callback) => {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = src;
  script.async = true;
  script.defer = true;
  script.onload = () => {
    console.log('JSSDK-API 加载成功');
    callback();
  };
  document.head.appendChild(script);
};
window.iframeLoad = function () {
  window.lightAppJssdk =
    document.getElementById('iframe').contentWindow.lightAppJssdk;
  window.thirdPartyNative = (function () {
    return {
      closeView: (json, responseCallback) => {
        // todo
        lightAppJssdk.navigation.close({
          success: function (data) {
            responseCallback();
          },
          fail: function (data) {
            console.log('fail', data);
            //错误返回
          }
        });
      },
      navBarHidden: (json, responseCallback) => {
        // todo
      },
      navBarTitle: (json, responseCallback) => {
        // todo
      },
      // SMGNativeJS.commonuseTypes.nativeRouter('revokeAccessToken');
      revokeAccessToken: (json, responseCallback) => {
        // todo 天府通办称还是 close，不要 logout
        // lightAppJssdk.user.logout
        lightAppJssdk.navigation.close({
          success: function (data) {
            responseCallback();
          },
          fail: function (data) {
            //错误返回
          }
        });
      },
      getEnvironment: (json, responseCallback) => {
        // todo
        responseCallback('');
      },
      getusername: (json, responseCallback) => {
        // todo
        responseCallback('');
      }
      // },
    };
  })();
  window.SMGNativeJS.commonuseTypes['3rd'] = window.thirdPartyNative;
};

const iframe = document.createElement('iframe');
iframe.id = 'iframe';
iframe.src = './inner.html';
iframe.style.display = 'none';
iframe.onload = window.iframeLoad;
document.body.appendChild(iframe);

// 业务调用
// SMGNativeJS.commonuseTypes.closeView(
//   {
//     url: '/abcd',
//   },
//   () => {
//     console.log('callback');
//   },
// );

// // or

// SMGNativeJS.commonuseTypes.nativeRouter(
//   '/commonService/closeView',
//   {
//     url: '/abcd',
//   },
//   () => {
//     console.log('callback');
//   },
// );
