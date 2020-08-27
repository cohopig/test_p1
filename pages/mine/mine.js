var FormData = require('../../utils/formData.js'),
  util = require('../../utils/util.js'),
  constants = require('../../utils/contants.js'),
  app = getApp();

var app = getApp()
Page({
  data: {
    userInfo: {},
    bType: "default", // 按钮类型
    actionText: "", // 按钮文字提示
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    Integral: '',
    top: 0,
    // orderItems
    orderItems: [{
        typeId: 0,
        name: '待审核',
        url: '../order/ordernot/ordernot',
        imageurl: '../../images/daishenhe.png',
      },
      {
        typeId: 1,
        name: '待接单',
        url: '../order/ordernoting/ordernoting',
        imageurl: '../../images/daijiedan.png',
      },
      {
        typeId: 2,
        name: '待完成',
        url: '../order/ordering/ordering',
        imageurl: '../../images/paobu.png'
      }

    ],
  },
  //事件处理函数
  toOrder: function() {
    wx.navigateTo({
      url: '../order/order'
    })
  },
  navs_src: function() {
    wx.navigateTo({
      url: '{{item.imageurl}}',
    })
  },
  onShow: function() {
    // var statusBarHeight
    // this.setData({
    //   statusBarHeight: wx.getSystemInfoSync().statusBarHeight
    // });
    // console.log(this.data.statusBarHeight)
    var that = this
    var userInfo = wx.getStorageSync('userInfo');
    var openidStr = wx.getStorageSync('openidStr');
    if (!openidStr) {
      wx.showModal({
        title: '提示',
        content: "请先在首页点击上方按钮进行登录"
      })
      wx.switchTab({
        url: '../index/index'
      })
    } else {
      wx.showLoading({
        title: '正在刷新',
        mask: true,
      })
      wx.request({
        url: "https://www.sridc.cn/RetrieveOrder/RetrieveUser_con.php",
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          Aid: openidStr
        },
        success: function(res) {
          if (res.data != null || res.data) {
            console.log(res.data)
            that.setData({
              User_num: res.data[0].User_num,
              Ordertimes: res.data[0].Ordertimes,
              AllGetOrdertimes: parseInt(res.data[0].AllGetOrdertimes),
              AllPostOrdertimes: parseInt(res.data[0].AllPostOrdertimes),
              userInfo: userInfo,
              hasUserInfo: true,
              Integral: res.data[0].Integral
            })
            console.log("User_num" + that.data.User_num)
            console.log("AllOrdertimes" + that.data.AllOrdertimes)
            wx.setStorageSync('CLOSE', res.data[0].CLOSE)

            wx.hideLoading()
          } else {
            wx.hideLoading()
            wx.showModal({
              title: '提示',
              content: "请完成首页的信息注册",
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  wx.switchTab({
                    url: '../index/index'
                  })
                  console.log('发生跳转事件');
                }
              }
            })
          }
        },
        fail: function() {
          wx.hideLoading()
          wx.showModal({
            title: '提示',
            content: "服务超时 请重试", //取消订单将需向对方支付违约金
            showCancel: false,
            success(res) {
              wx.vibrateShort({
                success: function() {
                  console.log("震动")
                }
              })
            }
          })
        }
      })
    }
  },
  onLoad: function() {
    let that = this;
    let query = wx.createSelectorQuery().in(this)
    //根据节点id查询节点部分的高度（px单位）
    query.select('.user').boundingClientRect();
    query.select('.account').boundingClientRect();
    query.exec((res) => {
      // 分别取出节点的高度
      let aHeight = res[0].height;
      let bHeight = res[1].height;
      // let cHeight = res[2].height; 
      // console.log(cHeight) 值为0
      // 然后窗口高度（wx.getSystemInfoSync().windowHeight）减去其他不滑动界面的高度
      const scrollHeight = wx.getStorageSync('scrollHeight')
      let scrollViewHeight = scrollHeight
      // let scrollViewHeight = wx.getSystemInfoSync().statusBarHeight + data.bottom
      // aHeight - bHeight - cHeight;
      // let accounttop = wx.getSystemInfoSync().windowHeight - scrollHeight -
      //   aHeight + 20;
      let accounttop = aHeight + bHeight
      this.setData({
        scrollHeight: scrollViewHeight,
        accounttop: accounttop,
        name: app.globalData.name
      });
    })
    wx.setNavigationBarTitle({
      title: '个人中心',
    })
    var userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo: userInfo,
      hasUserInfo: true
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        actionText: "退出登录"
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          actionText: "退出登录"
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
            actionText: "退出登录"
          })
        }
      })
    }
  },
  onGotUserInfo: function(e) {
    console.log(e)
    wx.setStorageSync('userInfo', e.detail.userInfo)
    wx.setStorageSync('gender', e.detail.userInfo.gender)
    this.setData({
      userInfo: e.detail.userInfo,
    })

  },
  bindAction: function() {
    wx.showModal({
      title: "确认退出?",
      content: "退出后将不能使用tt服务",
      success: (res) => {
        if (res.confirm) {
          console.log("确定")
          // 退出登录则移除本地用户信息
          wx.removeStorageSync('userInfo')
          this.setData({
            userInfo: {
              avatarUrl: "",
            },

            actionText: ""
          })
        }
      }
    })
  },
  onPullDownRefresh: function() {
    var that = this
    that.onShow();
    console.log("下拉刷新")
    wx.stopPullDownRefresh()
    console.log("下拉刷新结束")
  }
})