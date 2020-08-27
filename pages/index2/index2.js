const app = getApp()
Page({

  data: {
    modalHidden1: true,
    modalHidden2: true,
    hide: 1,
    scrollHeight: app.globalData.scrollHeight
  },
  isAgreementButton1: function() {
    let that = this;
    this.setData({
      modalHidden1: false
    })
    console.log("打开使用条例")
  },
  isAgreementConfirm1: function() {
    this.setData({
      modalHidden1: true
    })
    console.log("点击事件（关闭条例")
  },
  isAgreementCandel1: function() {
    this.setData({
      modalHidden1: true
    })
    console.log("订单付款-点击取消")
  },
  isAgreementButton2: function() {
    let that = this;
    this.setData({
      modalHidden2: false
    })
    console.log("打开使用条例")
  },
  isAgreementConfirm2: function() {
    this.setData({
      modalHidden2: true
    })
    console.log("点击事件（关闭条例")
  },
  isAgreementCandel2: function() {
    this.setData({
      modalHidden2: true
    })
    console.log("订单付款-点击取消")
  },
  move: function() {},

  onLoad: function(options) {
    let that = this
    let query = wx.createSelectorQuery().in(this)

    //根据节点id查询节点部分的高度（px单位）
    // query.select('.header-title').boundingClientRect();
    query.exec((res) => {
      // 分别取出节点的高度
      // let aHeight = res[0].height;
      // let cHeight = res[2].height; 
      // console.log(cHeight) 值为0
      // 然后窗口高度（wx.getSystemInfoSync().windowHeight）减去其他不滑动界面的高度
      let scrollViewHeight2 = wx.getSystemInfoSync().windowHeight * (3 / 4)
      console.log(scrollViewHeight2)
      // 算出来之后存到data对象里面
      that.setData({
        scrollHeight2: scrollViewHeight2,
        name: app.globalData.name
      });
    })
  },

  onReady: function() {

  },

  onShow: function() {
    let that = this
    let query = wx.createSelectorQuery().in(this)
    //根据节点id查询节点部分的高度（px单位）
    query.select('.container').boundingClientRect();
    query.exec((res) => {
      // 分别取出节点的高度
      // let aHeight = res[0].height;
      // console.log(cHeight) 值为0
      // 然后窗口高度（wx.getSystemInfoSync().windowHeight）减去其他不滑动界面的高度
      let scrollViewHeight2 = wx.getSystemInfoSync().windowHeight*(3/4)
      // 算出来之后存到data对象里面
      that.setData({
        scrollHeight2: scrollViewHeight2,
      });
    })
  },

  onHide: function() {

  },

  onUnload: function() {

  },

  onPullDownRefresh: function() {
    var that = this
    that.onShow();
    console.log("下拉刷新")
    wx.stopPullDownRefresh()
    console.log("下拉刷新结束")
  },

  onReachBottom: function() {

  },

  onShareAppMessage: function() {

  },
  handleClickOrder: function() {
    const conditionUser = wx.getStorageSync('conditionUser')
    const openidStr = wx.getStorageSync('openidStr')
    const CLOSE = wx.getStorageSync('CLOSE')

    console.log("用户状态:" + conditionUser)
    console.log("用户状态:" + openidStr)
    if (!openidStr) {
      wx.showModal({
        title: '提示',
        content: "请先在首页点击上方按钮进行登录",
        showCancel: false,
      })
      wx.switchTab({
        url: '../index/index'
      })
    } else if (!conditionUser) {
      wx.navigateTo({
        url: '../Usercontent/Usercontent'
      })
      wx.vibrateShort({
        success: function() {
          console.log("震动")
        }
      })
    } else if (CLOSE == '1') {
      wx.showModal({
        title: '提示',
        content: "您已在平台违规多次，请及时联系客服处理！",
        showCancel: false,
      })
      wx.vibrateShort({
        success: function() {
          console.log("震动")
        }
      })
    } else if (conditionUser == true) {
      wx.navigateTo({
        url: '../postorder/postorder'
      })
      wx.vibrateShort({
        success: function() {
          console.log("震动")
        }
      })
    }
  }
})