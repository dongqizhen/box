// pages/start/start.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    box_id:'',
    scene:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    // options.scene = '3668%2Cbfea42a82c99e4d'
    if(Reflect.ownKeys(options).length){
      wx.setStorageSync('options', JSON.stringify(options))
    }else{
      wx.removeStorageSync('options')
    }
    setTimeout(()=>{      
      wx.switchTab({
        url: '../index/index',
      })
    },3000)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady () {
    
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

  }
})