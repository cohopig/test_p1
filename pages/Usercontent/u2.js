// pages/Usercontent/u2.js
var util = require('../../utils/util.js');
const app = getApp()
var QQMapWX = require('../../qqmap-wx-jssdk.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalHidden: true, // 是否显示用户协议
    submitBtn: false, // 是否允许提交
    con: "",
    scrollHeight: '',
    image: "../../images/check.png"
  },
  move: function() {},
  onLoad: function(options) {
    this.setData({
      grade: options.grade,
      major: options.major,
      StuId: options.StuId,
    })
    let that = this
    // 实例化腾讯地图API核心类
    var qqmapsdk = new QQMapWX({
      key: '5TIBZ-6L26J-TGZF4-KFWZ6-KZNN5-MPFJ6' // 必填
    });
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        console.log(latitude + longitude)
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function(addressRes) {
            var address = addressRes.result.formatted_addresses.recommend;
            wx.setStorageSync('address', address)
            that.setData({
              address: address
            })
            console.log("address" + address)
          },
          fail: function(error) {
            console.error(error);
          },
          complete: function(res) {
            console.log(res);
          }
        })
      }
    })

    let scrollHeight = wx.getSystemInfoSync().windowHeight * (3 / 4)
    this.setData({
      scrollHeight: scrollHeight,
    });
  },

  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
    // 实例化腾讯地图API核心类
    var qqmapsdk = new QQMapWX({
      key: '5TIBZ-6L26J-TGZF4-KFWZ6-KZNN5-MPFJ6' // 必填
    });
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        console.log(latitude + longitude)
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function(addressRes) {
            var address = addressRes.result.formatted_addresses.recommend;
            wx.setStorageSync('address', address)
            that.setData({
              address: address
            })
            console.log("address" + address)
          },
          fail: function(error) {
            console.error(error);
          },
          complete: function(res) {
            console.log(res);
          }
        })
      }
    })
  },
  getlocationButton: function() {
    var that = this
    // 实例化腾讯地图API核心类
    var qqmapsdk = new QQMapWX({
      key: '5TIBZ-6L26J-TGZF4-KFWZ6-KZNN5-MPFJ6' // 必填
    });
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        console.log(latitude + longitude)
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function(addressRes) {
            var address = addressRes.result.formatted_addresses.recommend;
            wx.setStorageSync('address', address)
            that.setData({
              address: address
            })
            console.log("address" + address)
          },
          fail: function(error) {
            console.error(error);
          },
          complete: function(res) {
            console.log(res);
          }
        })
      }
    })
    if (this.data.address !== null) {
      that.setData({
        hiddengetlocationButton: 'true'
      })
    }
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
    var that = this
    that.onShow();
    console.log("下拉刷新")
    wx.stopPullDownRefresh()
    console.log("下拉刷新结束")
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
    if (e.detail.value.nam === "") {
      wx.showModal({
        title: '提示',
        content: "请填写您的名字！",
        showCancel: false
      });
    } else if (!(/^[0-9a-zA-Z\u4e00-\u9fa5]+$/.test(e.detail.value.nam))) {
      wx.showModal({
        title: '提示',
        content: "请勿带有特殊符号",
        showCancel: false
      });
    } else if (e.detail.value.num === "") {
      wx.showModal({
        title: '提示',
        content: "请填写您的手机号！",
        showCancel: false
      });
    } else if (!(/^1(3|4|5|7|8)\d{9}$/.test(e.detail.value.num))) {
      wx.showModal({
        title: '提示',
        content: "手机号格式不正确",
        showCancel: false
      });
    } else if (e.detail.value.wx === "") {
      wx.showModal({
        title: '提示',
        content: "请填写您的Wechat",
        showCancel: false
      });
    } else if (e.detail.value.Add === "") {
      wx.showModal({
        title: '提示',
        content: "请填写您的寝室地址",
        showCancel: false
      });
    } else if (!(/^[0-9a-zA-Z\u4e00-\u9fa5]+$/.test(e.detail.value.Add))) {
      wx.showModal({
        title: '提示',
        content: "请勿带有特殊符号",
        showCancel: false
      });
    } else if (this.data.address == null) {
      wx.showModal({
        title: '错误',
        content: "获取用户位置失败,若是错误点击,请重新进入一次页面或马上联系客服",
        showCancel: false
      });
    } else {
      flag = false; //若必要信息都填写，则不用弹框，且页面可以进行跳转
      var that = this;
      //？后面跟的是需要传递到下一个页面的参数
      var time = util.formatTime(new Date());
      // 再通过setData更改Page()里面的data，动态更新页面的数据
      this.setData({
        time: time
      });
      var OpenidStr = wx.getStorageSync('openidStr');
      var gender = wx.getStorageSync('gender');
      var address = wx.getStorageSync('address');
      console.log('openidStr：' + OpenidStr)
      wx.showLoading({
        title: '提交中...',
        mask: true,
      })
      wx.request({
        url: 'https://www.sridc.cn/StorageOrderData/StorageUsercontent.php',
        data: {
          grade: that.data.grade,
          major: that.data.major,
          StuId: that.data.StuId,
          nam: e.detail.value.nam,
          num: e.detail.value.num,
          Add: e.detail.value.Add,
          openidStr: OpenidStr,
          create_time: this.data.time,
          wx: e.detail.value.wx,
          address: address,
          gender: gender
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        success: function(res) {
          wx.hideLoading()
          console.log("回调：" + res.data)
          wx.setStorageSync('Add', e.detail.value.Add)
          wx.setStorageSync('nam', e.detail.value.nam)
          wx.setStorageSync('num', e.detail.value.num)
          wx.setStorageSync('Wechat', e.detail.value.wx)
          wx.showModal({
            title: '成功',
            content: '信息提交成功',
            showCancel: false,
            success(res) {
              wx.setStorageSync('conditionUser', true)
              if (res.confirm) {
                wx.navigateBack({
                  delta: 2
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
  agreeMent: function (e) {
    let that = this;
    if (e.detail.value == 'true') {
      that.setData({
        submitBtn: false,
      })
    } else {
      that.setData({
        submitBtn: true,
      })
    }
  },
  isAgreementButton: function() {
    let that = this;
    this.setData({
      modalHidden: false
    })
    console.log("打开使用条例")
  },
  isAgreementConfirm: function() {
    this.setData({
      modalHidden: true
    })
    console.log("点击事件（关闭条例")
  },
  isAgreementCandel: function() {
    this.setData({
      modalHidden: true
    })
    console.log("订单付款-点击取消")
  },
})