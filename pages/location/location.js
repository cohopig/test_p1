// pages/location/location.js
var QQMapWX = require('../../qqmap-wx-jssdk.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    locationList: [],
    hidden: true,
    address: ''
  },
  onTap: function(e) {
    wx.setStorageSync('location', e.currentTarget.dataset.key)
    wx.switchTab({
      url: '/pages/home/home'
    })
  },
  getLocation: function() {
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
            that.setData({
              address: address
            })
            wx.setStorageSync('address', address)
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
  input: function(e) {
    if (e.detail.value) {
      this.setData({
        hidden: false
      })
      this.search(e.detail.value);
    } else {
      this.setData({
        hidden: true
      })
    }
  },
  search: function(text) {
    var that = this;
    wx.request({
      url: 'http://api.map.baidu.com/place/v2/search?query=' + text + '&page_size=20&page_num=0&scope=2&region=南昌&output=json&ak=btsVVWf0TM1zUBEbzFz6QqWF',
      success: function(res) {
        console.log(res);
        that.setData({
          locationList: res.data.results
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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
            that.setData({
              address: address
            })
            wx.setStorageSync('address', address)
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    wx.getSetting({
      success(res) {
        console.log(res)
        if (!res.authSetting['scope.userLocation']) {
          console.log("授权查询到没有，正在重新获取授权")
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              console.log("重新授权成功")
            }
          })
        } else {
          console.log("权限已开，可以作战")
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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