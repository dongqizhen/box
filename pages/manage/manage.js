// pages/manage/manage.js
const app = getApp()
// 显示繁忙提示
var showBusy = text => wx.showToast({
  title: text,
  icon: 'loading',
  duration: 10000
});

// 显示成功提示
var showSuccess = text => wx.showToast({
  title: text,
  icon: 'none'
});

// 显示失败提示
var showModel = (title, content) => {
  wx.hideToast();

  wx.showModal({
    title,
    content: JSON.stringify(content),
    showCancel: false
  });
};
var url; //获取当前页面路径
Page({

  /**
   * 页面的初始数据
   */
  data: {
    visible: false,
    nickName: "", //昵称
    type: "", //是否为房主
    avatar_url: "", //头像
    phoneNumber: "", //手机号
    comment: "", //备注
    noneuser: '',
    userList: "", //成员列表
    card_user: "", //当前绑卡成员列表
    phone: "", //删除成员 传给后台的手机号
    reversePhoe: "", //转让房主 传给后台的手机号
    tempPwd: "",
    pwd1: "", //临时密码1
    pwd2: "", //临时密码2
    pwdnum: "", //传给后台的  临时密码值    1    2   
    cardphone: "", //绑卡成员手机号
    cardtype: null,
    canIUseGetUserProfile:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    if (wx.getUserProfile) {
      this.setData({
         canIUseGetUserProfile: true
      })
    }

    // console.log(wx.getStorageSync('boxid'))
  },
  //我的格口
  mygroup: function () {
    var that = this;
    that.LatticeInfo()
    console.log(that.data.userList)
    //我的格口
    wx.request({
      url: app.globalData.publicAdress + 'api/myBoxCell',
      method: 'get',
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
          wx.removeStorageSync("token");
          wx.setStorageSync("token", str.substring(7, str.length))
        }
        if (res.statusCode == '200') {
          let arr = []
          that.setData({

          })
          for (var i = 0; i < res.data.length; i++) {
            if (res.data[i].box_cell_id == wx.getStorageSync('boxid')) {
              // console.log(wx.getStorageSync('boxid'))
              // arr.push(res.data[i].get_cell_info.card_id)
              // console.log(arr)
              for (let y in res.data[i].get_cell_info.card_id) {
                if (res.data[i].get_cell_info.card_id[y].id != '') {
                  // console.log(that.data.userList)
                  // console.log(y)
                  // console.log(res.data[i].get_cell_info.card_id[y].id)
                  res.data[i].get_cell_info.card_id[y].type = y.substring(y.length - 1)
                  if (res.data[i].get_cell_info.card_id[y].id != null && res.data[i].get_cell_info.card_id[y].id != '') {
                    arr.push(res.data[i].get_cell_info.card_id[y])
                    // console.log(res.data[i].get_cell_info.card_id[y].id)
                    // console.log('进来了')
                  }
                  // arr.push({type:res.data[i].get_cell_info.card_id[y]})
                  // console.log(arr)
                  that.setData({
                    card_user: arr
                  })
                  // console.log(that.data.card_user)
                }
              }
              // console.log(res.data[i].get_cell_info.tmp_pwd)
              if (res.data[i].get_cell_info.tmp_pwd != null) {
                if (res.data[i].get_cell_info.tmp_pwd.Temp1Pswd.passwd != "" && res.data[i].get_cell_info.tmp_pwd.Temp1Pswd.passwd != null) {
                  if (res.data[i].get_cell_info.tmp_pwd.Temp2Pswd.passwd != "" && res.data[i].get_cell_info.tmp_pwd.Temp2Pswd.passwd != null) {
                    that.setData({
                      tempPwd: res.data,
                      pwd1: res.data[i].get_cell_info.tmp_pwd.Temp1Pswd.passwd,
                      pwd2: res.data[i].get_cell_info.tmp_pwd.Temp2Pswd.passwd,
                    })
                  }else{
                    that.setData({
                      tempPwd: res.data,
                      pwd1: res.data[i].get_cell_info.tmp_pwd.Temp1Pswd.passwd,
                      pwd2: '',
                    })
                  }
                }else{
                   if(res.data[i].get_cell_info.tmp_pwd.Temp2Pswd.passwd != "" && res.data[i].get_cell_info.tmp_pwd.Temp2Pswd.passwd != null){
                    that.setData({
                      tempPwd: res.data,
                      pwd1: '',
                      pwd2: res.data[i].get_cell_info.tmp_pwd.Temp2Pswd.passwd,
                    })
                   }else{
                    that.setData({
                      tempPwd: '',
                      pwd1: '',
                      pwd2: '',
                    })
                   }
                }
              } else {
                that.setData({
                  tempPwd: '',
                  pwd1: '',
                  pwd2: '',
                })
              }

              // console.log(that.data)
              // console.log(arr)
            }
          }
          // console.log(arr)
          // console.log(that.data.userList)
          for (let z = 0; z < that.data.userList.length; z++) {
            for (let c = 0; c < arr.length; c++) {
              if (that.data.userList[z].userid == arr[c].userid) {
                // console.log(that.data.userList.userid)
                arr[c].avatar_url = that.data.userList[z].get_user_info.avatarurl
                arr[c].nickname = that.data.userList[z].get_user_info.nickname
                // console.log(arr)
              }
            }
          }
          //将获取到的东西放在data对象中
          that.setData({
            card_user: arr
          })
          console.log(that.data.card_user)
          // console.log(that.data.card_user)
        }
      }
    })
  },
  //监听手机号输入
  changePhone: function (e) {
    var that = this;
    that.setData({
      phoneNumber: e.detail.value
    })
  },
  comment: function (e) {
    var that = this;
    that.setData({
      comment: e.detail.value
    })
  },
  //添加成员
  addMember: function () {
   const a =  this.verify()

   if(!wx.getStorageSync('isPhone')) return
    
    this.Modal.showModal();
  },
  //转让房主
  reverse: function (e) {
    var that = this;
    wx.removeStorageSync('userids')
    wx.setStorageSync('userids', e.currentTarget.dataset.id)
    that.setData({
      reversePhoe: e.currentTarget.dataset.reversephone
    })
    this.ModalChange.showModal();
  },

  login(e = {}){
    this.verify(e)
  },

  //验证登陆
 async verify(e = {}){
    if(!wx.getStorageSync('isPhone')){
      if(!wx.getStorageSync('wx_userInfo')){
        if(e.detail && e.detail.userInfo){
          const {userInfo} = e.detail    
          app.globalData.userInfo = userInfo
          wx.setStorageSync('wx_userInfo', userInfo)
          // this.globalData.wx_userInfo = userInfo
          app.globalData.profile_user = e.detail
          wx.navigateTo({
            url: '../login-frame/login-frame',
          })
          return
        }
        await app.getUserProfile().then((res)=>{
          wx.navigateTo({
            url: '../login-frame/login-frame',
          }) 
        }).catch(()=>{
          wx.setStorageSync("baseUrl", url);
          wx.navigateTo({
            url: '../login/login',
          })
        })
        return false
      }else{
        wx.navigateTo({
          url: '../login-frame/login-frame',
        })

        return false
      }


      
    }else{
      return true
    }
    
  },


  //删除成员
  delete: function (e) {
    console.log(e)
    wx.removeStorageSync('userids')
    wx.setStorageSync('userids', e.currentTarget.dataset.id)

    // console.log(e.currentTarget.dataset.id)
    var that = this;
    that.setData({
      phone: e.currentTarget.dataset.phone
    })
    this.ModalDelete.showModal();
  },
  //添加绑卡
  addCard: function () {
    this.verify()
    if(!wx.getStorageSync('isPhone')) return
    this.ModalAdd.showModal();

  },
  //删除绑卡成员
  deleteCard: function (e) {
    console.log(e)
    this.setData({
      cardphone: e.currentTarget.dataset.cardphone,
      cardtype: e.currentTarget.dataset.type
    })
    this.ModalDeleteCard.showModal()
  },

  //创建变更临时密码
  temporary: function (e) {
    var that = this;
    this.verify()
    if(!wx.getStorageSync('isPhone')) return
    that.setData({
      pwdnum: e.currentTarget.dataset.type
    })
    that.ModalTemporary.showModal();
  },
  //删除临时密码
  deleteTemporary: function (e) {
    var that = this;
    this.verify()
    if(!wx.getStorageSync('isPhone')) return
    // console.log(e)
    that.setData({
      pwdnum: e.currentTarget.dataset.type
    })
    that.ModaldeteteTemporary.showModal()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.Modal = this.selectComponent("#modal");
    this.ModalChange = this.selectComponent("#change");
    this.ModalDelete = this.selectComponent("#delete");
    this.ModalAdd = this.selectComponent("#addCard");
    this.ModalDeleteCard = this.selectComponent("#deleteCard")
    this.ModalTemporary = this.selectComponent("#modalTemporary");
    this.ModaldeteteTemporary = this.selectComponent("#deteteTemporary")
  },
  //添加成员确定
  _confirmEventFirst: function () {
    var that = this;
    if (that.data.phoneNumber.length == 0 || that.data.phoneNumber.length != 11) {
      wx.showToast({
        icon: "none",
        duration: 2000,
        title: '请输入正确的手机号格式',
      })
    } else {
      ///添加成员
      // console.log(wx.getStorageSync("boxid"))
      // console.log(that.data.phoneNumber)
      wx.request({
        url: app.globalData.publicAdress + 'api/addUser',
        method: 'POST',
        header: {
          'content-type': 'application/json', // 默认值
          'Accept': 'application/vnd.cowsms.v2+json',
          'Authorization': 'Bearer ' + wx.getStorageSync("token"),
        },
        data: {
          "box_cell_id": wx.getStorageSync("boxid"),
          "phone": that.data.phoneNumber
        },
        success: function (res) {
          console.log(res)
          //如果token失效   则返回新的token  
          if (res.header.Authorization) {
            var str = res.header.Authorization;
            wx.removeStorageSync("token");
            wx.setStorageSync("token", str.substring(7, str.length))
          }
          if (res.statusCode == '200') {
            that.Modal.hideModal();
            showSuccess(res.data.data)
            that.setData({
              phoneNumber: ""
            })
            that.LatticeInfo()
          } else if (res.statusCode == '400' || res.statusCode == '422' || res.statusCode == '429') {
            that.Modal.hideModal();
            that.setData({
              phoneNumber: ""
            })
            showSuccess(res.data.errors.message[0]);

          } else if (res.statusCode == '403') {
            that.Modal.hideModal();
            that.setData({
              phoneNumber: ""
            })
            showSuccess(res.data.mes);
          }
        }
      })
    }
  },
  //创建、变更 确定  转让房主 确定
  _confirmEventChange: function () {
    var that = this;
    wx.request({
      url: app.globalData.publicAdress + 'api/moveAdmin',
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'Accept': 'application/vnd.cowsms.v2+json',
        'Authorization': 'Bearer ' + wx.getStorageSync("token"),
      },
      data: {
        "box_cell_id": wx.getStorageSync('boxid'),
        "userid": wx.getStorageSync('userids')
      },
      success: function (res) {
        //如果token失效   则返回新的token  
        if (res.header.Authorization) {
          var str = res.header.Authorization;
          wx.removeStorageSync("token");
          wx.setStorageSync("token", str.substring(7, str.length))
        }
        if (res.statusCode == '200') {
          that.ModalChange.hideModal();
          showSuccess(res.data.data)
          that.LatticeInfo()
        } else if (res.statusCode == '400' || res.statusCode == '422' || res.statusCode == '429') {
          that.ModalChange.hideModal();
          showSuccess(res.data.errors.message[0]);
        }
      }
    })

  },
  //删除成员确定.
  _confirmEventDelete: function (e) {
    // console.log(wx.getStorageInfoSync('userids'))
    var that = this;
    // var phone = e.
    wx.request({
      url: app.globalData.publicAdress + 'api/deleteGroupUser',
      method: 'delete',
      header: {
        'content-type': 'application/json', // 默认值
        'Accept': 'application/vnd.cowsms.v2+json',
        'Authorization': 'Bearer ' + wx.getStorageSync("token"),
      },
      data: {
        "box_cell_id": wx.getStorageSync('boxid'),
        "phone": that.data.phone
      },
      success: function (res) {
        // console.log(res)
        //如果token失效   则返回新的token  
        if (res.header.Authorization) {
          var str = res.header.Authorization;
          wx.removeStorageSync("token");
          wx.setStorageSync("token", str.substring(7, str.length))
        }
        if (res.statusCode == '200') {
          that.ModalDelete.hideModal();
          showSuccess(res.data.mes)
          that.LatticeInfo()

        } else if (res.statusCode == '400' || res.statusCode == '422' || res.statusCode == '429') {
          that.ModalDelete.hideModal();
          showSuccess(res.data.errors.message[0]);
        } else if (res.statusCode == '401') {
          that.ModalDelete.hideModal();
          showSuccess(res.data.mes)
        }
      }
    })

  },
  //添加绑卡确定
  _confirmEventAdd: function () {
    var that = this;
    // console.log(that.data.comment)
    if (that.data.comment.length == 0) {
      wx.showToast({
        icon: "none",
        duration: 2000,
        title: '请输入备注',
      })
    } else {
      wx.request({
        url: app.globalData.publicAdress + 'api/bindCard',
        method: 'post',
        header: {
          'content-type': 'application/json', // 默认值
          'Accept': 'application/vnd.cowsms.v2+json',
          'Authorization': 'Bearer ' + wx.getStorageSync("token"),
        },
        data: {
          "IotId": wx.getStorageSync('iotid'),
          "cellNum": wx.getStorageSync('cellnum'),
          "box_cell_id": wx.getStorageSync("boxid"),
          "comment": that.data.comment,
        },
        success: function (res) {
          // console.log(res)
          //如果token失效   则返回新的token  
          if (res.header.Authorization) {
            var str = res.header.Authorization;
            wx.removeStorageSync("token");
            wx.setStorageSync("token", str.substring(7, str.length))
          }
          if (res.statusCode == '200') {
            that.ModalAdd.hideModal()
            showSuccess(res.data.mes)
            that.LatticeInfo()
            that.mygroup()
          } else if (res.statusCode == '400' || res.statusCode == '422' || res.statusCode == '429') {
            that.ModalAdd.hideModal()
            showSuccess(res.data.errors.message[0]);
          } else if (res.statusCode == '403') {
            that.ModalAdd.hideModal()
            showSuccess(res.data.mes)
          }
        }
      })
    }

  },
  //删除绑卡成员确定
  _confirmEventDeleteCard: function () {
    // console.log(wx.getStorageSync("boxid"))
    // console.log(wx.getStorageSync('cellnum'))
    // console.log(wx.getStorageSync('iotid'))
    var that = this;
    wx.request({
      url: app.globalData.publicAdress + 'api/deleteCard',
      method: 'delete',
      header: {
        'content-type': 'application/json', // 默认值
        'Accept': 'application/vnd.cowsms.v2+json',
        'Authorization': 'Bearer ' + wx.getStorageSync("token"),
      },
      data: {
        "IotId": wx.getStorageSync('iotid'),
        "cellNum": wx.getStorageSync('cellnum'),
        "box_cell_id": wx.getStorageSync("boxid"),
        "type": that.data.cardtype
      },
      success: function (res) {
        console.log(res)
        //如果token失效   则返回新的token  
        if (res.header.Authorization) {
          var str = res.header.Authorization;
          wx.removeStorageSync("token");
          wx.setStorageSync("token", str.substring(7, str.length))
        }
        if (res.statusCode == '200') {
          that.ModalDeleteCard.hideModal()
          showSuccess(res.data.mes)
          that.LatticeInfo()
          // 需要重新调用获取绑卡接口
          that.mygroup()
          // console.log(that.data.card_user)
        } else if (res.statusCode == '400' || res.statusCode == '422' || res.statusCode == '429') {
          that.ModalDeleteCard.hideModal()
          showSuccess(res.data.errors.message[0]);
        }
      }
    })

  },
  //创建变更临时密码确定
  _confirmEventTemporary: function () {
    var that = this;
    wx.request({
      url: app.globalData.publicAdress + 'api/createTempPwd',
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'Accept': 'application/vnd.cowsms.v2+json',
        'Authorization': 'Bearer ' + wx.getStorageSync("token"),
      },
      data: {
        "IotId": wx.getStorageSync('iotid'),
        "cellNum": wx.getStorageSync('cellnum'),
        "box_cell_id": wx.getStorageSync("boxid"),
      },
      success: function (res) {
        //如果token失效   则返回新的token  
        if (res.header.Authorization) {
          var str = res.header.Authorization;
          wx.removeStorageSync("token");
          wx.setStorageSync("token", str.substring(7, str.length))
        }
        if (res.statusCode == '200') {
          that.ModalTemporary.hideModal()
          showSuccess(res.data.mes)
          that.LatticeInfo()
          that.mygroup()
        } else if (res.statusCode == '400' || res.statusCode == '422' || res.statusCode == '429') {
          that.ModalTemporary.hideModal()
          showSuccess(res.data.errors.message[0]);
        } else if (res.statusCode == '403') {
          that.ModalTemporary.hideModal()
          showSuccess(res.data.mes)
        }
      }
    })

  },
  //删除临时密码确定
  _confirmEventdeteteTemporary: function () {
    var that = this;
    // console.log(that.data.pwdnum)
    wx.request({
      url: app.globalData.publicAdress + 'api/deleteTempPswd',
      method: 'delete',
      header: {
        'content-type': 'application/json', // 默认值
        'Accept': 'application/vnd.cowsms.v2+json',
        'Authorization': 'Bearer ' + wx.getStorageSync("token"),
      },
      data: {
        "type": that.data.pwdnum,
        "IotId": wx.getStorageSync('iotid'),
        "cellNum": wx.getStorageSync('cellnum'),
        "box_cell_id": wx.getStorageSync("boxid"),

      },
      success: function (res) {
        //如果token失效   则返回新的token  
        if (res.header.Authorization) {
          var str = res.header.Authorization;
          wx.removeStorageSync("token");
          wx.setStorageSync("token", str.substring(7, str.length))
        }
        if (res.statusCode == '200') {
          that.ModaldeteteTemporary.hideModal();
          showSuccess(res.data.mes)
          that.LatticeInfo()
          that.mygroup();
        } else if (res.statusCode == '400' || res.statusCode == '422' || res.statusCode == '429') {
          that.ModaldeteteTemporary.hideModal();
          showSuccess(res.data.errors.message[0]);
        }
      }
    })

  },
  _cancelEvent: function () {
    console.log("点击取消!");
  },
  _cancelEventChange: function () {
    console.log("点击取消!");
  },
  LatticeInfo: function () {
    var that = this;
    //成员列表   阁孔详情
    wx.request({
      url: app.globalData.publicAdress + 'api/myGroup',
      method: 'get',
      header: {
        'content-type': 'application/json', // 默认值
        'Accept': 'application/vnd.cowsms.v2+json',
        'Authorization': 'Bearer ' + wx.getStorageSync("token"),
      },
      data: {
        "box_cell_id": wx.getStorageSync("boxid")
      },
      success: function (res) {
        console.log(res)
        //如果token失效   则返回新的token  
        if (res.header.Authorization) {
          var str = res.header.Authorization;
          wx.removeStorageSync("token");
          wx.setStorageSync("token", str.substring(7, str.length))
        }
        // console.log(res)
        if (res.statusCode == '200') {
          that.setData({
            userList: res.data
          })
        } else if (res.statusCode == '400' || res.statusCode == '422' || res.statusCode == '429') {
          showSuccess(res.data.errors.message[0]);
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // console.log(this.data.userList)
    var that = this;
    if(!wx.getStorageSync('isPhone')) return
    that.mygroup();
    url = that.route;
    wx.removeStorageSync("baseUrl");
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
    that.LatticeInfo();
    // 查看是否授权
  
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

  }
})