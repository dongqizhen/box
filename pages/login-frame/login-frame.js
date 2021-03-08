const app = getApp()
// pages/login-frame/login-frame.js
const utils = require('../../utils/util')
let openid = "";
let session_key = "";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 1,
    collected: '',
    phonenums: '',
    avatar_url: ""
  },

  changeOil: function (e) {
    // console.log(e);
    this.setData({
      num: e.target.dataset.num,
      collected: e.target.dataset.num
    })
  },
  phonelogin: function () {
    wx.redirectTo({
      url: '../phone-login/phone-login'
    })
  },
  nonelogin: function () {
    wx.switchTab({
      url: '../index/index'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.login({
      lang: "zh_CN",
      success: response => {
        // console.log(res.code)
        wx.getUserInfo({
          lang: "zh_CN",
          success: function (res) {
            // console.log(res)
            //用户信息
            utils.sendRequest(app.globalData.publicAdress + 'api/register', 'post', {
                sessionId: wx.getStorageSync('sessionId'),
                rawData: res.rawData,
                signature: res.signature,
                iv: res.iv,
                encryptedData: res.encryptedData
              })
              .then(function (response) {
                // console.log(response)
                wx.removeStorageSync("token");
                wx.setStorageSync("token", response.data.token)
                if (response.statusCode == 200) {
                  //个人信息
                  wx.request({
                    url: 'https://s61.xboxes.cn/api/myInfo',
                    method: "get",
                    header: {
                      'content-type': 'application/json', // 默认值
                      'Accept': 'application/vnd.cowsms.v2+json',
                      'Authorization': 'Bearer ' + wx.getStorageSync("token"),
                    },
                    success: function (res) {
                      console.log(res)
                      //如果token失效   则返回新的token  
                      if (res.header.Authorization) {
                        var str = res.header.Authorization;
                        // console.log(str)
                        wx.removeStorageSync("token");
                        wx.setStorageSync("token", str.substring(7, str.length))
                      }
                      if (res.statusCode == '200') {
                        that.setData({
                          nickName: res.data.nickname,
                          avatar_url: res.data.avatarurl
                        })
                      }
                    }
                  })
                } else if (response.statusCode == 401) {
                  wx.showToast({
                    title: "token令牌无效",
                    icon: "none",
                    duration: 3000,
                  })
                } else if (response.statusCode == 401) {
                  wx.showToast({
                    title: "token令牌无效",
                    icon: "none",
                    duration: 3000,
                  })
                } else if (response.statusCode == 422) {
                  wx.showToast({
                    title: "请求参数无效",
                    icon: "none",
                    duration: 3000,
                  })
                } else if (response.statusCode == 400) {
                  wx.showToast({
                    title: "请求失败",
                    icon: "none",
                    duration: 3000,
                  })
                } else if (response.statusCode == 429) {
                  wx.showToast({
                    title: "请求次数太多",
                    icon: "none",
                    duration: 3000,
                  })
                } else if (response.statusCode == 500) {
                  wx.showToast({
                    title: "服务端错误，请联系后台",
                    icon: "none",
                    duration: 3000,
                  })
                }
              }, function (error) {
                // console.log(error);
              })
          }
        })


      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // openid = wx.getStorageSync("openid");
    // session_key = wx.getStorageSync("session_key");
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.login({
      success: function (res) {
        // console.log('loginCode:', res.code)
      }
    });
  },
  //微信快速登录
  getPhoneNumber: function (e) {
    // console.log(e)
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      wx.login({
        success: res => {
          wx.request({
            url: app.globalData.publicAdress + 'api/bindPhone',
            method: "post",
            header: {
              // 'content-type': 'application/json', // 默认值
              'Accept': 'application/json',
              'Authorization': 'Bearer ' + wx.getStorageSync("token"),
            },
            data: {
              sessionId: wx.getStorageSync('sessionId'),
              iv: e.detail.iv,
              encryptedData: e.detail.encryptedData
            },
            success: function (response) {
              //console.log(response)
              if (response.header.Authorization) {
                var str = res.header.Authorization;
                // console.log(str)
                wx.removeStorageSync("token");
                wx.setStorageSync("token", str.substring(7, str.length))
              }
              if (response.statusCode == 200) {
                //成功
                // wx.removeStorageSync("token");
                // wx.setStorageSync("token", response.data.data.token)
                // app.globalData.token = response.data.data.token;
                // console.log('登录成功')
                var getUrl = wx.getStorageSync("baseUrl")
                // console.log(getUrl)
                wx.removeStorageSync("isPhone")
                wx.setStorageSync("isPhone", "isPhone")
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

              } else if (response.statusCode == 401) {
                wx.showToast({
                  title: "token令牌无效",
                  icon: "none",
                  duration: 3000,
                })
              } else if (response.statusCode == 422) {
                wx.showToast({
                  title: "请求参数无效",
                  icon: "none",
                  duration: 3000,
                })
              } else if (response.statusCode == 400) {
                wx.showToast({
                  title: "请求失败",
                  icon: "none",
                  duration: 3000,
                })
              } else if (response.statusCode == 429) {
                wx.showToast({
                  title: "请求次数太多",
                  icon: "none",
                  duration: 3000,
                })
              } else if (response.statusCode == 500) {
                wx.showToast({
                  title: "服务端错误，请联系后台",
                  icon: "none",
                  duration: 3000,
                })
              }

            }
          })

        }
      })
    } else {
      wx.redirectTo({
        url: '../phone-login/phone-login'
      })
    }

  },
  //手机号码登录


})