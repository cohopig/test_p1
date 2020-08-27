// pages/home/home.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pickerArray: ["代购", "代拿", "求助", "帮做", "信息发布"],
    ConditionArray: ["待审核", "待接单", "待完成", "待评价", '已评价'],
    scrollHeight: '',
    scrollHeight2: '',
    tip: '正在加载',
    loading: true,
    srcArray: ["../../images/PAOTUIDAIGOU.png", "../../images/YUNDONG.png", "../../images/DAISONGFUWU.png", "../../images/SOUSUOHAIWAI.png", "../../images/comment.png"],

    characteristicList: [{
      text: "免配送费"
    }, {
      text: "0元起送"
    }, {
      text: "3"
    }, {
      text: "4"
    }, {
      text: "跨天预定"
    }],
    sortList: [{
      sort: "综合排序",
      image: "",
    }, {
      sort: "服务费最低",
      image: "",
    }, {
      sort: "服务费最高",
      image: "",
    }],
    selected: 0,
    mask1Hidden: true,
    mask2Hidden: true,
    animationData: "",
    location: "",
    characteristicSelected: [false, false, false, false, false, false, false],
    discountSelected: null,
    selectedNumb: 0,
    sortSelected: "综合排序"
  },
  finish: function() {
    var that = this;
    wx.request({
      url: "https://www.easy-mock.com/mock/596257bc9adc231f357c4664/restaurant/filter",
      method: "GET",
      success: function(res) {
        that.setData({
          restaurant: res.data.data.restaurant,
        })
      }
    });
  },
  sortSelected: function(e) {
    var that = this;
    wx.request({
      url: "https://www.easy-mock.com/mock/596257bc9adc231f357c4664/restaurant/overAll",
      method: "GET",
      success: function(res) {
        that.setData({
          restaurant: res.data.data.restaurant,
          sortSelected: that.data.sortList[e.currentTarget.dataset.index].sort
        })
      }
    });
  },
  clearSelectedNumb: function() {
    this.setData({
      characteristicSelected: [false],
      discountSelected: null,
      selectedNumb: 0
    })
  },
  characteristicSelected: function(e) {
    var info = this.data.characteristicSelected;
    info[e.currentTarget.dataset.index] = !info[e.currentTarget.dataset.index];
    this.setData({
      characteristicSelected: info,
      selectedNumb: this.data.selectedNumb + (info[e.currentTarget.dataset.index] ? 1 : -1)
    })
    console.log(e.currentTarget.dataset.index);
  },
  discountSelected: function(e) {
    if (this.data.discountSelected != e.currentTarget.dataset.index) {
      this.setData({
        discountSelected: e.currentTarget.dataset.index,
        selectedNumb: this.data.selectedNumb + (this.data.discountSelected == null ? 1 : 0)
      })
    } else {
      this.setData({
        discountSelected: null,
        selectedNumb: this.data.selectedNumb - 1
      })
    }
  },
  mask1Cancel: function() {
    this.setData({
      mask1Hidden: true
    })
  },
  mask2Cancel: function() {
    this.setData({
      mask2Hidden: true
    })
  },
  onOverallTag: function() {
    this.setData({
      mask1Hidden: false
    })
  },
  onFilter: function() {
    this.setData({
      mask2Hidden: false
    })
  },

  onLoad: function(options) {
    let that = this;
    let query = wx.createSelectorQuery().in(this)
    const openidStr = wx.getStorageSync('openidStr');
    var Condition = '1'
    //根据节点id查询节点部分的高度（px单位）
    query.select('.heard').boundingClientRect();
    query.select('.header-title').boundingClientRect();
    query.exec((res) => {
      // 分别取出节点的高度
      let aHeight = res[0].height;
      let bHeight = res[1].height;
      // let cHeight = res[2].height; 
      // console.log(cHeight) 值为0
      // 然后窗口高度（wx.getSystemInfoSync().windowHeight）减去其他不滑动界面的高度
      let scrollViewHeight2 = wx.getSystemInfoSync().windowHeight -
        aHeight - bHeight - bHeight - 8;

      console.log(wx.getSystemInfoSync().statusBarHeight)
      console.log(aHeight)
      console.log(bHeight)
      // 算出来之后存到data对象里面
      that.setData({
        scrollHeight2: scrollViewHeight2,
        name: app.globalData.name
      });
    })
    if (!openidStr) {
      wx.showModal({
        title: '提示',
        content: "请先在首页点击上方按钮进行登录,如若以登陆,请尝试重新打开小程序",
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
    } else {
      wx.request({
        url: "https://www.sridc.cn/RetrieveOrder/root-RetrieveOrder_.php",
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          OpenidStr: openidStr,
          Condition: Condition
        },
        success: function(res) {
          if (res.data.data1 != null && res.data.data2.length > 0) {
            console.log(res.data)
            var order_list = res.data.data1
            var order_UserRoot = res.data.data2
            console.log("输出order_UserRoot:" + order_UserRoot[0].aboutRoot)
            wx.setStorageSync('UserRoot', order_UserRoot[0].aboutRoot)
            wx.setStorageSync('Ordertimes', order_UserRoot[0].Ordertimes)
            that.setData({
              order_list: order_list,
            })
            if (order_UserRoot == null || !order_UserRoot) {
              wx.showModal({
                title: '提示',
                content: "请先完成信息注册",
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
            } else if (!res.data.length > 0) {
              that.setData({
                tip: "暂无订单",
                loading: false
              })
            }
          } else {
            wx.showModal({
              title: '提示',
              content: "请确认是否完成信息注册",
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
        fail: function(res) {
          console.log(res.data)
          wx.showToast({
            title: '請求失敗',
            icon: 'fail',
            duration: 2000,
            mask: true,
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../index2/index2'
                })
                console.log('发生跳转事件');
              }
            }
          })
          this.setData({
            tip: "加载失败，请重试！",
            loading: false
          })
        }
      });
    }
  },
  onReady: function() {

  },

  onShow: function() {
    var that = this;
    var address = wx.getStorageSync('address');
    const OpenidStr = wx.getStorageSync('openidStr');
    if (!OpenidStr) {
      wx.showModal({
        title: '提示',
        content: "请先在首页点击上方按钮进行登录,如若以登陆,请尝试重新打开小程序",
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
    } else {
      that.setData({
        address: address
      })
      this.setData({
        selected: 0
      });
      var Condition = '1'
      wx.request({
        url: "https://www.sridc.cn/RetrieveOrder/root-RetrieveOrder_.php",
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          OpenidStr: OpenidStr,
          Condition: Condition
        },
        success: function(res) {
          console.log(res.data)
          console.log(res.data.data1)
          console.log(res.data.data2)
          if (res.data.data1 != null && res.data.data2.length > 0) {
            var order_list = res.data.data1
            var order_UserRoot = res.data.data2
            console.log("输出order_UserRoot:" + order_UserRoot[0].aboutRoot)
            wx.setStorageSync('UserRoot', order_UserRoot[0].aboutRoot)
            wx.setStorageSync('Ordertimes', order_UserRoot[0].Ordertimes)
            that.setData({
              order_list: order_list,
              // location: wx.getStorageSync('location')
            })
            if (order_UserRoot == null || !order_UserRoot) {
              wx.showModal({
                title: '提示',
                content: "请先完成信息注册",
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
            } else if (!res.data.length > 0) {
              that.setData({
                tip: "暂无订单",
                loading: false
              })
            }
          } else {
            wx.showModal({
              title: '提示',
              content: "请在首页进行信息注册。",
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
        fail: function(res) {
          console.log(res.data)
          wx.showToast({
            title: '請求失敗',
            icon: 'fail',
            duration: 2000,
            mask: true,
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../index2/index2'
                })
                console.log('发生跳转事件');
              }
            }
          })
          this.setData({
            tip: "加载失败，请重试！",
            loading: false
          })
        }
      })
    }
  },
  bindInput: function(e) {
    var that = this;
    var OpenidStr = wx.getStorageSync('openidStr');
    var Condition = '1'
    console.log('Add' + e.detail.value)
    if (e.detail.value) {
      wx.showLoading({
        title: '正在请求服务器...',
        mask: true,
      })
      wx.request({
        url: "https://www.sridc.cn/RetrieveOrder/RetrieveAllOrder_Imput.php",
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          Add: e.detail.value,
          Condition: Condition,
        },
        success: function(res) {
          wx.hideLoading()
          console.log(res.data) //输出类型没有转换 显示失败 数据正常
          console.log('Server:我是分析：' + OpenidStr)
          var order_list_like = res.data
          that.setData({
            order_list: order_list_like,
            selected: 0
          })
          if (!res.data.length > 0) {
            that.setData({
              tip: "暂无匹配该地址的订单",
              loading: false,
              selected: 0
            })
          }
        },
        fail: function(res) {
          console.log(res.data)
          wx.showToast({
            title: '請求失敗',
            icon: 'fail',
            duration: 2000,
            mask: true,
          })
          this.setData({
            tip: "加载失败，请重试！",
            loading: false
          })
        }
      })
    } else {
      wx.showLoading({
        title: '正在请求服务器...',
        mask: true,
      })
      wx.request({
        url: "https://www.sridc.cn/RetrieveOrder/root-RetrieveOrder_.php",
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          OpenidStr: OpenidStr,
          Condition: Condition
        },
        success: function(res) {
          wx.hideLoading()
          console.log(res.data)
          var order_list = res.data.data1
          var order_UserRoot = res.data.data2
          that.setData({
            order_list: order_list,
          })
          wx.setStorageSync('UserRoot', order_UserRoot[0].aboutRoot)
          wx.setStorageSync('Ordertimes', order_UserRoot[0].Ordertimes)
          if (!res.data.length > 0) {
            that.setData({
              tip: "暂无订单",
              loading: false
            })
          }
        },
        fail: function(res) {
          console.log(res.data)
          wx.showToast({
            title: '請求失敗',
            icon: 'fail',
            duration: 2000,
            mask: true,
          })
          this.setData({
            tip: "加载失败，请重试！",
            loading: false
          })
        }
      })
    }
  },
  onHide: function() {

  },

  onUnload: function() {

  },
  upper: function() {
    var that = this

    wx.setNavigationBarTitle({
      title: '刷新中'
    })
    wx.showNavigationBarLoading(); //在当前页面显示导航条加载动画。
    that.onShow()
    wx.hideNavigationBarLoading(); //隐藏导航条加载动画。
    wx.setNavigationBarTitle({
      title: '星球科技'
    })
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
  onTapTag0: function(e) {
    this.setData({
      selected: e.currentTarget.dataset.index
    });
    var that = this;
    const OpenidStr = wx.getStorageSync('openidStr');
    var Condition = '1'
    wx.request({
      url: "https://www.sridc.cn/RetrieveOrder/root-RetrieveOrder_.php",
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        OpenidStr: OpenidStr,
        Condition: Condition
      },
      success: function(res) {
        console.log(res.data)
        var order_list = res.data.data1
        var order_UserRoot = res.data.data2
        console.log("输出order_UserRoot:" + order_UserRoot[0].aboutRoot)
        wx.setStorageSync('UserRoot', order_UserRoot[0].aboutRoot)
        wx.setStorageSync('Ordertimes', order_UserRoot[0].Ordertimes)
        that.setData({
          order_list: order_list,
          // location: wx.getStorageSync('location')
        })
        if (order_UserRoot == null || !order_UserRoot) {
          wx.showModal({
            title: '提示',
            content: "请先完成信息注册",
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
        } else if (!res.data.length > 0) {
          that.setData({
            tip: "暂无订单",
            loading: false
          })
        }
      },
      fail: function(res) {
        console.log(res.data)
        wx.showToast({
          title: '請求失敗',
          icon: 'fail',
          duration: 2000,
          mask: true,
          success(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '../index2/index2'
              })
              console.log('发生跳转事件');
            }
          }
        })
        this.setData({
          tip: "加载失败，请重试！",
          loading: false
        })
      }
    })
  },
  onTapTag1: function(e) {
    this.setData({
      selected: e.currentTarget.dataset.index
    });
    var that = this;
    const OpenidStr = wx.getStorageSync('openidStr');
    var Condition = '1'
    wx.request({
      url: "https://www.sridc.cn/RetrieveOrder/RetrieveOrder_Server.php",
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        Condition: Condition
      },
      success: function(res) {
        console.log(res.data)
        var order_list = res.data
        that.setData({
          order_list: order_list,
          // location: wx.getStorageSync('location')
        })
        if (!res.data.length > 0) {
          that.setData({
            tip: "暂无订单",
            loading: false
          })
        }
      },
      fail: function(res) {
        console.log(res.data)
        wx.showToast({
          title: '請求失敗',
          icon: 'fail',
          duration: 2000,
          mask: true,
          success(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '../index2/index2'
              })
              console.log('发生跳转事件');
            }
          }
        })
        this.setData({
          tip: "加载失败，请重试！",
          loading: false
        })
      }
    })
  },

  Ordercheck: function(a) {

    // var pages = getCurrentPages()  
    // console.log(pages[0].data)
    console.log(a)

    wx.navigateTo({
      url: '../OrderList/Ordercheck?Order_type=' + a.currentTarget.dataset.menuitem["Order_type"] +
        '&create_time=' + a.currentTarget.dataset.menuitem["create_time"] +
        '&Order_content=' + a.currentTarget.dataset.menuitem["Order_content"] +
        '&Order_notes=' + a.currentTarget.dataset.menuitem["Order_notes"] +
        '&Order_Add=' + a.currentTarget.dataset.menuitem["Order_Add"] +
        '&Order_name=' + a.currentTarget.dataset.menuitem["Order_name"] +
        '&Order_number=' + a.currentTarget.dataset.menuitem["Order_number"] +
        '&Order_mon1a=' + a.currentTarget.dataset.menuitem["Order_mon1a"] +
        '&Order_mon2a=' + a.currentTarget.dataset.menuitem["Order_mon2a"] +
        '&Wechat=' + a.currentTarget.dataset.menuitem["Wechat"] +
        '&Olyid=' + a.currentTarget.dataset.menuitem["Olyid"] +
        '&Order_condition=' + a.currentTarget.dataset.menuitem["Order_condition"] +
        '&Customer_id=' + a.currentTarget.dataset.menuitem["Customer_id"] +
        '&Server_id=' + a.currentTarget.dataset.menuitem["Server_id"] +
        '&client=' + a.currentTarget.dataset.menuitem["client"] +
        '&Take_time=' + a.currentTarget.dataset.menuitem["Take_time"] +
        '&itoplevel=' + a.currentTarget.dataset.menuitem["itoplevel"]

    })
  },
  // tapName: function (event) {
  //   console.log(event.currentTarget.dataset)
  // }
})