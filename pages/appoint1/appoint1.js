Page({
  data: {
    
   },

  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
  },
  bindDateChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
  },

  onLoad: function (options) {

  },


  onReady: function () {

  },


  onShow: function () {

  },


  onHide: function () {

  },


  onUnload: function () {

  },


  onPullDownRefresh: function () {

  },


  onReachBottom: function () {

  },


  onShareAppMessage: function () {

  }
})