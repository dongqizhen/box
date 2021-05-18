const app = getApp();

Page({
    data: {
        imgUrls: [

        ],
        value:1,
        swiperCurrent:0,
        detail:{},
        id:'',
        title:''
    },
    onLoad(options) {
      const {id} = options
      this.setData({
        id
      })
      this.getDetails(id)
    },
    //购买
    onTapBuy(){
      const box_id = wx.getStorageSync('ids')
      const {value,id} = this.data
      wx.request({
        url: app.globalData.publicAdress + "api/goods/" + id,
            method: "POST",
            header: {
                Authorization: "Bearer " + wx.getStorageSync("token"),
            },
            data:{
              num:value,
              box_id
            },
            success:(res)=>{
              console.log(res)
              const {code,res:pay} = res.data
              if(code == 0){
                this.pay(pay)
              }
            }
      })
    },
    //获取详情
    getDetails(id){
      wx.request({
        url: app.globalData.publicAdress + "api/goods/" + id,
            method: "GET",
            header: {
                Authorization: "Bearer " + wx.getStorageSync("token"),
            },
            success:(res)=>{
              console.log(res)
              const {banner,name} = res.data.data
              this.setData({
                title:name,
                imgUrls:banner,
                detail:res.data.data
              })
            }
      })
    },
    call(){
      const {phone} = this.data.detail.get_supplier_info

      wx.makePhoneCall({
        phoneNumber: phone,
      })
    },
    input(e){
      let {value} = e.detail
      this.setData({
        value
      })
    },
    blur(e){
      let {value} = e.detail
      if(value == 0 || value == ''){
        this.setData({
          value:1
        })
      }
    },
    onClickLeft() {
      wx.navigateBack({
        delta: 0,
      })
    },
    swiperChange: function (e) {
      this.setData({
        swiperCurrent: e.detail.current
      })
    },
     //支付
     pay(res) {
      const {
          appid,
          timeStamp,
          package: packages,
          nonceStr,
          sign: paySign,
          signType,
      } = res;
      //调起支付
      wx.requestPayment({
          appid,
          timeStamp,
          nonceStr,
          package: packages,
          signType,
          paySign,
          success: (res) => {
              wx.showToast({
                  title: "支付成功",
              });

              console.log(res)

             
              
          },
          fail: (res) => {
            wx.showToast({
              title: "取消支付",
              icon:'none'
            });
          },
          complete: (res) => {},
      });
  },
});
