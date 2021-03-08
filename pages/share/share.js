// pages/share/share.js
const app = getApp()
var showSuccess = text => wx.showToast({
  title: text,
  icon: 'none'
});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bottom: false,
    big: '/images/bottompull.png',
    ids: null,
    available: null, //可以被使用
    occupy: null, //被占用
    toptitle: '',
    itcp: null,
    daojishi: '6', //关箱子倒计时
    opentan: false, //开箱弹框开关
    tan: false, //预约弹框开关
    _boxcellid: null, //预约使用的box_cell_id
    contenttext: null, //弹框内容
    signature: null, //开箱签名
    timestamp: null, //开箱时间戳
    share_tishi: false, //提示关箱开关
    type: null,
  },
  xiala: function () {
    if (this.data.bottom) {
      this.setData({
        bottom: false,
        big: '/images/bottompull.png'
      })
    } else {
      this.setData({
        bottom: true,
        big: '/images/toppull.png',
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    console.log(JSON.parse(options.ids))
    console.log(JSON.parse(options.ids).ids)
    this.setData({
      ids: JSON.parse(options.ids).ids,
      itcp: JSON.parse(options.ids).itcp,
    })
    this.sharedetails()
    this.shareInfo(JSON.parse(options.ids).ids)
  },
  // 获取柜子信息接口
  shareInfo: function (ids) {
    let that = this
    wx.request({
      url: app.globalData.publicAdress + 'api/BoxInfo',
      method: 'GET',
      header: {
        'content-type': 'application/json', // 默认值
        'Accept': 'application/vnd.cowsms.v2+json',
        'Authorization': 'Bearer ' + wx.getStorageSync("token"),
      },
      data: {
        box_id: ids
      },
      success(res) {
        console.log(res)
        if (res.header.Authorization) {
          var str = res.header.Authorization;
          wx.removeStorageSync("token");
          wx.setStorageSync("token", str.substring(7, str.length))
        }
        if (res.statusCode == '200') {
          let content = res.data.data.get_area_info.name + res.data.data.get_area_info.area_name + res.data.data.town + res.data.data.unit
          console.log(content)
          that.setData({
            toptitle: content
          })
        }
      }
    })

  },
  // 获取柜子信息接口
  // 共享箱详情
  sharedetails: function () {
    let that = this
    let availableList = []
    let occupylist = []
    that.setData({
      occupy: null,
      available: null
    })
    wx.request({
      url: app.globalData.publicAdress + 'api/shareBoxInfo',
      method: 'GET',
      header: {
        'content-type': 'application/json', // 默认值
        'Accept': 'application/vnd.cowsms.v2+json',
        'Authorization': 'Bearer ' + wx.getStorageSync("token"),
      },
      data: {
        box_id: that.data.ids
      },
      success(res) {
        console.log(res)
        if (res.header.Authorization) {
          var str = res.header.Authorization;
          wx.removeStorageSync("token");
          wx.setStorageSync("token", str.substring(7, str.length))
        }
        if (res.statusCode == '200') {
          for (let i = 0; i < res.data.data.length; i++) {
            // console.log()
            if (res.data.data[i].s_status == '0') {
              console.log('共享箱可用')
              // available
              availableList.push(res.data.data[i])
              that.setData({
                available: availableList
              })
              console.log(that.data.available)
            } else {
              console.log('共享箱被占用')
              // occupy
              occupylist.push(res.data.data[i])
              that.setData({
                occupy: occupylist
              })
              console.log(that.data.occupy)
            }
          }
        }
      }
    })

  },
  // 共享箱详情
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 点击开箱按钮
  openshare: function (e) {
    console.log(e)
    this.setData({
      _boxcellid: e.currentTarget.dataset.box_cell_id,

      // contenttext:'是否确定开启当前柜口'
    })
    this.newopenbtn(e.currentTarget.dataset.box_cell_id)
  },
  // 点击开箱确定按钮
  kuangopenbtn: function () {
    let that = this
    console.log(that.data._boxcellid)
    that.newopenbox()

    let miaoshu = 20
    let ding = setInterval(() => {

      if (miaoshu > 0) {
        miaoshu--
        console.log(miaoshu)
        that.setData({
          judge_miao: miaoshu
        })
      }
    }, 1000);




  },
  // 开箱按钮接口
  newopenbtn: function (box_cell_id) {
    let that = this
    wx.request({
      url: app.globalData.publicAdress + 'api/openBoxButton',
      method: 'GET',
      header: {
        'content-type': 'application/json', // 默认值
        'Accept': 'application/vnd.cowsms.v2+json',
        'Authorization': 'Bearer ' + wx.getStorageSync("token"),
      },
      data: {
        box_cell_id: box_cell_id
      },
      success(res) {
        if (res.header.Authorization) {
          var str = res.header.Authorization;
          wx.removeStorageSync("token");
          wx.setStorageSync("token", str.substring(7, str.length))
        }
        if (res.statusCode == 200) {
          console.log(res)
          let content = res.data.data.get_area_info.name + res.data.data.get_area_info.area_name + res.data.data.get_box_info.town + res.data.data.get_box_info.unit + res.data.data.roomNum
          console.log(content)
          that.setData({
            opentan: true,
            share_openusebox: content,
            signature: res.data.signature,
            _boxcellid: box_cell_id,
            contenttext: '是否开启' + content + '柜口',
            timestamp: res.data.timestamp,
            type: res.data.type
          })
        }
        if (res.statusCode == 401) {
          showSuccess(res.data.mes)
        }
      }
    })
  },
  // 新开箱接口
  newopenbox: function () {
    let that = this
    console.log(that.data.signature)
    wx.request({
      url: app.globalData.publicAdress + 'api/openBoxV2',
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'Accept': 'application/vnd.cowsms.v2+json',
        'Authorization': 'Bearer ' + wx.getStorageSync("token"),
      },
      data: {
        box_cell_id: that.data._boxcellid,
        signature: that.data.signature,
        timestamp: that.data.timestamp,
        type: that.data.type
      },
      success(res) {
        console.log(res)
        if (res.header.Authorization) {
          var str = res.header.Authorization;
          wx.removeStorageSync("token");
          wx.setStorageSync("token", str.substring(7, str.length))
        }
        if (res.statusCode == 200) {
          console.log(res)
          that.setData({
            opentan: false,
            share_tishi: true,
          })
          showSuccess('开箱成功')
          let num = 6
          let dingshi = setInterval(() => {
            if (num > 0) {
              num--
              that.setData({
                daojishi: num
              })
            } else {
              clearInterval(dingshi)
              that.setData({
                daojishi: '',
                num: 6
              })
            }
            //  console.log(that.data.daojishi)
          }, 1000);
        }
      }
    })
  },
  // 我已关箱
  share_openusebox_cel: function () {


    let that = this
    // console.log('确认关闭')
    console.log(that.data._boxcellid)
    // 关箱子状态查询接口
    wx.request({
      url: app.globalData.publicAdress + 'api/lockStatus',
      method: 'GET',
      header: {
        'content-type': 'application/json', // 默认值
        'Accept': 'application/vnd.cowsms.v2+json',
        'Authorization': 'Bearer ' + wx.getStorageSync("token"),
      },
      data: {
        box_cell_id: that.data._boxcellid
      },
      success(res) {
        if (res.header.Authorization) {
          var str = res.header.Authorization;
          wx.removeStorageSync("token");
          wx.setStorageSync("token", str.substring(7, str.length))
        }
        if (res.statusCode == 200) {
          console.log(res)
          if (res.data.code == '10101') {
            showSuccess(res.data.mes)
          } else {
            // console.log('确认关闭')
            console.log(that.data.daojishi)
            if (that.data.daojishi == '') {
              // console.log(that.data.daojishi)
              // that.myShareBoxStatus() //我有权限和我的预约得个数
              // that.sharestate(wx.getStorageSync('ids')) //共享箱数量
              // that.shareallboxdata(wx.getStorageSync('ids')) //我的预约与我有权限得箱子
              that.sharedetails()
              that.setData({
                share_tishi: false,
                daojishi: '6',
                judge_miao:'0'
              })
            } else {
              // console.log('没执行')
            }
          }



        } else if (res.statusCode == 401) {
          showSuccess(res.data.mes)
        }
      }
    })
    // 关箱子接口
















  },



  // 我的预约
  appointment: function (e) {
    console.log(e.currentTarget.dataset)
    this.setData({
      _boxcellid: e.currentTarget.dataset.box_cell_id,
      tan: true,
      contenttext: '您确定预约当前柜口吗？'
    })
  },
  // 预约确认按钮
  kuangbtn: function () {

    let that = this
    console.log(that.data._boxcellid)
    wx.request({
      url: app.globalData.publicAdress + 'api/ShareBoxOrder',
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'Accept': 'application/vnd.cowsms.v2+json',
        'Authorization': 'Bearer ' + wx.getStorageSync("token"),
      },
      data: {
        box_cell_id: that.data._boxcellid
      },
      success(res) {
        console.log(res)
        if (res.header.Authorization) {
          var str = res.header.Authorization;
          wx.removeStorageSync("token");
          wx.setStorageSync("token", str.substring(7, str.length))
        }
        if (res.statusCode == '200') {
          console.log(res)
          that.setData({
            tan: false
          })
          showSuccess(res.data.mes)
          that.sharedetails()
        } else {
          that.setData({
            tan: false
          })
          showSuccess(res.data.mes)
          that.sharedetails()
        }

      }
    })
  },
  // 取消按钮
  kuangbtnB: function () {
    this.setData({
      tan: false,
      opentan: false
    })
    showSuccess('已取消')
  },
  nosao() {
    showSuccess('请扫描柜子上面的二维码')
  },
  kuang_box_close: function () {
    this.setData({
      share_tishi: false
    })
  },
})