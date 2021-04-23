//app.js
const utils = require('utils/util')
Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
      value => P.resolve(callback()).then(() => value),

      reason => P.resolve(callback()).then(() => { throw reason })
  );
};
App({

  onLaunch() {

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    // 
    if (wx.getStorageSync("token")) {
      //用户信息
     this.getUserInfo()
    } else {
      console.log('登录')
      // 登录
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          wx.request({
            url: 'https://s61.xboxes.cn/api/login',
            method: "get",
            data: {
              "code": res.code
            },
            success: function (res) {
              // wx.removeStorageSync("token");
              wx.setStorageSync("token", res.data.token)
              // wx.removeStorageSync("sessionId");
              wx.setStorageSync("sessionId", res.data.sessionId)
            },
            error: function (res) {
              // console.log(res)
            }
          })
        },
      })
      // wx.setStorageSync('token', '222222222222')
    }

    //api/user/me
    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           console.log(res)
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }

    //         }
    //       })
    //     }
    //   }
    // })
    this.checkForUpdate();


  },
  // 接口失败处理
  // Unauthenticated: function (res) {
  //   wx.login({
  //     complete: (res) => {
  //       console.log(res)
  //       wx.request({
  //         url: 'https://s61.xboxes.cn/api/login',
  //         method: "get",
  //         header: {
  //           'content-type': 'application/json', // 默认值
  //           'Accept': 'application/vnd.cowsms.v2+json',
  //           'Authorization': 'Bearer ' + wx.getStorageSync("token"),
  //         },
  //         data:{
  //            code:res.code
  //         },
  //         success(res){
  //           console.log(res)
  //           wx.setStorageSync('token', res.data.token)
  //           wx.setStorageSync('sessionId', res.data.sessionId)
  //         }
  //       })
  //     },
  //   })
  // },
  //检查微信小程序是否最新版本

  checkForUpdate: function () {

    const updateManager = wx.getUpdateManager()

    updateManager.onUpdateReady(function () {

      wx.showModal({

        title: '更新提示',

        content: '新版本已经准备好，是否重启应用？',

        success: function (res) {

          if (res.confirm) {

            updateManager.applyUpdate()

          }

        }

      })

    })

    updateManager.onUpdateFailed(function () {

      wx.showModal({
        title: '提示',
        content: '检查到有新版本，但下载失败，请检查网络设置',
        showCancel: false,
      })
    })

  },

  /*函数节流*/
  throttle: function (fn, interval) {
    var enterTime = 0; //触发的时间
    var gapTime = interval || 300; //间隔时间，如果interval不传，则默认300ms
    return function () {
      var context = this;
      var backTime = new Date(); //第一次函数return即触发的时间
      if (backTime - enterTime > gapTime) {
        fn.call(context, arguments);
        enterTime = backTime; //赋值给第一次触发的时间，这样就保存了第二次触发的时间
      }
    };
  },

  /*函数防抖*/
  debounce: function (fn, interval) {
    var timer;
    var gapTime = interval || 1000; //间隔时间，如果interval不传，则默认1000ms
    return function () {
      clearTimeout(timer);
      var context = this;
      var args = arguments; //保存此处的arguments，因为setTimeout是全局的，arguments不是防抖函数需要的。
      timer = setTimeout(function () {
        fn.call(context, args);
      }, gapTime);
    };
  },

  getUserProfile () {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    return new Promise((resolve,reject)=>{
      wx.getSetting({
        success:(res)=>{
          if (res.authSetting['scope.userInfo']) {
            wx.getUserProfile({
              desc: '用于显示用户资料',
              success: (res) => {
                console.log(res)
                const {userInfo} = res
                
                this.globalData.userInfo = userInfo
                wx.setStorageSync('wx_userInfo', userInfo)
                // this.globalData.wx_userInfo = userInfo
                this.globalData.profile_user = res
                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (this.userInfoReadyCallback) {
                  this.userInfoReadyCallback(res)
                }
                resolve(res)
              }
            })
          }
        },
        fail:(err)=>{
          reject(err)
        }
      })
    })
  },

  getUserInfo(){
    return new Promise((resolve,reject)=>{
      wx.request({
        url: 'https://s61.xboxes.cn/api/myInfo',
        method: "get",
        header: {
          'content-type': 'application/json', // 默认值
          'Accept': 'application/vnd.cowsms.v2+json',
          'Authorization': 'Bearer ' + wx.getStorageSync("token"),
        },
        success: (res) => {
          console.log(res)
          //如果token失效   则返回新的token  
          if (res.header.Authorization) {
            var str = res.header.Authorization;
            // console.log(str)
            wx.removeStorageSync("token");
            wx.setStorageSync("token", str.substring(7, str.length))
          }

          if (res.statusCode == '200') {
            resolve()
          }
          if (res.statusCode == '500') {
            reject()
            // this.Unauthenticated()
          }
        }
      })
    })
  },








  globalData: {
    code: null,
    userInfo: null,
    publicAdress: "https://s61.xboxes.cn/",
    token: wx.getStorageSync("token"),
    boxid: "",
    flag: false,
  }
})