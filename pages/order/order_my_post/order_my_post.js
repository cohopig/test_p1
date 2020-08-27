const app = getApp()
Page({
  data: {
    hide: false,
    pickerArray: ["代购", "代拿", "求助", "帮做", "信息发布"],
    ConditionArray: ["待审核", "待接单", "待完成", "待评价", '已评价', '已取消'],
    selected: 0,
    tip: '正在加载',
    srcArray: ["../../images/PAOTUIDAIGOU.png", "../../images/YUNDONG.png", "../../images/DAISONGFUWU.png", "../../images/SOUSUOHAIWAI.png", "../../images/comment.png"],
    loading: true,
    mask1Hidden: true,
    mask2Hidden: true,
    mask3Hidden: true,
    characteristicSelected: [false, false, false, false, false, false, false],
    discountSelected: null,
    sortSelected1: "生活相关",
    sortSelected2: "在线工作",
    selectedNumb: 0,
    sortList1: [{
      sort: "生活相关",
      image: "",
      Order_type: "",
      client: ""
    }],
    sortList2: [{
      sort: "在线工作",
      image: "",
      Order_type: "",
    }],
  },

  onLoad: function() {
    wx.setNavigationBarTitle({
      title: '我的订单',
    })
    let that = this;
    let query = wx.createSelectorQuery().in(this)
    //根据节点id查询节点部分的高度（px单位）
    query.select('.header-title').boundingClientRect();
    query.select('.sort-list').boundingClientRect();
    query.exec((res) => {
      // 分别取出节点的高度
      let aHeight = res[0].height;
      let bHeight = res[1].height;
      // let cHeight = res[2].height; 
      // console.log(cHeight) 值为0
      // 然后窗口高度（wx.getSystemInfoSync().windowHeight）减去其他不滑动界面的高度
      let scrollViewHeight = wx.getSystemInfoSync().windowHeight -
        aHeight - bHeight - 3;
      console.log(scrollViewHeight)
      // 算出来之后存到data对象里面
      that.setData({
        scrollHeight: scrollViewHeight,
      });
    })
    var OpenidStr = wx.getStorageSync('openidStr');
    var flag = 0
    var flagType = "order_my_post"
    wx.request({
      url: "https://www.sridc.cn/RetrieveOrder/RetrieveOrder)Customer_mine_order.php",
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        OpenidStr: OpenidStr,
        flag: flag,
        flagType: flagType
      },
      success: function(res) {
        console.log(res.data) //输出类型没有转换 显示失败 数据正常
        console.log('mine:我是分析：' + OpenidStr)
        var order_list_mine = res.data
        that.setData({
          order_list_mine: order_list_mine,
          // location: wx.getStorageSync('location')
        })
        if (!res.data.length > 0) {
          that.setData({
            tip: "暂无订单",
            loading: false
          })
        }
      }
    })


  },
  onShow: function() {},
  //   var that = this;
  //   var OpenidStr = wx.getStorageSync('openidStr');
  //   if (this.data.selected == 0) {
  //     wx.request({
  //       url: "https://www.sridc.cn/RetrieveOrder/RetrieveAllOrder_mine.php",
  //       method: "POST",
  //       header: {
  //         "Content-Type": "application/x-www-form-urlencoded"
  //       },
  //       data: {
  //         OpenidStr: OpenidStr,
  //       },
  //       success: function(res) {
  //         console.log(res.data) //输出类型没有转换 显示失败 数据正常
  //         console.log('我是分析：' + OpenidStr)
  //         var order_list_mine = res.data
  //         that.setData({
  //           order_list_mine: order_list_mine,
  //           selected: 0,
  //           // location: wx.getStorageSync('location')
  //         })
  //         if (!res.data.length > 0) {
  //           that.setData({
  //             tip: "暂无订单",
  //             loading: false
  //           })
  //         }
  //       },
  //       fail: function(res) {
  //         console.log(res.data)
  //         wx.showToast({
  //           title: '請求失敗',
  //           icon: 'fail',
  //           duration: 2000,
  //           mask: true,
  //         })
  //         this.setData({
  //           tip: "加载失败，请重试！",
  //           loading: false
  //         })
  //       }
  //     })
  //   } else if (this.data.selected == 1) {
  //     wx.request({
  //       url: "https://www.sridc.cn/RetrieveOrder/RetrieveAllOrder_Server.php",
  //       method: "POST",
  //       header: {
  //         "Content-Type": "application/x-www-form-urlencoded"
  //       },
  //       data: {
  //         OpenidStr: OpenidStr,
  //       },
  //       success: function(res) {
  //         console.log(res.data) //输出类型没有转换 显示失败 数据正常
  //         console.log('Server:我是分析：' + OpenidStr)
  //         var order_list_mine = res.data
  //         that.setData({
  //           order_list_mine: order_list_mine,
  //           // location: wx.getStorageSync('location')
  //         })
  //         if (!res.data.length > 0) {
  //           that.setData({
  //             tip: "暂无订单",
  //             loading: false
  //           })
  //         }
  //       },
  //       fail: function(res) {
  //         console.log(res.data)
  //         wx.showToast({
  //           title: '請求失敗',
  //           icon: 'fail',
  //           duration: 2000,
  //           mask: true,
  //         })
  //         this.setData({
  //           tip: "加载失败，请重试！",
  //           loading: false
  //         })
  //       }
  //     })
  //   }
  // },
  // onTapTag_Server: function(e) {
  //   this.setData({
  //     selected: e.currentTarget.dataset.index
  //   });
  //   var that = this;
  //   var OpenidStr = wx.getStorageSync('openidStr');
  //   wx.request({
  //     url: "https://www.sridc.cn/RetrieveOrder/RetrieveAllOrder_Server.php",
  //     method: "POST",
  //     header: {
  //       "Content-Type": "application/x-www-form-urlencoded"
  //     },
  //     data: {
  //       OpenidStr: OpenidStr,
  //     },
  //     success: function(res) {
  //       console.log(res.data) //输出类型没有转换 显示失败 数据正常
  //       console.log('Server:我是分析：' + OpenidStr)
  //       var order_list_mine = res.data
  //       that.setData({
  //         order_list_mine: order_list_mine,
  //         // location: wx.getStorageSync('location')
  //       })
  //       if (!res.data.length > 0) {
  //         that.setData({
  //           tip: "暂无订单",
  //           loading: false
  //         })
  //       }
  //     },
  //     fail: function(res) {
  //       console.log(res.data)
  //       wx.showToast({
  //         title: '請求失敗',
  //         icon: 'fail',
  //         duration: 2000,
  //         mask: true,
  //       })
  //       this.setData({
  //         tip: "加载失败，请重试！",
  //         loading: false
  //       })
  //     }
  //   })
  // },
  // onTapTag0: function(e) {
  //   this.setData({
  //     selected: e.currentTarget.dataset.index
  //   });
  //   var that = this;
  //   var OpenidStr = wx.getStorageSync('openidStr');
  //   wx.request({
  //     url: "https://www.sridc.cn/RetrieveOrder/RetrieveAllOrder_mine.php",
  //     method: "POST",
  //     header: {
  //       "Content-Type": "application/x-www-form-urlencoded"
  //     },
  //     data: {
  //       OpenidStr: OpenidStr,
  //     },
  //     success: function(res) {
  //       console.log(res.data) //输出类型没有转换 显示失败 数据正常
  //       console.log('mine:我是分析：' + OpenidStr)
  //       var order_list_mine = res.data
  //       that.setData({
  //         order_list_mine: order_list_mine,
  //         // location: wx.getStorageSync('location')
  //       })
  //       if (!res.data.length > 0) {
  //         that.setData({
  //           tip: "暂无订单",
  //           loading: false
  //         })
  //       }
  //     },
  //     fail: function(res) {
  //       console.log(res.data)
  //       wx.showToast({
  //         title: '請求失敗',
  //         icon: 'fail',
  //         duration: 2000,
  //         mask: true,
  //       })
  //       this.setData({
  //         tip: "加载失败，请重试！",
  //         loading: false
  //       })
  //     }
  //   })

  Ordercheck: function(a) {

    // var pages = getCurrentPages()  
    // console.log(pages[0].data)
    console.log(a)

    wx.navigateTo({
      url: '../Ordercheck/Ordercheck?Order_type=' + a.currentTarget.dataset.menuitem["Order_type"] +
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
        '&Complete_time=' + a.currentTarget.dataset.menuitem["Complete_time"]

    })
  },
  onPullDownRefresh: function() {
    var that = this
    that.onShow();
    console.log("下拉刷新")
    wx.stopPullDownRefresh()
    console.log("下拉刷新结束")
  },
  // Ordercheck: function (a) {
  //   // var pages = getCurrentPages()  
  //   // console.log(pages[0].data)
  //   console.log(a)

  //   wx.navigateTo({
  //     url: '../OrderList/Ordercheck?Order_type=' + a.currentTarget.dataset.menuitem["Order_type"] + '&create_time=' + a.currentTarget.dataset.menuitem["create_time"] + '&Order_content=' + a.currentTarget.dataset.menuitem["Order_content"] + '&Order_notes=' + a.currentTarget.dataset.menuitem["Order_notes"] + '&Order_number=' + a.currentTarget.dataset.menuitem["Order_number"]
  //   })
  // },

  sortSelected1: function(e) {
    var that = this;
    var OpenidStr = wx.getStorageSync('openidStr');
    var flag = e.currentTarget.dataset.index
    var flagType = "order_my_post"
    wx.request({
      url: "https://www.sridc.cn/RetrieveOrder/RetrieveOrder)Customer_mine_order.php",
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        OpenidStr: OpenidStr,
        flag: flag,
        flagType: flagType
      },
      success: function(res) {
        console.log(res.data) //输出类型没有转换 显示失败 数据正常
        console.log('mine:我是分析：' + OpenidStr)
        var order_list_mine = res.data
        that.setData({
          order_list_mine: order_list_mine,
          // location: wx.getStorageSync('location')
        })
        if (flag == 0) {
          that.setData({
            sortSelected1: "所有生活相关订单"
          })
        } else if (flag == 1) {
          that.setData({
            sortSelected1: "我是顾客"
          })
        } else if (flag == 2) {
          that.setData({
            sortSelected1: "我是配送员"
          })
        }
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
  },
  sortSelected2: function(e) {
    var that = this;
    var OpenidStr = wx.getStorageSync('openidStr');
    var flag = e.currentTarget.dataset.index
    var flagType = "order_my_post"
    wx.request({
      url: "https://www.sridc.cn/RetrieveOrder/RetrieveOrder)Server_mine_order.php",
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        OpenidStr: OpenidStr,
        flag: flag,
        flagType: flagType
      },
      success: function(res) {
        console.log(res.data) //输出类型没有转换 显示失败 数据正常
        console.log('mine:我是分析：' + OpenidStr)
        var order_list_mine = res.data
        that.setData({
          order_list_mine: order_list_mine,
          // location: wx.getStorageSync('location')
        })
        if (flag == 0) {
          that.setData({
            sortSelected2: "所有在线工作订单"
          })
        } else if (flag == 1) {
          that.setData({
            sortSelected2: "我发布的"
          })
        } else if (flag == 2) {
          that.setData({
            sortSelected2: "我接取的"
          })
        }
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

  onOverallTag1: function(e) {
    this.setData({
      mask1Hidden: false,
      mask2Hidden: true,
      mask3Hidden: true,
      selected: e.currentTarget.dataset.index
    })
  },
  onOverallTag2: function(e) {
    this.setData({
      mask1Hidden: true,
      mask2Hidden: false,
      mask3Hidden: true,
      selected: e.currentTarget.dataset.index
    })
  },

})