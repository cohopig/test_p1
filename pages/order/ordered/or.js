// pages/order/ordered/or.js
const app = getApp()
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Tel: "",
    starIndex1: 5
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      Order_type: options.Order_type,
      create_time: options.create_time,
      Order_content: options.Order_content,
      Order_notes: options.Order_notes,
      Order_number: options.Order_number,
      Order_Add: options.Order_Add,
      Order_mon1a: options.Order_mon1a,
      Order_mon2a: options.Order_mon2a,
      Order_name: options.Order_name,
      Wechat: options.Wechat,
      Olyid: options.Olyid,
      Order_condition: options.Order_condition,
      Customer_id: options.Customer_id,
      Server_id: options.Server_id,
      client: options.client,
      Take_time: options.Take_time,
      Complete_time: options.Complete_time
    })
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
    var that = this;
    var Tel = wx.getStorageSync('num');
    that.setData({
      Tel: Tel
    })
  },
  onChange1(e) {
    const index = e.detail.index;
    this.setData({
      'starIndex1': index
    })
    console.log('starIndex1' + index)
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

  },
  formSubmit: function(e) {
    var warn = ""; //弹框时提示的内容
    var flag = true; //判断信息输入是否完整
    //判断的顺序依次是：姓名-手机号-地址-具体地址-预约日期-预约时间-开荒面积
    if (e.detail.value.Tel === "") {
      wx.showModal({
        title: '提示',
        content: "请填写您的手机号！",
        showCancel: false
      });
    } else if (!(/^1(3|4|5|7|8)\d{9}$/.test(e.detail.value.Tel))) {
      wx.showModal({
        title: '提示',
        content: "手机号格式不正确",
        showCancel: false
      });
    } else if (e.detail.value.Content === "") {
      wx.showModal({
        title: '提示',
        content: "请填写您的订单内容",
        showCancel: false
      });
    } else if (!(/^[0-9a-zA-Z\u4e00-\u9fa5]+$/.test(e.detail.value.Content))) {
      wx.showModal({
        title: '提示',
        content: "请勿带有特殊符号",
        showCancel: false
      });
    } else {
      flag = false; //若必要信息都填写，则不用弹框，且页面可以进行跳转
      var that = this;
      //？后面跟的是需要传递到下一个页面的参数
      var time = util.formatTime(new Date());
      // 再通过setData更改Page()里面的data，动态更新页面的数据
      wx.showLoading({
        title: '提交中...',
        mask: true,
      })
      wx.request({
        url: 'https://www.sridc.cn/StorageOrderData/evaluation_fir.php',
        data: {
          Content: e.detail.value.Content,
          Tel: e.detail.value.Tel,
          starIndex1: this.data.starIndex1,
          Olyid: this.data.Olyid,
          time: time,
          flag: this.data.client
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        success: function(res) {
          wx.hideLoading()
          console.log("回调：" + res.data)
          console.log(that.data.client)
          wx.showModal({
            title: '成功',
            content: '信息提交成功',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 3
                })
                console.log('成功：用户点击确定')
              }
            }
          })
        },
        fail: function(err) {
          console.log(err + "出错"),
            wx.showModal({
              title: '失败',
              content: '信息上传出错，请重新提交或联系客服',
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
        }
      }) //如果信息填写不完整，弹出输入框
    }
  },
})