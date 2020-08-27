// pages/confirmForest/confirmForest.js
var util = require('../../utils/util.js');

Page({

  data: {
    pickerArray: ["代购", "代拿", "求助", "帮做", "信息发布"],
    src0: "../../images/PAOTUIDAIGOU.png",
    src1: "../../images/YUNDONG.png",
    src2: "../../images/DAISONGFUWU.png",
    src3: "../../images/SOUSUOHAIWAI.png",
    src4: "../../images/comment.png",
  },

  onLoad: function(options) {
    //var that=this,
    this.setData({
      pickernum: options.pickernum,
      i_1_1: options.i_1_1,
      i_1_2: options.i_1_2,
      i_2_1: options.i_2_1,
      i_2_2: options.i_2_2,
      i_2_3: options.i_2_3,
      i_2_4: options.i_2_4,
      i_3_1: options.i_3_1,
      i_4_1: options.i_4_1,
    })
    console.log(options)
  },

  onReady: function() {},
  onShow: function() {
    if (this.data.pickernum == 0) {
      this.setData({
        src: this.data.src0,
      })
    }
    if (this.data.pickernum == 1) {
      this.setData({
        src: this.data.src1,
      })
    }
    if (this.data.pickernum == 2) {
      this.setData({
        src: this.data.src2,
      })
    }
    if (this.data.pickernum == 3) {
      this.setData({
        src: this.data.src3,
      })
    }
    if (this.data.pickernum == 4) {
      this.setData({
        src: this.data.src4,
      })
    }
  },
  onHide: function() {},
  onUnload: function() {},
  onPullDownRefresh: function() {},
  onReachBottom: function() {},
  onShareAppMessage: function() {},

  formSubmitB1: function(out_trade_no) {
    console.log("订单内容", this.data.con)
    console.log("订单备注", this.data.not)
    console.log("订单电话", this.data.num)
    console.log("订单类型", this.data.pickerArray[this.data.pickernum], this.data.pickernum)
    console.log(this.data)
    var OpenidStr = wx.getStorageSync('openidStr');
    var Ordertimes = wx.getStorageSync('Ordertimes');
    console.log('openidStr：' + OpenidStr)
    var time = util.formatTime(new Date());
    var that = this
    var total_fee = this.data.i_4_1;
    this.setData({
      time: time
    });
    //发送订单
    //判断是否为顾客单
    if (!(that.data.pickernum > 2)) {
      wx.showLoading({
        title: '提交中...',
        mask: true,
      })
      var client = 'Customer'
      var itoplevel = "2"
      wx.request({
        url: 'https://www.sridc.cn/StorageOrderData/StorageOrderData_Customer.php',
        data: {
          nam: that.data.i_2_1,
          num: that.data.i_2_3,
          con: that.data.i_1_1,
          not: that.data.i_1_2,
          Add: that.data.i_2_4,
          mon1a: that.data.i_3_1,
          mon2a: that.data.i_4_1,
          pickernum: that.data.pickernum,
          wx: that.data.i_2_3,
          openidStr: OpenidStr,
          create_time: that.data.time,
          client: client,
          itoplevel: itoplevel
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        success: function(res) {
          console.log("回调：" + res.data),
            wx.hideLoading()
          wx.showModal({
            title: '成功',
            content: '订单提交成功,请完成支付',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                //预支付请求
                wx.request({
                  url: 'https://www.sridc.cn/Pay_/Pay_index.php',
                  data: {
                    openid: OpenidStr,
                    total_fee: total_fee,
                    body: 'T客帮帮'
                  },
                  method: "GET",
                  success: function(res) {
                    console.log(res);
                    wx.requestPayment({
                      timeStamp: res.data.timeStamp, //记住，这边的timeStamp一定要是字符串类型的，不然会报错
                      nonceStr: res.data.nonceStr,
                      package: res.data.package,
                      signType: 'MD5',
                      paySign: res.data.paySign,
                      success: function(event) {
                        // success
                        console.log(event);
                        wx.showToast({
                          title: '支付成功',
                          icon: 'success',
                          duration: 2000
                        });
                      },
                      fail: function(error) {
                        // fail
                        wx.showToast({
                          title: '支付失败',
                          icon: 'fail',
                          duration: 2000
                        });
                        console.log("支付失败")
                        console.log(error)
                      },
                      complete: function() {
                        // complete
                        console.log("pay complete")
                      }
                    });
                  },
                  fail: function(err) {
                    wx.showToast({
                      icon: "none",
                      title: '服务器异常，清稍候再试'
                    })
                  },
                });
              }
              wx.vibrateShort({
                success: function() {
                  console.log("震动")
                  wx.setStorageSync('Add', that.data.i_2_4)
                  wx.setStorageSync('nam', that.data.i_2_1)
                  wx.setStorageSync('num', that.data.i_2_3)
                  wx.setStorageSync('Wechat', that.data.i_2_3)
                  console.log("Add" + that.data.i_2_4)
                  console.log("nam" + that.data.i_2_1)
                  console.log("num" + that.data.i_2_3)
                  console.log("Wechat" + that.data.i_2_3)
                }
              })
            }
          })
        },
        fail: function(err) {
          console.log(err + "出错"),
            wx.showModal({
              title: '失败',
              content: '订单提交出错，请重新提交或联系客服',
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  wx.switchTab({
                    url: '../index/index'
                  })
                  console.log('失败：用户点击确定')
                }
                wx.vibrateLong({
                  success: function() {
                    console.log("震动")
                  }
                })
              }
            })
        }
      })
    } else {
      wx.showLoading({
        title: '提交中...',
        mask: true,
      })
      var client = 'Server'
      var itoplevel = "2"
      wx.request({
        url: 'https://www.sridc.cn/StorageOrderData/StorageOrderData_Server.php',
        data: {
          nam: that.data.i_2_1,
          num: that.data.i_2_3,
          con: that.data.i_1_1,
          not: that.data.i_1_2,
          Add: that.data.i_2_4,
          mon1a: that.data.i_3_1,
          mon2a: that.data.i_4_1,
          pickernum: that.data.pickernum,
          wx: that.data.i_2_3,
          openidStr: OpenidStr,
          create_time: that.data.time,
          client: client,
          itoplevel: itoplevel
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        success: function(res) {
          wx.hideLoading()
          console.log("回调：" + res.data),
            wx.showModal({
              title: '成功',
              content: '订单提交成功',
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  //预支付请求
                  wx.request({
                    url: 'https://www.sridc.cn/Pay_/Pay_index.php',
                    data: {
                      openid: OpenidStr,
                      total_fee: total_fee,
                      body: 'T客帮帮'
                    },
                    method: "GET",
                    success: function(res) {
                      console.log(res);
                      wx.requestPayment({
                        timeStamp: res.data.timeStamp, //记住，这边的timeStamp一定要是字符串类型的，不然会报错
                        nonceStr: res.data.nonceStr,
                        package: res.data.package,
                        signType: 'MD5',
                        paySign: res.data.paySign,
                        success: function(event) {
                          // success
                          console.log(event);
                          wx.showToast({
                            title: '支付成功',
                            icon: 'success',
                            duration: 2000
                          });
                        },
                        fail: function(error) {
                          // fail
                          wx.showToast({
                            title: '支付失败',
                            icon: 'fail',
                            duration: 2000
                          });
                          console.log("支付失败")
                          console.log(error)
                        },
                        complete: function() {
                          // complete
                          console.log("pay complete")
                        }
                      });
                    },
                    fail: function(err) {
                      wx.showToast({
                        icon: "none",
                        title: '服务器异常，清稍候再试'
                      })
                    },
                  });
                }
                wx.vibrateShort({
                  success: function() {
                    wx.setStorageSync('Add', that.data.i_2_4)
                    wx.setStorageSync('nam', that.data.i_2_1)
                    wx.setStorageSync('num', that.data.i_2_3)
                    wx.setStorageSync('Wechat', that.data.i_2_3)
                    console.log("Add" + that.data.i_2_4)
                    console.log("nam" + that.data.i_2_1)
                    console.log("num" + that.data.i_2_3)
                    console.log("Wechat" + that.data.i_2_3)
                  }
                })
              }
            })
        },
        fail: function(err) {
          console.log(err + "出错"),
            wx.showModal({
              title: '失败',
              content: '订单提交出错，请重新提交或联系客服',
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  wx.switchTab({
                    url: '../index/index'
                  })
                  console.log('失败：用户点击确定')
                }
                wx.vibrateLong({
                  success: function() {
                    console.log("震动")
                  }
                })
              }
            })
        }
      })
    }
  }
  /*wx.showToast({
    title: '成功',
    icon: 'success',
    duration: 2000,
    success:function(){
      wx.switchTab({
        url: '../index/index'
      })
    }
  })*/
})