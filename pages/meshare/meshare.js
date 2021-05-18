// pages/meshare/meshare.js
// var shuju = require('../../mockjs/sharebox')
const app = getApp()
var utils = require('../../utils/util.js');
// 显示成功提示
var showSuccess = text => wx.showToast({
  title: text,
  icon: 'none'
});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    urlname: '北京市新港奥家园C区16号楼2单元',
    imgpull: "/images/bottompull.png",
    contenttext: '',
    tishi: '',
    share_id: null, //
    share_phone: null, //手机号
    share_people: false, //添加开箱人开关
    itcp: null, //判断是否为扫码进入小程序
    //我的共享箱列表
    waybilllist: null,
    // 我的预约
    subscribe: null,
    sharekuang: false, //弹框开关
    share_space: false, //根据户号添加弹框
    value_roomNumid: null, //模糊搜索的内容
    // 当前柜子得共享箱
    // sharebox: {
    //   number: 8,
    //   available: 3
    // },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    // this.setData({
    //   waybilllist: shuju.data.data
    // })
    that.shareallboxdata()

  },
  onClickLeft() {
    wx.navigateBack({
      delta: 0,
    })
  },
  bindtapbox: function (e) {
    console.log(e.currentTarget.dataset.index)
    console.log(this)
    if (this.data.couseid != e.currentTarget.dataset.index) {
      this.setData({
        couseid: e.currentTarget.dataset.index,
        // imgpull:"/images/toppull.png"
      })
      this.data.imgpull = "/images/toppull.png"
    } else {
      this.setData({
        couseid: null,
        imgpull: "/images/bottompull.png"
      })
    }
  },
  deleteuserinfo: function (e) {
    console.log(e)
    this.setData({
      sharekuang: true,
      tishi: '',
      contenttext: '确认删除此成员吗？',
      share_id: e.currentTarget.dataset.share_id,
      share_phone: e.currentTarget.dataset.phone
    })
  },
  // 删除可开箱人点击取消
  sharekuangbtnB: function () {
    this.setData({
      sharekuang: false
    })
    showSuccess('已取消')
  },
  // 删除可开箱人点击确定
  sharekuangbtn: function () {
    let that = this
    that.setData({
      sharekuang: false
    })
    // 删除成员接口
    wx.request({
      url: app.globalData.publicAdress + 'api/ShareBoxUser',
      method: 'delete',
      header: {
        'content-type': 'application/json', // 默认值
        'Accept': 'application/vnd.cowsms.v2+json',
        'Authorization': 'Bearer ' + wx.getStorageSync("token"),
      },
      data: {
        "share_id": that.data.share_id,
        "phone": that.data.share_phone
      },
      success: function (res) {
        console.log('查询状态')
        console.log(res)
        //如果token失效   则返回新的token  
        if (res.header.Authorization) {
          var str = res.header.Authorization;
          wx.removeStorageSync("token");
          wx.setStorageSync("token", str.substring(7, str.length))
        }
        if (res.statusCode == '200') {
          console.log(res)
          showSuccess('已删除')
          that.shareallboxdata(wx.getStorageSync('ids'))
        }
      }
    })

  },
  // 查询当前柜子我的共享箱
  shareallboxdata: function () {
    let that = this
    let time = new Date()
    wx.request({
      url: app.globalData.publicAdress + 'api/myShareBox',
      method: 'GET',
      header: {
        'content-type': 'application/json', // 默认值
        'Accept': 'application/vnd.cowsms.v2+json',
        'Authorization': 'Bearer ' + wx.getStorageSync("token"),
      },
      success(res) {
        if (res.header.Authorization) {
          var str = res.header.Authorization;
          wx.removeStorageSync("token");
          wx.setStorageSync("token", str.substring(7, str.length))
        }
        if (res.statusCode == '200') {
          let wail = [] //预约状态
          let waybilllist = [] //存入状态
          if (res.data.length != 0) {
            console.log(res)
            // that.setData({
            //   waybilllist:res.data
            // })
            for (let i = 0; i < res.data.length; i++) {

              if (res.data[i].save_stop == null || res.data[i].save_stop == '') {
                console.log('我的预约')
                wail.push(res.data[i])
              } else {

                console.log('已存入')
                waybilllist.push(res.data[i])
              }
            }
          }
          console.log(wail)
          for (let i = 0; i < wail.length; i++) {
            console.log(wail[i].created_num)
            // console.log(res.data[i].created_at.toString())
            // let ding = setInterval(() => {
            //   let time = new Date()
            //   let yuyue = new Date(wail[i].created_num*1000+15*60*1000)
            //   console.log(yuyue)
            //   const newhour = yuyue.getHours()
            //   const newminute = yuyue.getMinutes()
            //   const newsecond = yuyue.getSeconds()
            //   console.log(time)
            //   const hour = time.getHours()
            //   const minute = time.getMinutes()
            //   const second = time.getSeconds()
            //   if(newhour - hour ==0 && newminute- minute == 0 && newsecond - second == 0){
            //     clearInterval(ding)
            //     that.shareallboxdata()
            //   }
            // }, 1000);
          }
          console.log(waybilllist)
          that.setData({
            waybilllist: waybilllist,
            subscribe: wail
          })
        }
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
    let that = this
    wx.request({
      url: app.globalData.publicAdress + 'api/myShareBox',
      method: 'GET',
      header: {
        'content-type': 'application/json', // 默认值
        'Accept': 'application/vnd.cowsms.v2+json',
        'Authorization': 'Bearer ' + wx.getStorageSync("token"),
      },
      success(res) {
        if (res.header.Authorization) {
          var str = res.header.Authorization;
          wx.removeStorageSync("token");
          wx.setStorageSync("token", str.substring(7, str.length))
        }
        if (res.statusCode == '200') {
          let wail = [] //预约状态
          let waybilllist = [] //存入状态
          if (res.data.length != 0) {
            console.log(res)
            // that.setData({
            //   waybilllist:res.data
            // })
            for (let i = 0; i < res.data.length; i++) {

              if (res.data[i].save_stop == null || res.data[i].save_stop == '') {
                console.log('我的预约')
                wail.push(res.data[i])
              } else {

                console.log('已存入')
                waybilllist.push(res.data[i])
              }
            }
          }
          console.log(wail)
          // console.log(wail[i].created_num)
          // console.log(res.data[i].created_at.toString())
          let ding = setInterval(() => {
            let time = new Date()
            var hour = time.getHours()
            var minute = time.getMinutes()
            var second = time.getSeconds()
            for (let i = 0; i < wail.length; i++) {
              var yuyue = new Date(wail[i].created_num * 1000 + 15 * 60 * 1000)
              // console.log(wail[i].created_num)
              var newhour = yuyue.getHours()
              // console.log(newhour)
              var newminute = yuyue.getMinutes()
              var newsecond = yuyue.getSeconds()
              // console.log(newsecond)
              //  console.log(`${newhour - hour}/////${newminute - minute}///${newsecond - second}`)

              if (newhour - hour == 0 && newminute - minute == 0 && newsecond - second == 0) {
                clearInterval(ding)
                that.shareallboxdata()
              }
              // 14:56:20  - 13:40:55
              // console.log(parseInt(newsecond - second))
              // console.log(parseInt(newhour - hour) + ':' + parseInt(newminute - minute) + ':' + parseInt(newsecond - second))
              // wail[i].created_num = parseInt(newhour - hour) + ':' + parseInt(newminute - minute) + ':' + parseInt(newsecond - second)
            }
          }, 1000);
          that.setData({
            waybilllist: waybilllist,
            subscribe: wail
          })
        }
      }
    })

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
  //空间分享 
  share_space: function (e) {
    console.log(e.currentTarget.dataset)
    this.setData({
      share_space: true,
      share_id: e.currentTarget.dataset.share_id,
      boxcellid: e.currentTarget.dataset.boxcellid,
    })
  },
  space_share: function (e) {
    console.log(e.detail.value)
    let shu = e.detail.value
    this.setData({
      mohushu: shu
    })
    // console.log(shu)
    setTimeout(() => {
      // console.log(shu.length)
      this.mohu()
    }, 1500);
    // shu = null

  },
  // 模糊搜索接口
  mohu: function () {
    let that = this

    let setcomm = setTimeout(function () {
      var new_string = null
      // console.log(that.data.mohushu)
      new_string = that.data.mohushu
      console.log(new_string)
      return new_string
    }, 3000);
    console.log(setcomm)
    setTimeout(() => {
      console.log(that.data.mohushu)
      wx.request({
        url: app.globalData.publicAdress + 'api/BoxCell',
        method: 'GET',
        header: {
          'content-type': 'application/json', // 默认值
          'Accept': 'application/vnd.cowsms.v2+json',
          'Authorization': 'Bearer ' + wx.getStorageSync("token"),
        },
        data: {
          box_id: wx.getStorageSync('ids'),
          q: that.data.mohushu
        },
        success(res) {
          console.log(res)
          if (res.header.Authorization) {
            var str = res.header.Authorization;
            wx.removeStorageSync("token");
            wx.setStorageSync("token", str.substring(7, str.length))
          }
          if (res.statusCode == '200') {
            // console.log(res)
            // console.log(res.data.data.length)
            if (res.data.data.length != 0) {
              that.setData({
                share_vagule: true,
                share_vagule_text: res.data.data
              })
            } else {
              that.setData({
                share_vagule: false,
                share_vagule_text: null
              })
            }
          }
        }
      })
    }, 1500);


  },
  // 模糊搜索接口

  kuangbtnshareB: function () {

    this.setData({
      share_space: false,
      value_roomNum: null
    })
    wx.showToast({
      title: '已取消',
      icon: 'none',
      duration: 2000
    })
  },
  //点击模糊搜索得每一项
  share_vagule_text: function (e) {
    console.log(e.currentTarget.dataset)
    this.setData({
      value_roomNum: e.currentTarget.dataset.roomnum,
      value_roomNumid: e.currentTarget.dataset.id,
      share_vagule: false
    })
  },
  // 模糊搜索确认按钮console.log()
  kuangbtnshare: function () {
    let that = this
    let roomNum = that.data.value_roomNum
    console.log(that.data.share_id)
    wx.request({
      url: app.globalData.publicAdress + 'api/ShareBoxUserRoom',
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'Accept': 'application/vnd.cowsms.v2+json',
        'Authorization': 'Bearer ' + wx.getStorageSync("token"),
      },
      data: {
        share_id: that.data.share_id,
        box_cell_id: that.data.value_roomNumid
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
          showSuccess('添加成功')
        }
        if (res.statusCode == 403) {
          console.log(res)
          showSuccess(res.data.mes)
        }
      }
    })
    this.setData({
      share_space: false,
      value_roomNum: null
    })
    // showSuccess('添加成功')
    that.shareallboxdata(wx.getStorageSync('ids'))
  },
  // 添加可开箱人
  share_peoplebox: function (e) {
    console.log(e.currentTarget.dataset)
    this.setData({
      share_people: true,
      share_id: e.currentTarget.dataset.share_id
    })

  },
  // 添加可开箱人输入事件
  space_people: function (e) {
    console.log(e.detail.value)
    this.setData({
      value_people: e.detail.value
    })
  },
  //添加可开箱人事件确认
  share_peopleaA: function () {
    let that = this
    console.log(that.data.value_people)
    console.log(that.data.share_id)
    let phone_rez = /^1\d{10}$/
    if (phone_rez.test(that.data.value_people)) {
      // 调用添加接口
      wx.request({
        url: app.globalData.publicAdress + 'api/ShareBoxUser',
        method: 'POST',
        header: {
          'content-type': 'application/json', // 默认值
          'Accept': 'application/vnd.cowsms.v2+json',
          'Authorization': 'Bearer ' + wx.getStorageSync("token"),
        },
        data: {
          share_id: that.data.share_id,
          phone: that.data.value_people
        },
        success(res) {
          if (res.header.Authorization) {
            var str = res.header.Authorization;
            wx.removeStorageSync("token");
            wx.setStorageSync("token", str.substring(7, str.length))
          }
          if (res.statusCode == 200) {
            console.log(res)
            showSuccess('添加成功')
          }
          if (res.statusCode == 403) {
            console.log(res)
            showSuccess(res.data.mes)
          }
        }
      })
      this.setData({
        share_people: false,
        value_people: ''
      })
    } else {
      showSuccess('请输入正确的手机号')
    }
    that.shareallboxdata(wx.getStorageSync('ids'))

  },
  share_peopleB: function () {
    this.setData({
      share_people: false
    })
    showSuccess('已取消')
  },
  // 我的预约箱一键复制
  copyme: function (e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.password,
    })
  },
  // 点击扫码啊获取运单号
  editbox: function (e) {
    let that = this
    console.log(e)
    wx.scanCode({
      scanType: ['barCode'], //条形码
      success(res) {
        console.log(res.result) //扫描条形码获取的单号
        wx.request({
          url: app.globalData.publicAdress + 'api/ShareBoxComment',
          method: 'POST',
          header: {
            'content-type': 'application/json', // 默认值
            'Accept': 'application/vnd.cowsms.v2+json',
            'Authorization': 'Bearer ' + wx.getStorageSync("token"),
          },
          data: {
            share_id: e.currentTarget.dataset.id,
            text: res.result
          },
          success(response) {
            if (response.header.Authorization) {
              var str = response.header.Authorization;
              wx.removeStorageSync("token");
              wx.setStorageSync("token", str.substring(7, str.length))
            }
            if (response.statusCode == 200) {
              console.log(response)
              that.shareallboxdata(wx.getStorageSync('ids'))
            }
          }
        })
      }
    })
    // console.log('编辑运单号')
    // if (this.data.isDisabled) {
    //   this.setData({
    //     isDisabled: false
    //   })
    // } else {
    //   this.setData({
    //     isDisabled: true
    //   })
    // }
  },
  // 点击复制
  copy: function (e) {
    console.log(e)
    console.log(e.currentTarget.dataset.oddnumber)
    let that = this
    wx.setClipboardData({
      data: e.currentTarget.dataset.oddnumber,
      success(res) {
        console.log(res)
      }
    })
  },
  //复制密码
  sharepass: function (e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.password,
    })
  },
})