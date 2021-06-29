//index.js
var shuju = require("../../mockjs/sharebox");
//获取应用实例
const app = getApp();
const utils = require("../../utils/util");
// 显示繁忙提示
var showBusy = (text) =>
    wx.showToast({
        title: text,
        icon: "loading",
        duration: 10000,
    });
var url; //获取当前页面路径
// 显示成功提示
var showSuccess = (text) =>
    wx.showToast({
        title: text,
        icon: "none",
    });

// 显示失败提示
var showModel = (title, content) => {
    wx.hideToast();

    wx.showModal({
        title,
        content: content,
        showCancel: false,
    });
};
Page({
    data: {
        statusBarHeight:'',
        topic: "", //二维码携带的参数
        // select: true,
        current:0, //轮播的当前下标
        tihuoWay: "",
        time:3,
        showAd:false,
        ad_list:{}, //广告
        banner_list:[],
        adUrl:'',
        area_id:'',//小区id
        list: [],
        cabinet_id: "", //箱子id
        lattice_id: "", //阁孔id
        imgSrc: "../../images/jiantou2.png",
        imgpull: "/images/bottompull.png",
        remarkinfo: [false, true],
        idx: 0,
        roomNum: "",
        visible: false,
        text: "创建/变更", //创建还是变更
        pwd: "",
        logo: "", //箱子图片
        houseMessage: "",
        result: "",
        addressList: "",
        initpswd: "",
        iconfram: false,
        tan: false, //是否显示弹框
        contenttext: null,
        _ver: null,
        _boxid: null,
        tishi: null,
        ti: false,
        good: {
            //商品信息
            name: "",
            price: 0,
            orderId: "",
        },
        order: false, // 是否显示下单弹框
        share_order: false, //共享箱子支付
        share_order_info: {
            cost: 0,
            payInfo: {},
        },
        couseid: null,
        saotext: true,
        daojishi: "6", // 关闭箱子倒计时
        saomazhi: false, //ios扫码兼容问题
        mohushu: null, //模糊搜索输入的内容
        is_mysharebox: true, //我的共享箱是否有预约
        existence: true, //判断当前柜子是否存在专属柜口
        share_space: false, //根据户号添加弹框
        isDisabled: true, //判断运单号编辑
        value_roomNumid: null, //模糊搜索传递的id
        waybilll_value: "请输入运单号", //运单号
        sharekuang: false, //删除共享箱弹框确认
        itcp: null, //判断是否为扫码进入小程序
        //我的共享箱列表
        waybilllist: null,
        share_id: null, //点击添加可开箱人当前箱子的id
        share_phone: null, //点击删除共享箱成员手机号
        boxcellid: null, //点击添加的box_cell_id
        keyboard_pwd: false, //底部键盘开关
        share_people: false, //添加开箱人开关
        value_roomNum: "", //模糊搜索的初始内容
        value_people: "", //添加开箱人手机号
        shareCellNum: 0, //是否存在共享箱
        share_vagule: false, //模糊搜索下拉开关
        myshareju: true, //我的共享箱是否再当前柜子
        myshateapp: true, //共享箱子是否再当前柜子
        mybox: null,
        share_tishi: false, //提示是否关闭箱子开关
        myShareBox: {
            jurisdiction: 0, //权限
            appointment: 0, //预约
        },
        // 我的预约
        subscribe: null,
        selectIndex:null,//显示地址下标
        // 当前柜子得共享箱
        sharebox: 0,
        share_openusebox: false, //开箱按钮弹出
        signature: null, //开箱密钥
        timestamp: null, //开箱时间戳
        share_box_cell_id: null, //一键开箱id
        kaiguan: true,
        jianpan_password: null, //键盘输入的密码
        footer_password: false,
        footer_box_clee_id: null, //底部键盘输入密码柜口id
        share_type: null, //输入密码返回类型
        passwd_box_cell_id: null, //扫码获取到的柜子id
        new_box_cell_id: "",
        canIUseGetUserProfile: false,
    },
    //监听手机号输入
    changePhone: function (e) {
        var that = this;
        that.setData({
            pwd: e.detail.value,
        });
    },
    closeAd(){
        this.setData({
            showAd:false
        })
    },
    getBanner(area_id,type){
        wx.request({
            url: app.globalData.publicAdress + "api/ads",
            method: "GET",
            header: {
                Authorization: "Bearer " + wx.getStorageSync("token"),
            },
            data: {
                area_id,
                type
            },
            success:(res)=>{
                
                const {data} = res.data
                console.log(2222,type,data)
                if(type == 1){
                    if(data.length){
                        this.setData({
                            showAd:true,
                            ad_list:data[0]
                        })
                    }
                }else{
                    this.setData({
                        banner_list:[]
                    })
                    this.setData({
                        banner_list:[...data],
                        current:0
                    })
                }

                console.log(this.data.current)
                // if(data.length){
                //     if(type == 1){
                        
                //     }else{
                //         this.setData({
                //             banner_list:[]
                //         })
                //         this.setData({
                //             banner_list:data
                //         })
                //     }
                    
                // }else{
                //     this.setData({
                //         banner_list:[]
                //     }) 
                // }
            }
        })
    },
    onLoad(options) {
        console.log("创建页面",app);
        const {statusBarHeight} = app.globalData
        let that = this;
       
        that.setData({
            statusBarHeight 
        })
        app.watch(this, {
            tihuoWay: (newVal) => {
                console.log(newVal,that.data.addressList);
                // this.setData({
                //     roomNum: newVal.split("单元")[1],
                // });
            },
            showAd:(newVal)=>{
                if(newVal){
                    this.setData({
                        time:3
                    })

                  let timer = setInterval(()=>{
                        if(this.data.time == 0){
                            clearInterval(timer)
                            this.setData({
                                showAd:false
                            })
                            return
                        }
                        this.setData({
                            time:this.data.time -= 1
                        })
                    },1000)
                    
                    
                }
            },
            area_id:(newVal)=>{
                console.log('地址',newVal)
                this.getBanner(newVal,1)
                this.getBanner(newVal,2)
            }
        });

        if (wx.getUserProfile) {
            this.setData({
                canIUseGetUserProfile: true,
            });
        }

        console.log(options,1111);
        //解决微信直接扫码问题
        if(!Reflect.ownKeys(options).length){
            options = wx.getStorageSync('options')
        }
        // 扫柜子码进入
        if (options.box_id ) {
            // that.setData({
            //   boxid: options.box_id
            // })
            console.log(that.data.addressList);
            console.log(that.data.boxid);
            wx.removeStorageSync("ids");
            wx.setStorageSync("saoma", "ok");
            wx.setStorageSync("ids", options.box_id);
            // wx.removeStorageSync('boxid')
            // wx.setStorageSync('boxid', options.box_id)
            // 获取柜子信息接口
            wx.request({
                url: app.globalData.publicAdress + "api/BoxInfo",
                method: "GET",
                header: {
                    "content-type": "application/json", // 默认值
                    Accept: "application/vnd.cowsms.v2+json",
                    Authorization: "Bearer " + wx.getStorageSync("token"),
                },
                data: {
                    box_id: options.box_id,
                },
                success(res) {
                    console.log(res);
                    if (res.header.Authorization) {
                        var str = res.header.Authorization;
                        wx.removeStorageSync("token");
                        wx.setStorageSync(
                            "token",
                            str.substring(7, str.length)
                        );
                    }
                    if (res.statusCode == "200") {
                        let content =
                            res.data.data.get_area_info.name +
                            res.data.data.get_area_info.area_name +
                            res.data.data.unit +
                            res.data.data.town;
                        console.log(content);
                        that.setData({
                            area_id:res.data.data.area_id
                        })
                        // 查看当前柜子有没有格口  传递参数box_id、content(顶部显示内容)
                        that.saogui(options.box_id, content);
                        console.log("有东西");
                        // 判断该柜子是否有共享柜子
                        if (res.data.data.get_cell_info != null) {
                            that.setData({
                                // 有的话放在shareCellNum中
                                shareCellNum: res.data.data.get_cell_info, //控制共享箱--显示
                            });
                            // 共享箱状态查询----返回该柜子共享箱总数量和可用数量
                            that.sharestate(options.box_id);
                            // 我的共享箱   传box_id 时，查找我在此柜子的共享箱（首页）
                            that.shareallboxdata(options.box_id);
                        } else {
                            that.setData({
                                shareCellNum: 0, //控制共享箱--隐藏
                            });
                        }
                    }
                },
            });
            // 将按钮颜色改变
            that.setData({
                itcp: options.box_id,
            });
            // that.saogui(options.box_id)
        }
        
        //扫格口码
        if (options.scene) {
            console.log('options.scene',options.scene)
            let scene = decodeURIComponent(options.scene);
            console.log(scene);
            console.log(options);
            var str = scene.indexOf(",");
            var boxid = scene.substring(0, str); //取,前的字符
            var ver = scene.substring(str + 1); //取,后的字符
            that.setData({
                _ver: ver,
                _boxid: boxid,
            });
            this.scan_opan();
        }

        if (!wx.getStorageSync("ids")) return;

        // 获取柜子信息BoxInfo
        that.shareboxInfo(wx.getStorageSync("ids")); //获取共享柜子信息
        // that.shareallboxdata()
        console.log(that.data.sharebox);
        // 查询当前柜子我的共享箱myShareBox
        that.shareallboxdata(wx.getStorageSync("ids")); //我的共享箱查询
        that.sharestate(wx.getStorageSync("ids")); //共享箱总数量和可用数量
        that.myShareBoxStatus(wx.getStorageSync("ids")); //我的共享箱有预约的和有权限的数量查看
    },
    // 共享箱状态查询
    sharestate: function (box_id) {
        let that = this;
        wx.request({
            url: app.globalData.publicAdress + "api/shareBoxStatus",
            method: "GET",
            header: {
                "content-type": "application/json", // 默认值
                Accept: "application/vnd.cowsms.v2+json",
                Authorization: "Bearer " + wx.getStorageSync("token"),
            },
            data: {
                box_id: box_id,
            },
            success(res) {
                console.log(res);
                if (res.header.Authorization) {
                    var str = res.header.Authorization;
                    wx.removeStorageSync("token");
                    wx.setStorageSync("token", str.substring(7, str.length));
                }
                if (res.statusCode == "200") {
                    if (
                        res.data.data.aliveNum == null ||
                        res.data.data.aliveNum == 0 ||
                        res.data.data.aliveNum == ""
                    ) {
                        if (
                            res.data.data.allNum == null ||
                            res.data.data.allNum == 0 ||
                            res.data.data.allNum == ""
                        ) {
                            that.setData({
                                sharebox: {
                                    aliveNum: 0,
                                    allNum: 0,
                                },
                                shareCellNum: 0,
                            });
                        } else {
                            that.setData({
                                sharebox: {
                                    aliveNum: 0,
                                    allNum: res.data.data.allNum,
                                },
                            });
                        }
                    } else {
                        if (
                            res.data.data.allNum == null ||
                            res.data.data.allNum == 0 ||
                            res.data.data.allNum == ""
                        ) {
                            that.setData({
                                sharebox: {
                                    aliveNum: es.data.data.aliveNum,
                                    allNum: 0,
                                },
                            });
                        } else {
                            that.setData({
                                sharebox: {
                                    allNum: res.data.data.allNum,
                                    aliveNum: res.data.data.aliveNum,
                                },
                            });
                        }
                    }
                }
            },
        });
    },
    // 共享箱状态查询

    // 获取柜子信息BoxInfo
    shareboxInfo: function (ids) {
        let that = this;
        wx.request({
            url: app.globalData.publicAdress + "api/BoxInfo",
            method: "GET",
            header: {
                "content-type": "application/json", // 默认值
                Accept: "application/vnd.cowsms.v2+json",
                Authorization: "Bearer " + wx.getStorageSync("token"),
            },
            data: {
                box_id: ids,
            },
            success(res) {
                console.log(res);
                if (res.header.Authorization) {
                    var str = res.header.Authorization;
                    wx.removeStorageSync("token");
                    wx.setStorageSync("token", str.substring(7, str.length));
                }
                if (res.statusCode == "200") {
                    // let content =
                    //     res.data.data.get_area_info.name +
                    //     res.data.data.get_area_info.area_name +
                    //     res.data.data.town +
                    //     res.data.data.unit;
                    // console.log(content);
                    that.setData({
                        area_id:res.data.data.area_id
                    })
                    // that.saogui(wx.getStorageSync('ids'), content)
                    if (res.data.data.get_cell_info != null) {
                        that.setData({
                            shareCellNum: res.data.data.get_cell_info,
                        });
                        that.sharestate(res.data.data.get_cell_info.box_id);
                    }
                }
            },
        });
    },
    // 获取柜子信息

    //扫一扫
    getScancode: function () {
        let that = this;
        that.setData({});
        // 允许从相机和相册扫码
        wx.scanCode({
            success: (res) => {
                console.log(res);
                if(!res.path) {
                    wx.showToast({
                      title: '无效二维码',
                      icon:'none'
                    })
                    return
                }
                var url = res.path;
                console.log(url)
                var urls = decodeURIComponent(url);
                var str = urls.indexOf(",");
                if (str >= 0) {
                    var boxid = urls.substring(24, str); //取,前的字符
                    var ver = urls.substring(str + 1); //取,后的字符
                    console.log(boxid);
                    console.log(ver);
                    // wx.removeStorageSync('boxid')
                    // wx.setStorageSync('boxid', boxid)
                    that.setData({
                        _ver: ver,
                        _boxid: boxid,
                    });
                    console.log(that.data.itcp);
                    this.scan_opan();
                } else {
                    console.log(urls);
                    let str = urls.indexOf("=");
                    console.log(str);
                    let saoid = urls.substring(str + 1);
                    console.log(saoid);
                    that.setData({
                        itcp: saoid,
                        saomazhi: true, //解决ios扫码问题
                    });

                    console.log(that.data.addressList);
                    console.log("当前itcp的值是：", this.data.itcp);
                    if (
                        that.data.addressList != "" &&
                        that.data.addressList != [] &&
                        that.data.addressList != null
                    ) {
                        for (let i = 0; i < that.data.addressList.length; i++) {
                            wx.removeStorageSync("ids");
                            wx.setStorageSync("ids", saoid);
                            console.log(that.data.addressList[i].ids);
                            if (saoid == that.data.addressList[i].ids) {
                                console.log("当前存在格口");
                                that.setData({
                                    existence: true,
                                });
                                wx.removeStorageSync("saoma");
                                // that.urlname(saoid)
                            }
                            if (saoid != that.data.addressList[i].ids) {
                                console.log("当前没有格口");
                                that.setData({
                                    existence: false,
                                });
                                wx.removeStorageSync("saoma");
                                wx.setStorageSync("saoma", "ok");
                                // that.urlname(saoid)
                            }
                        }
                        // that.shareboxInfo(wx.getStorageSync('ids'))
                        // that.myShareBoxStatus()
                        // that.sharestate(wx.getStorageSync('ids'))
                        // that.shareallboxdata(wx.getStorageSync('ids'))
                    } else {
                        wx.removeStorageSync("ids");
                        wx.setStorageSync("ids", saoid);
                        console.log("没有私人柜口");
                        that.urlname(saoid);
                    }
                    that.urlname(saoid);
                    // 判断我的共享箱是否在
                    that.myShareBoxStatus();
                    // 查看预约是否为当前柜子
                    // wx.request({
                    //   url: app.globalData.publicAdress + 'api/myShareBox',
                    //   method: 'GET',
                    //   header: {
                    //     'content-type': 'application/json', // 默认值
                    //     'Accept': 'application/vnd.cowsms.v2+json',
                    //     'Authorization': 'Bearer ' + wx.getStorageSync("token"),
                    //   },
                    //   data: {
                    //     box_id: saoid
                    //   },
                    //   success(res) {
                    //     if (res.header.Authorization) {
                    //       var str = res.header.Authorization;
                    //       wx.removeStorageSync("token");
                    //       wx.setStorageSync("token", str.substring(7, str.length))
                    //     }
                    //     if (res.statusCode == '200') {
                    //       console.log(res)
                    //       if (res.data.length == 0) {
                    //         that.setData({
                    //           myshareju: false,
                    //           myshateapp: false,
                    //         })
                    //         // myshareju:true,//我的预约是否再当前柜子
                    //         // myshateapp:true,//共享箱子是否再当前柜子
                    //       } else {
                    //         console.log(res)
                    //         that.setData({
                    //           myshareju: true,
                    //           myshateapp: true,
                    //         })
                    //       }
                    //       // 查看当前柜子物理上是否存在共享箱
                    //       that.sharestate(saoid)
                    //     }
                    //   }
                    // })
                    console.log(saoid);

                    // that.sharestate(saoid)
                    that.shareallboxdata(saoid);
                }
            },
        });
    },
    // 扫码判断
    saogui: function (saoid, text) {
        let that = this;
        console.log(saoid, text);
        wx.request({
            url: app.globalData.publicAdress + "api/myBoxCell",
            method: "get",
            header: {
                "content-type": "application/json", // 默认值
                Accept: "application/vnd.cowsms.v2+json",
                Authorization: "Bearer " + wx.getStorageSync("token"),
            },
            success(res) {
                console.log(res);
                if (res.header.Authorization) {
                    var str = res.header.Authorization;
                    wx.removeStorageSync("token");
                    wx.setStorageSync("token", str.substring(7, str.length));
                }
                if (res.statusCode == "200") {
                    // 判断是否有我的私人柜口
                    if (res.data == null || res.data == "" || res.data == []) {
                        // wx.removeStorageSync('selectName')
                        // wx.setStorageSync('selectName', '')
                        wx.removeStorageSync("initpswd");
                        that.setData({
                            tihuoWay: "尚未绑定格口",
                        });
                    } else {
                        // 有私人柜口时
                        console.log("已经有格口");
                        for (let i = 0; i < res.data.length; i++) {
                            // 判断所扫的柜子有柜口的情况下默认显示第一个
                            if (saoid == res.data[i].get_cell_info.box_id) {
                                let content =
                                    res.data[i].get_cell_info.get_area_info
                                        .name +
                                    res.data[i].get_cell_info.get_area_info
                                        .area_name +
                                    res.data[i].get_cell_info.get_box_info
                                        .town +
                                    res.data[i].get_cell_info.get_box_info
                                        .unit +
                                    res.data[i].get_cell_info.roomNum;
                                console.log(content); //将柜口内容获取到
                                wx.removeStorageSync("boxid");
                                wx.setStorageSync(
                                    "boxid",
                                    res.data[i].box_cell_id
                                );
                                wx.removeStorageSync("initpswd");
                                wx.setStorageSync(
                                    "initpswd",
                                    res.data[i].get_cell_info.initPswd
                                );
                                wx.removeStorageSync("iotid");
                                wx.setStorageSync(
                                    "iotid",
                                    res.data[i].get_cell_info.IotId
                                );
                                wx.removeStorageSync("selectName");
                                wx.setStorageSync("selectName", content);
                                wx.setStorageSync('selectRoomNum', res.data[i].get_cell_info.roomNum)
                                wx.removeStorageSync("ids");
                                wx.setStorageSync(
                                    "ids",
                                    res.data[i].get_cell_info.box_id
                                );
                                wx.removeStorageSync("cellnum");
                                wx.setStorageSync(
                                    "cellnum",
                                    res.data[i].get_cell_info.cellNum
                                );
                                that.setData({
                                    addressList: res.data,
                                    boxid: res.data[i].box_cell_id,
                                    iotid: res.data[i].get_cell_info.IotId,
                                    cellnum: res.data[i].get_cell_info.cellNum,
                                    tihuoWay: content,
                                    roomNum: res.data[i].get_cell_info.roomNum,
                                    initpswd:
                                        res.data[i].get_cell_info.initPswd,
                                });
                                that.setData({
                                    existence: true, //控制专属箱子所有内容-----显示
                                });
                                return;
                            } else {
                                console.log("所扫的柜子没有柜口");
                                console.log(text);
                                console.log(res.data[i]);
                                // wx.removeStorageSync('boxid')
                                // wx.removeStorageSync('cellnum')
                                //TODO
                                wx.removeStorageSync("selectName");
                                wx.setStorageSync("selectName", text);
                                wx.removeStorageSync("ids");
                                wx.removeStorageSync("initpswd");
                                wx.setStorageSync("ids", saoid);
                                that.setData({
                                    // saotext: false,
                                    tihuoWay: text,
                                    existence: false, //控制专属箱子所有内容----隐藏
                                });
                                // wx.showToast({
                                //   title: '您当前再所扫柜子未绑定柜口',
                                //   icon: 'none',
                                //   duration: 2000
                                // })
                                // 查共享箱状态
                                // 查看是否有预约箱子
                                that.shareallboxdata(saoid);
                            }
                        }
                    }
                }
            },
        });
    },
    onShow() {
        var that = this;
        url = that.route;
        console.log(that.data.itcp);

        if (wx.getStorageSync("isPhone") != "isPhone") return;

        // // 查询当前柜子我的共享箱myShareBox
        // that.shareallboxdata(wx.getStorageSync('ids'))
        // that.sharestate(wx.getStorageSync('ids'))

        if (!wx.getStorageSync("saoma")) {
            console.log("没有saoma");
            that.LatticeInfo();
            console.log(that.data.saomazhi);
            console.log(wx.getStorageSync("ids"));
            that.shareboxInfo(wx.getStorageSync("ids"));
            that.myShareBoxStatus();
            that.sharestate(wx.getStorageSync("ids"));
            that.shareallboxdata(wx.getStorageSync("ids"));
        } else {
            console.log("有saoma");
            console.log(that.data.saomazhi);
            that.shareboxInfo(wx.getStorageSync("ids"));
            that.myShareBoxStatus();
            that.sharestate(wx.getStorageSync("ids"));
            that.shareallboxdata(wx.getStorageSync("ids"));
        }
        // that.setData({
        //   saomazhi: false
        // })
    },
    //获取格子类型处理业务
    scan_opan() {
        const that = this;
        wx.request({
            url: app.globalData.publicAdress + "api/CellInfo",
            method: "GET",
            header: {
                "content-type": "application/json", // 默认值
                Accept: "application/vnd.cowsms.v2+json",
                Authorization: "Bearer " + wx.getStorageSync("token"),
            },
            data: {
                box_cell_id: this.data._boxid,
            },
            success: (res) => {
                console.log(res);

                //type 1 信报箱 3 共享箱 4 售卖箱
                const { text: name, type, price, orderId } = res.data;
                let tishi = null;

                if (type == 1) {
                    tishi = "是否绑定当前柜口";
                    this.setData({
                        tan: true,
                        contenttext: name,
                    });
                } else if (type == 3) {
                    tishi = "";
                } else if (type == 4) {
                    if (!orderId) {
                        showModel("提示", "获取商品信息失败");
                        return;
                    }
                    tishi = "是否下单";
                    this.setData({
                        order: true,
                        good: {
                            name,
                            price,
                            orderId,
                        },
                    });
                }
                this.setData({
                    tishi,
                });
            },
        });
    },
    // 获取地区名
    urlname: function (saoid) {
        let that = this;
        wx.request({
            url: app.globalData.publicAdress + "api/BoxInfo",
            method: "GET",
            header: {
                "content-type": "application/json", // 默认值
                Accept: "application/vnd.cowsms.v2+json",
                Authorization: "Bearer " + wx.getStorageSync("token"),
            },
            data: {
                box_id: saoid,
            },
            success(res) {
                console.log(res);
                if (res.header.Authorization) {
                    var str = res.header.Authorization;
                    wx.removeStorageSync("token");
                    wx.setStorageSync("token", str.substring(7, str.length));
                }
                let content = ''
                if (res.statusCode == "200") {
                    const re = res.data.data
                    if(re != null) {
                        if(!Reflect.ownKeys(re.get_area_info).length){
                            content = ''
                        }else{
                            content =
                            re.get_area_info?.name +
                            re.get_area_info?.area_name +
                            re.town +
                            re.unit;
                        }
                    }
                    
                     
                        that.setData({
                            area_id:re.area_id
                        })
                    console.log(content);
                    // that.saogui(wx.getStorageSync('ids'), content)
                    if (res.data.data.get_cell_info != null) {
                        that.setData({
                            shareCellNum: res.data.data.get_cell_info,
                        });
                        that.sharestate(res.data.data.get_cell_info.box_id);
                    } else {
                        that.setData({
                            shareCellNum: false,
                        });
                    }
                    that.saogui(saoid, content);
                }
            },
        });
    },
    //获取我的格口信息
    LatticeInfo: function () {
        var that = this;
        //我的格口
        wx.request({
            url: app.globalData.publicAdress + "api/myBoxCell",
            method: "get",
            header: {
                "content-type": "application/json", // 默认值
                Accept: "application/vnd.cowsms.v2+json",
                Authorization: "Bearer " + wx.getStorageSync("token"),
            },
            success: function (res) {
                console.log(res);
                //如果token失效   则返回新的token
                if (res.header.Authorization) {
                    var str = res.header.Authorization;
                    wx.removeStorageSync("token");
                    wx.setStorageSync("token", str.substring(7, str.length));
                }
                if (res.statusCode == "200") {
                    if (res.data == null || res.data == "" || res.data == []) {
                        // wx.removeStorageSync('selectName')
                        // wx.setStorageSync('selectName', '')
                        that.setData({
                            tihuoWay: "尚未绑定格口",
                        });
                    } else {
                        var addressList = [];

                        for (var i = 0; i < res.data.length; i++) {
                            var address1 =
                                res.data[i].get_cell_info.get_area_info.name;
                            var address2 =
                                res.data[i].get_cell_info.get_area_info
                                    .area_name;
                            var address3 =
                                res.data[i].get_cell_info.get_box_info.town;
                            var address4 =
                                res.data[i].get_cell_info.get_box_info.unit;

                            var formdata = {
                                address:
                                    address1 +
                                    address2 +
                                    address3 +
                                    address4 +
                                    res.data[i].get_cell_info.roomNum,
                                ids: res.data[i].get_cell_info.box_id,
                                cellNum: res.data[i].get_cell_info.cellNum,
                                IotId: res.data[i].get_cell_info.IotId,
                                box_cell_id: res.data[i].box_cell_id,
                                // 'roomNum':res.data[i].get_cell_info.roomNum,
                                initPswd: res.data[i].get_cell_info.initPswd,
                                roomNum: res.data[i].get_cell_info.roomNum
                            };
                            addressList.push(formdata);

                            if (res.data[i].get_cell_info.initPswd == null) {
                                that.setData({
                                    text: "创建",
                                    pwd: "",
                                });
                            } else {
                                that.setData({
                                    text: "变更",
                                    pwd: res.data[i].get_cell_info.initPswd,
                                });
                            }
                        }
                        console.log(addressList);
                        if (!wx.getStorageSync("initpswd")) {
                            console.log("见来了");
                            wx.removeStorageSync("boxid");
                            wx.setStorageSync(
                                "boxid",
                                addressList[0].box_cell_id
                            );
                            wx.removeStorageSync("iotid");
                            wx.setStorageSync("iotid", addressList[0].IotId);
                            wx.removeStorageSync("cellnum");
                            wx.setStorageSync(
                                "cellnum",
                                addressList[0].cellNum
                            );
                            wx.removeStorageSync("selectName");
                            wx.setStorageSync(
                                "selectName",
                                addressList[0].address
                            );
                            wx.setStorageSync(
                                "selectRoomNum",
                                addressList[0].roomNum
                            );
                            wx.removeStorageSync("initpswd");
                            wx.setStorageSync(
                                "initpswd",
                                addressList[0].initPswd
                            );
                            wx.removeStorageSync("ids");
                            wx.setStorageSync("ids", addressList[0].ids);
                            that.setData({
                                initpswd: addressList[0].initPswd,
                                cellnum: addressList[0].cellNum,
                                addressList: addressList[0].address,
                                iotid: addressList[0].IotId,
                                boxid: addressList[0].box_cell_id,
                                existence: true,
                            });
                            // 获取柜子信息BoxInfo
                            console.log(addressList[0].ids);
                            that.shareboxInfo(addressList[0].ids);
                            // that.shareallboxdata()
                            console.log(addressList[0].ids);
                            that.sharestate(addressList[0].ids);
                            // 查询当前柜子我的共享箱myShareBox
                            that.shareallboxdata(addressList[0].ids);
                            //  that.sharestate(wx.getStorageSync('ids'))
                            that.myShareBoxStatus(addressList[0].ids);
                        } else {
                            that.setData({
                                initpswd: wx.getStorageSync("initpswd"),
                                cellnum: wx.getStorageSync("cellnum"),
                                addressList: addressList,
                                iotid: wx.getStorageSync("iotid"),
                                boxid: wx.getStorageSync("boxid"),
                            });
                        }
                        that.setData({
                            addressList: addressList,
                            tihuoWay: wx.getStorageSync("selectName"),
                            roomNum:wx.getStorageSync('selectRoomNum')
                        });
                    }
                }
                if (
                    res.statusCode == "500" ||
                    res.data.message == "Unauthenticated."
                ) {
                    console.log("500");
                    wx.getSetting({
                        complete: (res) => {
                            if (res.authSetting["scope.userInfo"]) {
                                wx.request({
                                    url: "https://s61.xboxes.cn/api/login",
                                    method: "get",
                                    data: {
                                        code: app.globalData.code,
                                    },
                                    success(res) {
                                        console.log(res);
                                        wx.login({
                                            complete: (res) => {
                                                console.log(res);
                                                wx.request({
                                                    url: "https://s61.xboxes.cn/api/login",
                                                    method: "get",
                                                    header: {
                                                        "content-type":
                                                            "application/json", // 默认值
                                                        Accept: "application/vnd.cowsms.v2+json",
                                                        Authorization:
                                                            "Bearer " +
                                                            wx.getStorageSync(
                                                                "token"
                                                            ),
                                                    },
                                                    data: {
                                                        code: res.code,
                                                    },
                                                    success(res) {
                                                        console.log(res);
                                                        wx.setStorageSync(
                                                            "token",
                                                            res.data.token
                                                        );
                                                        wx.setStorageSync(
                                                            "sessionId",
                                                            res.data.sessionId
                                                        );
                                                        // resolve(res)
                                                        that.onReady();
                                                    },
                                                });
                                            },
                                        });
                                    },
                                });
                            }
                        },
                    });
                }
            },
            error: function (res) {
                console.log(res);
            },
        });
    },
    //创建/变更密码
    UpdatePwd: function (e) {
        var that = this;
        wx.request({
            url: app.globalData.publicAdress + "api/changeInitPswd",
            method: "put",
            header: {
                "content-type": "application/json", // 默认值
                Accept: "application/vnd.cowsms.v2+json",
                Authorization: "Bearer " + wx.getStorageSync("token"),
            },
            data: {
                cellNum: wx.getStorageSync("cellnum"),
                IotId: wx.getStorageSync("iotid"),
                box_cell_id: wx.getStorageSync("boxid"),
            },
            success: function (res) {
                // console.log(res)
                //如果token失效   则返回新的token
                if (res.header.Authorization) {
                    var str = res.header.Authorization;
                    wx.removeStorageSync("token");
                    wx.setStorageSync("token", str.substring(7, str.length));
                }
                if (res.statusCode == "200") {
                    that.ModalA.hideModal();
                    showSuccess(res.data.mes);
                    wx.removeStorageSync("initpswd");
                    wx.setStorageSync("initpswd", res.data.initPswd);
                    that.setData({
                        initpswd: res.data.initPswd,
                    });
                    // that.LatticeInfo();
                } else if (res.statusCode == "400") {
                    showSuccess(res.data.errors.message[0]);
                    that.ModalA.hideModal();
                } else if (res.statusCode == "422") {
                    showSuccess(res.data.errors.message[0]);
                    that.ModalA.hideModal();
                } else if (res.statusCode == "429") {
                    showSuccess(res.data.message);
                    that.ModalA.hideModal();
                }
            },
        });
    },

    onReady: function () {
        this.Modal = this.selectComponent("#modal"); //返回组件实例
        this.ModalChange = this.selectComponent("#change");
        this.ModalA = this.selectComponent("#modalA");
        this.ModalsureBtn = this.selectComponent("#sureBtn");

        if (wx.getStorageSync("isPhone") != "isPhone") return;

        this.LatticeInfo();
        // console.log(wx.getStorageSync('ids'))
        // that.shareboxInfo(wx.getStorageSync('ids'))
        // // 查询当前柜子我的共享箱myShareBox
        // that.shareallboxdata(wx.getStorageSync('ids'))
        // that.sharestate(wx.getStorageSync('ids'))
        console.log("页面渲染完成");
        console.log(this.data.saomazhi);
        // this.setData({
        //   saomazhi:false
        // })
    },
    //开锁
    async openColck(e) {
        console.log(e);
        var that = this;
        // 查看是否授权

        //没登陆
        if (!wx.getStorageSync("isPhone")) {
            if (!wx.getStorageSync("wx_userInfo")) {
                console.log(app);
                await app
                    .getUserProfile()
                    .then((res) => {
                        wx.navigateTo({
                            url: "../login-frame/login-frame",
                        });
                    })
                    .catch(() => {
                        wx.setStorageSync("baseUrl", url);
                        wx.navigateTo({
                            url: "../login/login",
                        });
                    });

                return;
            } else {
                wx.navigateTo({
                    url: "../login-frame/login-frame",
                });
            }
        } else {
            that.newopenbtn(wx.getStorageSync("boxid"));
        }
    },
    //创建
    change: function (e) {
        wx.removeStorageSync("boxid");
        wx.removeStorageSync("cellnum");
        wx.removeStorageSync("iotid");
        wx.setStorageSync("boxid", e.currentTarget.dataset.boxid);
        wx.setStorageSync("cellnum", e.currentTarget.dataset.cellnum);
        wx.setStorageSync("iotid", e.currentTarget.dataset.iotid);
        var that = this;
        // 查看是否授权
        wx.getSetting({
            success: function (res) {
                // console.log(res)
                if (res.authSetting["scope.userInfo"]) {
                    wx.getUserInfo({
                        lang: "zh_CN",
                        success: function (res) {
                            if (!wx.getStorageSync("isPhone")) {
                                wx.navigateTo({
                                    url: "../login-frame/login-frame",
                                });
                            }
                            that.ModalA.showModal();
                        },
                    });
                } else {
                    wx.setStorageSync("baseUrl", url);
                    wx.navigateTo({
                        url: "../login/login",
                    });
                }
            },
        });
    },

    //设置密码确定
    _confirmEventFirstA: function (e) {
        var that = this;
        that.UpdatePwd();
    },

    //立即下单
    orderNow() {
        const that = this;
        wx.request({
            url:
                app.globalData.publicAdress +
                "api/order/" +
                this.data.good.orderId,
            method: "GET",
            header: {
                "content-type": "application/json", // 默认值
                Accept: "application/vnd.cowsms.v2+json",
                Authorization: "Bearer " + wx.getStorageSync("token"),
            },
            data: {},
            success: (res) => {
                console.log(res);

                if (res.data.res) {
                    //成功
                    if (res.data.res.code == 0) {
                    }
                    this.pay(res.data.res);
                } else {
                    showModel("下单失败", res.data.mes);
                }
            },
        });
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

                if (this.data.share_order) {
                    this.setData({
                        share_order: false,
                    });
                    this.newopenbtn(this.data.new_box_cell_id);
                }
                this.setData({
                    order: false,
                });
            },
            fail: (res) => {
                showSuccess("取消支付");
            },
            complete: (res) => {},
        });
    },

    //关闭下单窗口
    close_oreder_dialog() {
        this.setData({
            order: false,
            share_order: false,
        });
    },

    //开箱确定
    _confirmEventFirst: function () {
        var that = this;
        wx.request({
            url: app.globalData.publicAdress + "api/openBoxV2",
            method: "POST",
            header: {
                "content-type": "application/json", // 默认值
                Accept: "application/vnd.cowsms.v2+json",
                Authorization: "Bearer " + wx.getStorageSync("token"),
            },
            data: {
                // "cellNum": this.data.cellnum,
                // "IotId": this.data.iotid,
                box_cell_id: this.data.boxid,
                signature: that.data.signature,
                timestamp: that.data.timestamp,
                type: that.data.share_type,
            },
            success: function (res) {
                console.log(res);
                //如果token失效   则返回新的token
                if (res.header.Authorization) {
                    var str = res.header.Authorization;
                    // console.log(str)
                    wx.removeStorageSync("token");
                    wx.setStorageSync("token", str.substring(7, str.length));
                }
                if (res.statusCode == "200") {
                    showSuccess(res.data.mes);
                    that.Modal.hideModal();
                } else if (res.statusCode == "400" || res.statusCode == "422") {
                    showSuccess(res.data.errors.message[0]);
                    that.Modal.hideModal();
                } else if (res.statusCode == "429") {
                    showSuccess("操作频繁");
                    that.Modal.hideModal();
                } else if (res.statusCode == 401) {
                    showSuccess(res.data.mes);
                }
            },
        });
    },
    // 扫码进来确定按钮
    _confirmEventFirstB: function () {},
    //创建、变更 确定
    _confirmEventChange: function () {
        var that = this;
        that.UpdatePwd();
    },
    _cancelEvent: function () {
        console.log("点击取消!");
        showSuccess("已取消");
    },
    _cancelEventChange: function () {
        console.log("点击取消!");
    },
    //复制
    setClipboardData(){
        wx.setClipboardData({
            data: this.data.initpswd,
            success (res) {
              
            }
          })
    },
    // this.Modal.showModal();//显示
    // this.Modal.hideModal(); //隐藏
    //点击select
    async bindShowMsg() {
        var that = this;

        //没登陆
        if (!wx.getStorageSync("isPhone")) {
            if (!wx.getStorageSync("wx_userInfo")) {
                await app
                    .getUserProfile()
                    .then((res) => {
                        wx.navigateTo({
                            url: "../login-frame/login-frame",
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                        wx.setStorageSync("baseUrl", url);
                        wx.navigateTo({
                            url: "../login/login",
                        });
                    });

                return;
            } else {
                wx.navigateTo({
                    url: "../login-frame/login-frame",
                });
            }
        } else {
            this.LatticeInfo();
            wx.removeStorageSync("baseUrl");
            for (var i = 0; i < that.data.addressList.length; i++) {
                that.data.remarkinfo[i] = true;
                if (
                    wx.getStorageSync("selectName") ==
                    that.data.addressList[i].address
                ) {
                    that.data.remarkinfo[i] = false;
                    that.setData({
                        remarkinfo: that.data.remarkinfo,
                        tihuoWay: wx.getStorageSync("selectName"),
                        mainid: wx.getStorageSync("mainid"),
                        initpswd: wx.getStorageSync("initpswd"),
                    });
                } else if (
                    wx.getStorageSync("selectName") ==
                    that.data.addressList[0].address
                ) {
                    that.data.remarkinfo[0] = false;
                    that.setData({
                        remarkinfo: that.data.remarkinfo,
                        tihuoWay: wx.getStorageSync("selectName"),
                        mainid: wx.getStorageSync("mainid"),
                        initpswd: wx.getStorageSync("initpswd"),
                    });
                }

                //没有select
                if (!wx.getStorageSync("selectName")) {
                    that.data.remarkinfo[0] = false;
                    that.setData({
                        remarkinfo: that.data.remarkinfo,
                        tihuoWay: that.data.addressList[0].address,
                        roomNum:that.data.addressList[0].roomNum,
                        mainid: that.data.addressList[0].mainid,
                        initpswd: wx.getStorageSync("initpswd"),
                    });
                    wx.setStorageSync("selectName", that.data.tihuoWay);
                    wx.setStorageSync("selectRoomNum", that.data.roomNum);
                    wx.setStorageSync("mainid", that.data.mainid);
                    wx.setStorageSync("initpswd", that.data.initpswd);
                }
                if (wx.getStorageSync("boxid")) {
                    that.setData({
                        boxid: wx.getStorageSync("boxid"),
                    });
                } else {
                    that.setData({
                        boxid: that.data.addressList[0].boxid,
                    });
                    wx.setStorageSync("boxid", that.data.boxid);
                }
                if (wx.getStorageSync("mainid")) {
                    that.setData({
                        mainid: that.data.addressList[0].mainid,
                        initpswd: that.data.addressList[0].initpswd,
                    });
                }
            }
            // that.LatticeInfo();
            that.setData({
                imgSrc: "../../images/jiantou1.png",
            });
            //改变箭头颜色
            if (that.data.select) {
                that.setData({
                    imgSrc: "../../images/jiantou1.png",
                });
            } else {
                that.setData({
                    imgSrc: "../../images/jiantou2.png",
                });
            }
        }

        if (this.data.iconfram == false) {
            this.setData({
                iconfram: true,
            });
        } else {
            this.setData({
                iconfram: false,
            });
        }
    },
    //点击options里的每一项
    mySelect(e) {
        var that = this;
        that.setData({
            saotext: true,
            existence: true,
            myshateapp: true,
            current:0,
        });
        wx.removeStorageSync("saoma");
        var name = e.currentTarget.dataset.name;
        var index = e.currentTarget.dataset.index;
        var iotid = e.currentTarget.dataset.iotid;
        var boxid = e.currentTarget.dataset.boxid; //格口ID
        var mainid = e.currentTarget.dataset.ids; //箱子Id
        var cellnum = e.currentTarget.dataset.cellnum;
        var initpswd = e.currentTarget.dataset.initpswd;
        console.log(boxid);
        console.log(that.data.addressList);
        for (let i = 0; i < that.data.addressList.length; i++) {
            if (boxid == that.data.addressList[i].box_cell_id) {
                wx.removeStorageSync("ids");
                wx.setStorageSync("ids", that.data.addressList[i].ids);
            }
        }
        that.setData({
            tihuoWay: name,
            // select: false,
            iotid: iotid,
            boxid: boxid,
            cellnum: cellnum,
            mainid: mainid,
            initpswd: initpswd,
            roomNum: that.data.addressList[index].roomNum
        });
        wx.removeStorageSync("selectName");
        wx.setStorageSync("selectName", that.data.tihuoWay);
        wx.setStorageSync("selectRoomNum", that.data.roomNum);
        wx.removeStorageSync("initpswd");
        wx.setStorageSync("initpswd", that.data.initpswd);
        wx.removeStorageSync("iotid");
        wx.removeStorageSync("boxid");
        wx.removeStorageSync("mainid");
        wx.setStorageSync("iotid", that.data.iotid);
        wx.setStorageSync("boxid", that.data.boxid);
        wx.setStorageSync("mainid", that.data.mainid); //箱子ID
        wx.setStorageSync("cellnum", that.data.cellnum);

        app.globalData.boxid = wx.getStorageSync("boxid");
        //改变箭头颜色
        if (that.data.select) {
            that.setData({
                imgSrc: "../../images/jiantou1.png",
            });
        } else {
            that.setData({
                imgSrc: "../../images/jiantou2.png",
            });
        }
        for (var i = 0; i < that.data.addressList.length; i++) {
            that.data.remarkinfo[i] = true;
            that.setData({
                remarkinfo: that.data.remarkinfo,
            });
            if (index == i) {
                that.data.remarkinfo[i] = false;
                that.setData({
                    remarkinfo: that.data.remarkinfo,
                });
            }
        }
        if (this.data.iconfram == false) {
            this.setData({
                iconfram: true,
            });
        } else {
            this.setData({
                iconfram: false,
            });
        }
        this.shareboxInfo(wx.getStorageSync("ids"));
        this.shareallboxdata(wx.getStorageSync("ids"));
        this.myShareBoxStatus(wx.getStorageSync("ids"));
        this.sharestate(wx.getStorageSync("ids"));
    },
    //获取共享格口口信息
    shareinformation: function () {
        let that = this;
    },
    async kuangbtn(e) {
        let that = this;

        if (!wx.getStorageSync("isPhone")) {
            if (!wx.getStorageSync("wx_userInfo")) {
                if (e.detail.userInfo) {
                    const { userInfo } = e.detail;
                    app.globalData.userInfo = userInfo;
                    wx.setStorageSync("wx_userInfo", userInfo);
                    // this.globalData.wx_userInfo = userInfo
                    app.globalData.profile_user = e.detail;
                    wx.navigateTo({
                        url: "../login-frame/login-frame",
                    });
                    return;
                }
                await app
                    .getUserProfile()
                    .then((res) => {
                        wx.navigateTo({
                            url: "../login-frame/login-frame",
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                        wx.setStorageSync("baseUrl", url);
                        wx.navigateTo({
                            url: "../login/login",
                        });
                    });

                return;
            } else {
                wx.navigateTo({
                    url: "../login-frame/login-frame",
                });
            }
        } else {
            if (that.data.tishi == "是否绑定当前柜口") {
                console.log("是否绑定当前柜口");
                wx.request({
                    url: app.globalData.publicAdress + "api/bindCell",
                    method: "POST",
                    header: {
                        "content-type": "application/json", // 默认值
                        Accept: "application/vnd.cowsms.v2+json",
                        Authorization: "Bearer " + wx.getStorageSync("token"),
                    },
                    data: {
                        box_cell_id: that.data._boxid,
                        ver: that.data._ver,
                    },
                    success(res) {
                        // console.log(res)
                        that.setData({
                            tan: false,
                            tishi: null,
                            contenttext: null,
                        });
                        wx.showToast({
                            title: res.data.mes,
                            icon: "none",
                            duration: 2000,
                        });
                        that.bindShowMsg();
                    },
                    error: function (res) {
                        wx.showToast({
                            title: res.data.mes,
                            icon: "none",
                            duration: 2000,
                        });
                    },
                });
            } else if ((that.data.tishi = "您当前所扫柜子为")) {
                console.log("当前小区");
                that.setData({
                    tan: false,
                    tishi: null,
                    contenttext: null,
                });
            } else if ((that.data.tishi = "【温馨提示】")) {
                console.log("温馨提示");
                that.setData({
                    tan: false,
                    tishi: null,
                    contenttext: null,
                });
            }
        }
    },
    kuangbtnB: function () {
        this.setData({
            tan: false,
        });
        wx.showToast({
            title: "已取消",
            icon: "none",
            duration: 2000,
        });
    },
    bindtapbox: function (e) {
        console.log(e.currentTarget.dataset.index);
        console.log(this);
        if (this.data.couseid != e.currentTarget.dataset.index) {
            this.setData({
                couseid: e.currentTarget.dataset.index,
                imgpull: "/images/toppull.png",
            });
            // this.data.imgpull = "/images/toppull.png"
        } else {
            this.setData({
                couseid: null,
                imgpull: "/images/bottompull.png",
            });
        }
    },
    //获取运单号输入得值
    waybilll: function (e) {
        console.log(e);
        for (let i = 0; i < this.data.waybilllist.length; i++) {
            if (e.currentTarget.dataset.id == this.data.waybilllist[i].id) {
                this.data.waybilllist[i].oddnumber == e.detail.value;
            }
        }
        // this.setData({
        //   waybilll_value: e.detail.value
        // })3cb4ec
    },
    // 编辑运单号
    editbox: function (e) {
        let that = this;
        console.log(e);
        wx.scanCode({
            scanType: ["barCode"], //条形码
            success(res) {
                console.log(res.result); //扫描条形码获取的单号
                wx.request({
                    url: app.globalData.publicAdress + "api/ShareBoxComment",
                    method: "POST",
                    header: {
                        "content-type": "application/json", // 默认值
                        Accept: "application/vnd.cowsms.v2+json",
                        Authorization: "Bearer " + wx.getStorageSync("token"),
                    },
                    data: {
                        share_id: e.currentTarget.dataset.id,
                        text: res.result,
                    },
                    success(response) {
                        if (response.header.Authorization) {
                            var str = response.header.Authorization;
                            wx.removeStorageSync("token");
                            wx.setStorageSync(
                                "token",
                                str.substring(7, str.length)
                            );
                        }
                        if (response.statusCode == 200) {
                            console.log(response);
                            that.shareallboxdata(wx.getStorageSync("ids"));
                        }
                    },
                });
            },
        });
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
    // 一键复制运单号
    copy: function (e) {
        console.log(e);

        console.log(e.currentTarget.dataset.oddnumber);
        let that = this;
        console.log(that.data.waybilllist.oddnumber);
        let password = null;
        wx.setClipboardData({
            data: e.currentTarget.dataset.oddnumber,
            success(res) {
                console.log(res);
                console.log(password);
                //  wx.showToast({
                //    title: '复制成功',
                //    icon:'none',
                //    duration:2000
                //  })
            },
        });
        // console.log(password)
    },
    // 点击删除可开箱人
    deleteuserinfo: function (e) {
        console.log(e);
        this.setData({
            sharekuang: true,
            tishi: "",
            contenttext: "确认删除此成员吗？",
            share_id: e.currentTarget.dataset.share_id,
            share_phone: e.currentTarget.dataset.phone,
        });
    },
    // 删除可开箱人点击取消
    sharekuangbtnB: function () {
        this.setData({
            sharekuang: false,
        });
        showSuccess("已取消");
    },
    // 删除可开箱人点击确定
    sharekuangbtn: function () {
        let that = this;
        that.setData({
            sharekuang: false,
        });
        // 删除成员接口
        wx.request({
            url: app.globalData.publicAdress + "api/ShareBoxUser",
            method: "delete",
            header: {
                "content-type": "application/json", // 默认值
                Accept: "application/vnd.cowsms.v2+json",
                Authorization: "Bearer " + wx.getStorageSync("token"),
            },
            data: {
                share_id: that.data.share_id,
                phone: that.data.share_phone,
            },
            success: function (res) {
                console.log(res);
                //如果token失效   则返回新的token
                if (res.header.Authorization) {
                    var str = res.header.Authorization;
                    wx.removeStorageSync("token");
                    wx.setStorageSync("token", str.substring(7, str.length));
                }
                if (res.statusCode == "200") {
                    console.log(res);
                    showSuccess("已删除");
                    that.shareallboxdata(wx.getStorageSync("ids"));
                }
            },
        });
    },
    // 共享箱子密码复制
    sharepass: function (e) {
        wx.setClipboardData({
            data: e.currentTarget.dataset.password,
        });
    },
    // 我的预约箱一键复制
    copyme: function (e) {
        wx.setClipboardData({
            data: e.currentTarget.dataset.password,
        });
    },
    sharebox: function (e) {
        console.log("跳转共享箱");
        console.log(this.data.itcp);
        wx.navigateTo({
            url:
                "/pages/share/share?ids=" +
                JSON.stringify({
                    itcp: this.data.itcp,
                    ids: wx.getStorageSync("ids"),
                }),
        });
    },
    // 查询当前柜子我的共享箱myShareBox
    shareallboxdata: function (ids) {
        let that = this;
        wx.request({
            url: app.globalData.publicAdress + "api/myShareBox",
            method: "GET",
            header: {
                "content-type": "application/json", // 默认值
                Accept: "application/vnd.cowsms.v2+json",
                Authorization: "Bearer " + wx.getStorageSync("token"),
            },
            data: {
                box_id: ids,
            },
            success(res) {
                console.log(res);
                if (res.header.Authorization) {
                    var str = res.header.Authorization;
                    wx.removeStorageSync("token");
                    wx.setStorageSync("token", str.substring(7, str.length));
                }
                if (res.statusCode == "200") {
                    // console.log(res)
                    let wail = []; //预约状态
                    let waybilllist = []; //存入状态
                    if (res.data.length != 0) {
                        for (let i = 0; i < res.data.length; i++) {
                            if (
                                res.data[i].save_stop == null ||
                                res.data[i].save_stop == ""
                            ) {
                                console.log("我的预约");
                                wail.push(res.data[i]);
                                that.setData({
                                    myshateapp: true,
                                });
                            } else {
                                console.log("已存入");
                                waybilllist.push(res.data[i]);
                                that.setData({
                                    myshareju: true,
                                });
                                // console.log(waybilllist)
                                for (
                                    let z = 0;
                                    z < waybilllist[i].get_use_user.length;
                                    z++
                                ) {
                                    // console.log(waybilllist[i].get_use_user[z])
                                    let newphone =
                                        waybilllist[i].get_use_user[
                                            z
                                        ].phone.substring(0, 3) +
                                        "****" +
                                        waybilllist[i].get_use_user[
                                            z
                                        ].phone.substring(7);
                                    // console.log(newphone)
                                    waybilllist[i].get_use_user[z].newphone =
                                        newphone;
                                }
                                // console.log(waybilllist)
                            }
                        }
                        console.log("waybilllist", waybilllist);
                        console.log("wail", wail);
                        that.setData({
                            waybilllist: waybilllist,
                            subscribe: wail,
                        });
                    } else {
                        that.setData({
                            myshateapp: false,
                            myshareju: false,
                        });
                    }
                }
            },
        });
    },
    // 点击跳转到我的共享箱
    sharebox_me: function (e) {
        console.log(e.currentTarget.dataset.ids);
        wx.navigateTo({
            url: "../meshare/meshare",
        });
    },
    // 点击输入密码
    jianpan: function () {
        this.setData({
            keyboard_pwd: true,
        });
    },
    // 监听输入的密码
    space_password: function (e) {
        // console.log(e.detail.value)
        this.setData({
            jianpan_password: e.detail.value,
        });
    },
    // 输入密码确定
    keyboard_pwdA: function () {
        let that = this;
        console.log(that.data.jianpan_password);
        wx.request({
            url: app.globalData.publicAdress + "api/passwd",
            method: "POST",
            header: {
                "content-type": "application/json", // 默认值
                Accept: "application/vnd.cowsms.v2+json",
                Authorization: "Bearer " + wx.getStorageSync("token"),
            },
            data: {
                passwd: that.data.jianpan_password,
                box_id: wx.getStorageSync("ids"),
            },
            success(res) {
                console.log(res);
                if (res.header.Authorization) {
                    var str = res.header.Authorization;
                    wx.removeStorageSync("token");
                    wx.setStorageSync("token", str.substring(7, str.length));
                }
                if (res.statusCode == "200") {
                    console.log(res);
                    let content =
                        res.data.data.get_area_info.name +
                        res.data.data.get_area_info.area_name +
                        res.data.data.get_box_info.town +
                        res.data.data.get_box_info.unit +
                        res.data.data.roomNum;
                    that.setData({
                        signature: res.data.signature,
                        timestamp: res.data.timestamp,
                        // contenttext: content,
                        keyboard_pwd: false,
                        footer_password: "您确定开启" + content + "柜口吗？",
                        footer_box_clee_id: res.data.data.id,
                        share_type: res.data.type,
                        new_box_cell_id: res.data.data.id,
                    });
                    // showSuccess('密码错误')
                } else {
                    showSuccess("密码错误");
                }
            },
        });
        // this.setData({})
    },
    // 底部键盘输入密码开箱确定按钮
    footer_password_ok: function () {
        let that = this;
        wx.request({
            url: app.globalData.publicAdress + "api/openBoxV2",
            method: "POST",
            header: {
                "content-type": "application/json", // 默认值
                Accept: "application/vnd.cowsms.v2+json",
                Authorization: "Bearer " + wx.getStorageSync("token"),
            },
            data: {
                box_cell_id: that.data.footer_box_clee_id,
                signature: that.data.signature,
                timestamp: that.data.timestamp,
                type: that.data.share_type,
            },
            success(res) {
                console.log(res);
                if (res.header.Authorization) {
                    var str = res.header.Authorization;
                    wx.removeStorageSync("token");
                    wx.setStorageSync("token", str.substring(7, str.length));
                }
                if (res.statusCode == 200) {
                    console.log(res);
                    that.setData({
                        // share_openusebox: false,
                        footer_password: false,
                        share_tishi: true,
                    });
                    showSuccess("开箱成功");

                    let num = 6;
                    let dingshi = setInterval(() => {
                        if (num > 0) {
                            num--;
                            that.setData({
                                daojishi: num,
                            });
                        } else {
                            clearInterval(dingshi);
                            that.setData({
                                daojishi: "",
                                num: 6,
                            });
                        }
                        //  console.log(that.data.daojishi)
                    }, 1000);

                    that.myShareBoxStatus(); //我有权限和我的预约得个数
                    that.sharestate(wx.getStorageSync("ids")); //共享箱数量
                    that.shareallboxdata(wx.getStorageSync("ids")); //我的预约与我有权限得箱子
                } else if (res.statusCode == 401) {
                    showSuccess(res.data.mes);
                }
            },
        });
        let miaoshu = 20;
        let ding = setInterval(() => {
            if (miaoshu > 0) {
                miaoshu--;
                console.log(miaoshu);
                that.setData({
                    judge_miao: miaoshu,
                });
            } else {
                clearInterval(ding);
            }
        }, 1000);
    },
    swiperClick(e){
        console.log(e)
        const {id} = e.currentTarget.dataset
        if(id == null){
            return
        }
        wx.navigateTo({
          url: `../detail/detail?id=${id}`,
        })
    },
    // 输入密码取消
    keyboard_pwdB: function () {
        this.setData({
            keyboard_pwd: false,
        });
        showSuccess("已取消");
    },
    //空间分享
    share_space: function (e) {
        console.log(e.currentTarget.dataset);
        this.setData({
            share_space: true,
            share_id: e.currentTarget.dataset.share_id,
            boxcellid: e.currentTarget.dataset.boxcellid,
        });
    },
    space_share: function (e) {
        // console.log(e.timeStamp)
        let Time = new Date();
        let set = 1;
        // console.log(Time - e.timeStamp)
        if (Time - e.timeStamp >= set) {
            // console.log('执行')
            console.log(e.detail.value);
            this.setData({
                mohushu: e.detail.value,
            });
            this.mohu();
        }
    },
    // 模糊搜索接口
    mohu: function () {
        let that = this;
        wx.request({
            url: app.globalData.publicAdress + "api/BoxCell",
            method: "GET",
            header: {
                "content-type": "application/json", // 默认值
                Accept: "application/vnd.cowsms.v2+json",
                Authorization: "Bearer " + wx.getStorageSync("token"),
            },
            data: {
                box_id: wx.getStorageSync("ids"),
                q: that.data.mohushu,
            },
            success(res) {
                console.log(res);
                if (res.header.Authorization) {
                    var str = res.header.Authorization;
                    wx.removeStorageSync("token");
                    wx.setStorageSync("token", str.substring(7, str.length));
                }
                if (res.statusCode == "200") {
                    // console.log(res)
                    // console.log(res.data.data.length)
                    if (res.data.data.length != 0) {
                        that.setData({
                            share_vagule: true,
                            share_vagule_text: res.data.data,
                        });
                    } else {
                        that.setData({
                            share_vagule: false,
                            share_vagule_text: null,
                        });
                    }
                }
            },
        });
    },
    // 模糊搜索接口
    kuangbtnshareB: function () {
        this.setData({
            share_space: false,
            value_roomNum: null,
        });
        wx.showToast({
            title: "已取消",
            icon: "none",
            duration: 2000,
        });
    },
    //点击模糊搜索得每一项
    share_vagule_text: function (e) {
        console.log(e.currentTarget.dataset);
        this.setData({
            value_roomNum: e.currentTarget.dataset.roomnum,
            value_roomNumid: e.currentTarget.dataset.id,
            share_vagule: false,
        });
    },
    // 模糊搜索确认按钮console.log()
    kuangbtnshare: function () {
        let that = this;
        let roomNum = that.data.value_roomNum;
        console.log(that.data.share_id);
        wx.request({
            url: app.globalData.publicAdress + "api/ShareBoxUserRoom",
            method: "POST",
            header: {
                "content-type": "application/json", // 默认值
                Accept: "application/vnd.cowsms.v2+json",
                Authorization: "Bearer " + wx.getStorageSync("token"),
            },
            data: {
                share_id: that.data.share_id,
                box_cell_id: that.data.value_roomNumid,
            },
            success(res) {
                if (res.header.Authorization) {
                    var str = res.header.Authorization;
                    wx.removeStorageSync("token");
                    wx.setStorageSync("token", str.substring(7, str.length));
                }
                if (res.statusCode == 200) {
                    console.log(res);
                    that.shareallboxdata(wx.getStorageSync("ids"));
                    showSuccess("添加成功");
                }
                if (res.statusCode == 403) {
                    // console.log(res)
                    showSuccess(res.data.mes);
                }
            },
        });
        this.setData({
            share_space: false,
            value_roomNum: null,
        });
        // showSuccess('添加成功')
    },
    // 添加可开箱人
    share_peoplebox: function (e) {
        console.log(e.currentTarget.dataset);
        this.setData({
            share_people: true,
            share_id: e.currentTarget.dataset.share_id,
        });
    },
    // 添加可开箱人输入事件
    space_people: function (e) {
        console.log(e.detail.value);
        this.setData({
            value_people: e.detail.value,
        });
    },
    //添加可开箱人事件确认
    share_peopleaA: function () {
        let that = this;
        // console.log(that.data.value_people)
        // console.log(that.data.share_id)
        let phone_rez = /^1\d{10}$/;
        if (phone_rez.test(that.data.value_people)) {
            // 调用添加接口
            wx.request({
                url: app.globalData.publicAdress + "api/ShareBoxUser",
                method: "POST",
                header: {
                    "content-type": "application/json", // 默认值
                    Accept: "application/vnd.cowsms.v2+json",
                    Authorization: "Bearer " + wx.getStorageSync("token"),
                },
                data: {
                    share_id: that.data.share_id,
                    phone: that.data.value_people,
                },
                success(res) {
                    if (res.header.Authorization) {
                        var str = res.header.Authorization;
                        wx.removeStorageSync("token");
                        wx.setStorageSync(
                            "token",
                            str.substring(7, str.length)
                        );
                    }
                    if (res.statusCode == 200) {
                        console.log(res);
                        showSuccess("添加成功");
                    }
                    if (res.statusCode == 403) {
                        // console.log(res)
                        showSuccess(res.data.mes);
                    }
                },
            });
            this.setData({
                share_people: false,
                value_people: "",
            });
        } else {
            showSuccess("请输入正确的手机号");
        }
        that.shareallboxdata(wx.getStorageSync("ids"));
    },
    share_peopleB: function () {
        this.setData({
            share_people: false,
        });
        showSuccess("已取消");
    },
    // 我的共享箱状态myShareBoxStatus
    myShareBoxStatus: function () {
        let that = this;
        wx.request({
            url: app.globalData.publicAdress + "api/myShareBoxStatus",
            method: "GET",
            header: {
                "content-type": "application/json", // 默认值
                Accept: "application/vnd.cowsms.v2+json",
                Authorization: "Bearer " + wx.getStorageSync("token"),
            },
            success(res) {
                if (res.header.Authorization) {
                    var str = res.header.Authorization;
                    wx.removeStorageSync("token");
                    wx.setStorageSync("token", str.substring(7, str.length));
                }
                if (res.statusCode == 200) {
                    // console.log('查看预约与权限')
                    console.log(res);
                    if (
                        res.data.my_shareBox == 0 &&
                        res.data.my_subscribe == 0
                    ) {
                        that.setData({
                            is_mysharebox: false,
                            myShareBox: {
                                jurisdiction: res.data.my_shareBox, //权限
                                appointment: res.data.my_subscribe, //预约
                            },
                        });
                    } else {
                        that.setData({
                            myShareBox: {
                                jurisdiction: res.data.my_shareBox, //权限
                                appointment: res.data.my_subscribe, //预约
                            },
                        });
                    }
                }
            },
        });
    },
    // 点击开箱按钮
    share_openusebox(e) {
        console.log(e);
        // console.log(that.data.daojishi)
        this.setData({
            daojishi: "6",
            new_box_cell_id: e.currentTarget.dataset.box_cell_id,
        });
        // console.log(e.currentTarget.dataset)
        // 调用开箱按钮
        this.newopenbtn(e.currentTarget.dataset.box_cell_id);
    },
    share_openmakebox: function (e) {
        let that = this;
        // console.log(e.currentTarget.dataset)
        that.setData({
            new_box_cell_id: e.currentTarget.dataset.box_cell_id,
        });
        // 调用开箱按钮
        that.newopenbtn(e.currentTarget.dataset.box_cell_id);
    },
    // 开箱按钮弹窗取消
    share_openusebox_cancel: function () {
        this.setData({
            share_openusebox: false,
            share_tishi: false,
            footer_password: false,
        });
        showSuccess("已取消");
    },
    // 开箱按钮弹窗确认
    share_openusebox_confirm: function () {
        let that = this;
        // console.log(that.data.signature)
        that.newopenbox();
    },
    // 开箱按钮接口
    newopenbtn(box_cell_id) {
        let that = this;
        wx.request({
            url: app.globalData.publicAdress + "api/openBoxButton",
            method: "GET",
            header: {
                "content-type": "application/json", // 默认值
                Accept: "application/vnd.cowsms.v2+json",
                Authorization: "Bearer " + wx.getStorageSync("token"),
            },
            data: {
                box_cell_id: box_cell_id,
            },
            success: (res) => {
                console.log(res);
                if (res.header.Authorization) {
                    var str = res.header.Authorization;
                    wx.removeStorageSync("token");
                    wx.setStorageSync("token", str.substring(7, str.length));
                }
                if (res.statusCode == 200) {
                    console.log(res.data);
                    let content =
                        res.data.data.get_area_info.name +
                        res.data.data.get_area_info.area_name +
                        res.data.data.get_box_info.town +
                        res.data.data.get_box_info.unit +
                        res.data.data.roomNum;

                    // console.log(content)
                    that.setData({
                        share_openusebox: content,
                        signature: res.data.signature,
                        share_box_cell_id: box_cell_id,
                        timestamp: res.data.timestamp,
                        share_type: res.data.type,
                    });
                } else {
                    //需要支付
                    if (res.data.code == 96104) {
                        const { cost, deadline, payInfo } = res.data.res;
                        this.setData({
                            share_order: true,
                            tishi: "需支付金额",
                            share_order_info: {
                                cost,
                                payInfo,
                            },
                        });
                    }
                }
            },
        });
    },
    //共享箱子订单支付
    pay_share_order() {
        const { payInfo } = this.data.share_order_info;
        this.pay(payInfo.data);
    },
    // 新开箱接口
    newopenbox: function () {
        let that = this;
        wx.request({
            url: app.globalData.publicAdress + "api/openBoxV2",
            method: "POST",
            header: {
                "content-type": "application/json", // 默认值
                Accept: "application/vnd.cowsms.v2+json",
                Authorization: "Bearer " + wx.getStorageSync("token"),
            },
            data: {
                box_cell_id: that.data.share_box_cell_id,
                signature: that.data.signature,
                timestamp: that.data.timestamp,
                type: that.data.share_type,
            },
            success(res) {
                if (res.header.Authorization) {
                    var str = res.header.Authorization;
                    wx.removeStorageSync("token");
                    wx.setStorageSync("token", str.substring(7, str.length));
                }
                if (res.statusCode == 200) {
                    console.log(res);
                    that.setData({
                        share_openusebox: false,
                        share_tishi: true,
                        new_box_cell_id: that.data.share_box_cell_id,
                    });
                    showSuccess("开箱成功");
                    // console.log(that.data.daojishi)
                    let num = 6;
                    let dingshi = setInterval(() => {
                        if (num > 0) {
                            num--;
                            that.setData({
                                daojishi: num,
                            });
                        } else {
                            clearInterval(dingshi);
                            that.setData({
                                daojishi: "",
                                num: 6,
                            });
                        }
                        //  console.log(that.data.daojishi)
                    }, 1000);
                } else if (res.statusCode == 401) {
                    showSuccess(res.data.mes);
                }
            },
        });
    },
    // 关闭当前箱子确认按钮
    share_openusebox_cel: function () {
        let that = this;
        // console.log('确认关闭')
        console.log(that.data.daojishi);
        console.log(that.data.new_box_cell_id);
        // 关箱子状态查询接口
        wx.request({
            url: app.globalData.publicAdress + "api/lockStatus",
            method: "GET",
            header: {
                "content-type": "application/json", // 默认值
                Accept: "application/vnd.cowsms.v2+json",
                Authorization: "Bearer " + wx.getStorageSync("token"),
            },
            data: {
                box_cell_id: that.data.new_box_cell_id,
            },
            success(res) {
                if (res.header.Authorization) {
                    var str = res.header.Authorization;
                    wx.removeStorageSync("token");
                    wx.setStorageSync("token", str.substring(7, str.length));
                }
                if (res.statusCode == 200) {
                    console.log(res);
                    if (res.data.code == "10101") {
                        showSuccess(res.data.mes);
                    } else {
                        if (that.data.daojishi == "") {
                            // console.log(that.data.daojishi)
                            that.myShareBoxStatus(); //我有权限和我的预约得个数
                            that.sharestate(wx.getStorageSync("ids")); //共享箱数量
                            that.shareallboxdata(wx.getStorageSync("ids")); //我的预约与我有权限得箱子
                            that.setData({
                                share_tishi: false,
                                daojishi: "6",
                            });
                        } else {
                            // console.log('没执行')
                        }
                    }
                } else if (res.statusCode == 401) {
                    showSuccess(res.data.mes);
                }
            },
        });
        // 关箱子接口
    },
    // 页面切换到其他页面或者进入其他页面
    nosao() {
        console.log("点击");
        showSuccess("请扫描柜子上面的二维码");
    },
    // 点击叉号关闭按钮
    kuang_box_close: function () {
        this.setData({
            share_tishi: false,
        });
    },
    onHide: function () {
        // this.setData({
        //   saomazhi: false
        // })
    },
});
