//index.js
//获取应用实例
const app = getApp()
const utils = require('../../utils/util')
Page({
  data: {
    motto: '欢迎使用智能信报箱',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  onLoad: function () {
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        // console.log(res)
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            lang: "zh_CN",
            success: function (res) {
              console.log(res)
              let userInfo = res.userInfo;
              var getUrl = wx.getStorageSync("baseUrl")
              // console.log(getUrl)
              if (wx.getStorageSync("baseUrl")) {
                wx.switchTab({
                  url: "../../" + getUrl,
                })
                wx.removeStorageSync("baseUrl")
              } else {
                wx.switchTab({
                  url: '../index/index'
                })
              }
            }
          })
        } else {
          return
        }
      }
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onShow:function(){
    
  },
  getUserInfo: function (e) {
    // console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    if (e.detail.userInfo) {
      console.log("点击了同意授权");
      var _this = this;
      wx.navigateTo({
        url: '../login-frame/login-frame',
      })
      
      
      // wx.switchTab({
      //   url: '../index/index'
      // })
     
    } else {
      console.log("点击了拒绝授权");
      wx.switchTab({
        url: '../index/index'
      })
    }
  },
  cancel:function(){
    wx.switchTab({
      url: '../index/index',
    })
  }
})
  