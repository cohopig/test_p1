// pages/user-code/user-code.js
const app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // const {
    //   opId
    // } = app.globalData.user;
    wx.showLoading();
    // util.get("/api/wx/get/qrcode/" + opId).then((data)=>{
    //   console.log(data)
    //   this.setData({
    //     usercode: data.qrCode
    //   })
    //   wx.hideLoading();
    // })     
    wx.hideLoading();

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

    wx.showModal({
      title: 'hi：',
      content: '有什么关于程序建议给咱们提吗？？一经采纳，将收到程序员小哥的准备的锦鲤一条',
      showCancel: false,
      success(res) {
        if (res.confirm) {
          wx.switchTab({
            url: '../index/index'
          })
          console.log('失败：用户点击确定')
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})