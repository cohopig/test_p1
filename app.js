//app.js
  // json "enablePullDownRefresh": true,
  // "backgroundTextStyle": "dark",
  // "navigationBarTextStyle": "black"  
  // "component": true,
App({
  onLaunch: function(options) {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 判断是否由分享进入小程序
    // if (options.scene == 1007 || options.scene == 1008) {
    //   this.globalData.share = true
    // } else {
    //   this.globalData.share = false
    // };
    //获取设备顶部窗口的高度（不同设备窗口高度不一样，根据这个来设置自定义导航栏的高度）
    //这个最初我是在组件中获取，但是出现了一个问题，当第一次进入小程序时导航栏会把
    //页面内容盖住一部分,当打开调试重新进入时就没有问题，这个问题弄得我是莫名其妙
    //虽然最后解决了，但是花费了不少时间
    // let data = wx.getMenuButtonBoundingClientRect()
    // var bottom = data.bottom
    // let scrollViewHeight = wx.getSystemInfoSync().statusBarHeight + bottom

    // this.globalData.height = scrollViewHeight;
    // console.log(this.globalData.height)
    // console.log("111")
  },


  getUserInfo: function(cb) {
    var that = this;
    console.log("getUserInfo.js 1");

    if (this.globalData.userInfo) {

      // ofo 用户信息
      if (!this.globalData.userInfo.ofoInfo) {
        var userInfo2 = wx.getStorageSync("userInfo");
        if (userInfo2 && userInfo2 == 'object')
          this.globalData.userInfo = userInfo2;
      }
      typeof cb == "function" && cb(this.globalData.userInfo)
      return;
    }

    console.log("getUserInfo.js 2");
    var userInfo2 = wx.getStorageSync("userInfo");
    if (userInfo2 && typeof userInfo2 == 'object') {
      this.globalData.userInfo = userInfo2

      typeof cb == "function" && cb(this.globalData.userInfo)
      return
    }


    console.log("getUserInfo.js 3");
    //调用登录接口
    wx.login({
      success: function() {
        wx.getUserInfo({
          success: function(res) {
            console.log("getUserInfo.js 4");
            that.globalData.userInfo = res.userInfo
            typeof cb == "function" && cb(that.globalData.userInfo)
          }
        })
      }
    })
  },
  getUserInfoSync() {
    return this.globalData.userInfo;
  },
  globalData: {
    conditionUser: false,
    userInfo: null,
    // share: false, // 分享默认为false
    // height: 0,
    // height_body:0
    scrollHeight:0,
    name:"T客帮帮"
  },

})


/*//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})*/