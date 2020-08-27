//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '欢迎使用星球科技',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hasStep: false,
    second: 3,
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '我的主页', //导航栏 中间的标题
    },
    ErrorHandling: false
  },

  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function() {
    wx.setTopBarText({
      text: 'hello, fried!'
    })
    let that = this;
    let query = wx.createSelectorQuery().in(this)
    //根据节点id查询节点部分的高度（px单位）
    query.exec((res) => {
      // 然后窗口高度（wx.getSystemInfoSync().windowHeight）减去其他不滑动界面的高度
      // var data = wx.getMenuButtonBoundingClientRect()
      // console.log('菜单按键宽度：', data.width)
      // console.log('菜单按键高度：', data.height)
      // console.log('菜单按键上边界坐标：', data.top)
      // console.log('菜单按键右边界坐标：', data.right)
      // console.log('菜单按键下边界坐标：', data.bottom)
      // console.log('菜单按键左边界坐标：', data.left)
      // let scrollViewHeight = wx.getSystemInfoSync().statusBarHeight 
      let a = wx.getSystemInfoSync().windowHeight
      // 算出来之后存到data对象里面
      that.setData({
        // scrollHeight: scrollViewHeight,
        top: a / 4,
        name: app.globalData.name
      });
      // wx.setStorageSync('scrollHeight', that.data.scrollHeight)
    })
    wx.checkSession({
      success() {
        if (wx.getStorageSync('userInfo')) {
          that.setData({
            userInfo: wx.getStorageSync('userInfo'),
            hasUserInfo: true,
          })
          if (wx.getStorageSync('openidStr')) {
            that.setData({
              hasStep: true
            })
          }
        } else if (that.data.canIUse) {
          // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
          // 所以此处加入 callback 以防止这种情况
          app.userInfoReadyCallback = res => {
            that.setData({
              userInfo: res.userInfo,
              hasUserInfo: true
            })
          }
        } else {
          // 在没有 open-type=getUserInfo 版本的兼容处理
          wx.getUserInfo({
            success: res => {
              app.globalData.userInfo = res.userInfo
              that.setData({
                userInfo: res.userInfo,
                hasUserInfo: true,
                actionText: "退出登录"
              })
            }
          })
        }
      },
      fail() {
        // session_key 已经失效，需要重新执行登录流程
        wx.showModal({
          title: '提示',
          content: "登陆过期，请重新登录", //取消订单将需向对方支付违约金
          showCancel: false,
          success(res) {
            if (res.confirm) {
              console.log('点击确认');
            }
            wx.vibrateShort({
              success: function() {
                console.log("震动")
              }
            })
          },
          fail: function(res) {
            console.log(res.data)
            wx.showToast({
              title: '請求失敗,请刷新后重试',
              icon: 'fail',
              duration: 2000,
              mask: true,
            })
          }
        })
      }
    })
    const openidStr = wx.getStorageSync('openidStr')
    if (openidStr) {
      wx.request({
        url: 'https://sridc.cn/RetrieveOrder/CheckSqlUser.php',
        data: {
          openidStr: openidStr
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        success: function(res) {
          console.log(openidStr)
          if (!res.data) {
            wx.setStorageSync('conditionUser', false)
            that.setData({
              userInfo: wx.getStorageSync('userInfo'),
              hasUserInfo: true,
              hasStep: true,
              ErrorHandling: false
            })
          } else {
            wx.setStorageSync('UserRoot', res.data[0].aboutRoot)
            wx.setStorageSync('conditionUser', true)
            that.setData({
              userInfo: wx.getStorageSync('userInfo'),
              hasUserInfo: true,
              hasStep: true,
              ErrorHandling: false
            })
          }

          const conditionUser = wx.getStorageSync('conditionUser')
          if (!conditionUser || conditionUser == false) {
            wx.showModal({
              title: '提示',
              content: "请完成信息注册，以便更好使用平台各功能",
              showCancel: false
            });
          } else if (res.data == null) {
            wx.setStorageSync('conditionUser', false)
            wx.showModal({
              title: '提示',
              content: "数据请求无效，请联系客服，或重新注册（存在数据流冲突风险）",
              showCancel: false
            });
          }
        },
        fail: function(res) {
          console.log(res)
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    wx.setStorageSync('userInfo', e.detail.userInfo)
    wx.setStorageSync('gender', e.detail.userInfo.gender)
    let that = this;

    wx.login({
      success(res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: 'https://sridc.cn/StorageOrderData/StorageOpenId.php',
            data: {
              js_code: res.code,
            },
            success: function(res) {
              wx.setStorageSync('openidStr', res.data.openid)
              var openidStr = wx.getStorageSync('openidStr');
              console.log('回调数据' + res.data + 'openid：' + res.data.openid)
              //res.data（Object）数据类型不符合.
              if (openidStr) {
                wx.request({
                  url: 'https://sridc.cn/RetrieveOrder/CheckSqlUser.php',
                  data: {
                    openidStr: openidStr
                  },
                  header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                  },
                  method: 'POST',
                  success: function(res) {
                    if (!res.data) {
                      wx.setStorageSync('conditionUser', false)
                      that.setData({
                        userInfo: wx.getStorageSync('userInfo'),
                        hasUserInfo: true,
                        hasStep: true,
                        ErrorHandling: false
                      })
                      console.log("(!res.data")
                    } else {
                      wx.setStorageSync('conditionUser', true)
                      that.setData({
                        userInfo: wx.getStorageSync('userInfo'),
                        hasUserInfo: true,
                        hasStep: true,
                        ErrorHandling: false
                      })
                    }

                    const conditionUser = wx.getStorageSync('conditionUser')
                    if (!conditionUser || conditionUser == false) {
                      wx.showModal({
                        title: '提示',
                        content: "请完成信息注册，以便更好使用平台各功能",
                        showCancel: false
                      });
                    } else if (res.data == null) {
                      wx.setStorageSync('conditionUser', false)
                      wx.showModal({
                        title: '提示',
                        content: "数据请求无效，请联系客服，或重新注册（存在数据流冲突风险）",
                        showCancel: false
                      });
                    }
                  }
                })
              }
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  onShow: function() {
    let that = this
    if (!(wx.getStorageSync('openidStr'))) {
      that.setData({
        ErrorHandling: true,
        hasStep: false
      })

    }
  },
  handleTap1: function() {
    const conditionUser = wx.getStorageSync('conditionUser')
    const openidStr = wx.getStorageSync('openidStr')
    console.log("1")
    if (!openidStr) {
      wx.showModal({
        title: '提示',
        content: "请点击登录，再进行信息注册",
        showCancel: false
      });
      this.setData({
        ErrorHandling: true
      })
    } else if (!conditionUser || conditionUser == false) {
      wx.navigateTo({
        url: '../Usercontent/Usercontent'
      })
      wx.vibrateShort({
        success: function() {
          console.log("震动")
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: "请勿重复注册",
        showCancel: false
      });
    }
  },
  handleTap2: function() {
    const conditionUser = wx.getStorageSync('conditionUser')
    console.log("2")
    if (!conditionUser || conditionUser == false) {
      wx.navigateTo({
        url: '../Usercontent/Usercontent'
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
  },
  onPullDownRefresh: function() {
    var that = this
    that.onLoad();
    console.log("下拉刷新")
    wx.stopPullDownRefresh()
    console.log("下拉刷新结束")
  },
  handleTap3: function() {
    console.log("3")
    // wx.navigateTo({
    //   url: '../',
    // })
  }
  //   countdown: function () {
  //     var that = this
  //     var second = this.data.second
  //     if (second == 0) {
  //       that.setData({
  //         second: 60
  //       })
  //       return
  //     }
  //     var time = setTimeout(function () {
  //       that.setData({
  //         second: second - 1
  //       })
  //       that.countdown(that)
  //     }, 1000)
  //   },
})