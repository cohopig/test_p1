const app = getApp()
var util = require('../../../utils/util.js');
var common = require("../../../utils/common.js")

import {
  formatTime,
  countDown,
  clearTimeOut
} from '../../../utils/common';

Page({
  data: {
    pickerArray: ["代购", "代拿", "求助", "帮做", "信息发布"],
    ConditionArray: ["待审核", "待接单", "待完成", "待评价", '已评价', '已取消'],
    modalHidden: true,
    Customer: false,
    Server: false,
    hidden1: true,
    hidden2: true,
    hidden3: true,
    srcArray: ["../../images/PAOTUIDAIGOU.png", "../../images/YUNDONG.png", "../../images/DAISONGFUWU.png", "../../images/SOUSUOHAIWAI.png", "../../images/comment.png"],
    remainTime: null,
    hideCommon: false,
    hideCommon1: false,
    hideText: false,
    hideText2: false,
    flag30: false,
    flag03: false,
    complete: 1
  },
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
  onReady: function() {},
  onShow: function() {
    var that = this
    var Server_id = this.data.Server_id
    var Customer_id = this.data.Customer_id
    var client = this.data.client
    var Order_condition = this.data.Order_condition
    var Olyid = this.data.Olyid

    //根据订单类型读取接单人ID 从USER获取接单人信息载入页面
    if (client == 'Server' && Order_condition == 2) {
      console.log("Customer_id" + Customer_id)

      wx.request({
        url: "https://www.sridc.cn/RetrieveOrder/RetrieveUser_con.php",
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          Aid: Customer_id
        },
        success: function(res) {
          console.log(res.data)
          that.setData({
            User_num: res.data[0].User_num,
            AllGetOrdertimes: res.data[0].AllGetOrdertimes,
            AllPostOrdertimes: res.data[0].AllPostOrdertimes
          })
          console.log("User_num" + that.data.User_num)
        }
      })
    } else if (client == 'Customer' && Order_condition == 2) {
      console.log("Server_id" + Server_id)

      wx.request({
        url: "https://www.sridc.cn/RetrieveOrder/RetrieveUser_con.php",
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          Aid: Server_id
        },
        success: function(res) {
          console.log(res.data)
          that.setData({
            User_num: res.data[0].User_num,
            AllGetOrdertimes: res.data[0].AllGetOrdertimes,
            AllPostOrdertimes: res.data[0].AllPostOrdertimes
          })
          console.log("User_num" + that.data.User_num)
        }
      })
      console.log("Order_condition" + this.data.Order_condition === 2)

    }
    if (this.data.Order_condition == 2) {
      console.log("Order_condition" + this.data.Order_condition === 2)
      wx.request({
        url: "https://www.sridc.cn/RetrieveOrder/RetrieveTime.php",
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          Olyid: Olyid
        },
        success: function(res) {
          console.log("Take_time:" + res.data[0].Take_time)
          var time_Ordercheck = util.formatTime(new Date());
          var Take_time = res.data[0].Take_time
          var date1 = new Date(Take_time) //接单时间
          var date2 = new Date(time_Ordercheck) //当前时间
          var s1 = date1.getTime() + 1800 * 1000
          var s2 = date2.getTime()
          var total = (s1 - s2) / 1000;
          console.log("total" + total + "1total" + parseInt(total))
          var aa = parseInt(3)
          wx.hideLoading()
          that.setData({
            remainTime: total,
            clock: formatTime(total),
            hideText2: true,
            hideCommon1: true,
          })
          console.log("remainTime" + that.data.remainTime)

          that.common()
        },
        fail: function(res) {
          console.log(res.data)
          wx.showToast({
            title: '订单已被接取',
            image: '../../images/警告.png',
            duration: 2000,
            mask: true,
          })
        }
      })
    } else if (this.data.Order_condition == 3) {
      //未完成
      wx.request({
        url: "https://www.sridc.cn/RetrieveOrder/RetrieveTime.php",
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          Olyid: Olyid
        },
        success: function(res) {
          console.log("Take_time:" + res.data[0].Take_time)
          var date1 = new Date(res.data[0].Take_time) //接单时间
          var date2 = new Date(res.data[0].Complete_time) //完成时间
          var s1 = date1.getTime() + 1800 * 1000
          var s2 = date2.getTime()
          var total = (s1 - s2) / 1000;
          wx.hideLoading()
          that.setData({
            remainTime: total,
            clock: formatTime(total),
          })
        },
        fail: function(res) {
          console.log(res.data)
          wx.showToast({
            title: '获取订单内容失败',
            image: '../../images/警告.png',
            duration: 2000,
            mask: true,
          })
        }
      })
    }
  },
  common: function() {
    clearTimeOut();
    if (this.data.remainTime) {
      countDown(this)
    }
  },
  onHide: function() {},
  onUnload: function() {
    common.clearTimeOut()
  },
  onPullDownRefresh: function() {
    var that = this
    that.onShow();
    console.log("下拉刷新")
    wx.stopPullDownRefresh()
    console.log("下拉刷新结束")
  },
  onReachBottom: function() {},
  onShareAppMessage: function() {},
  PhoneCall: function() {
    wx.makePhoneCall({
      phoneNumber: this.data.Order_number
    })
    wx.vibrateShort({
      success: function() {
        console.log("震动")
      }
    })
    this.setData({
      color_number: '#f3ca7e'
    })
  },
  PhoneCall_User: function() {
    wx.makePhoneCall({
      phoneNumber: this.data.User_num
    })
    wx.vibrateShort({
      success: function() {
        console.log("震动")
      }
    })
    this.setData({
      color_number_User: '#f3ca7e'
    })
  },
  // t0_PayOrder: function() {
  //   console.log("订单付款")
  //   wx.navigateTo({
  //     url: '',
  //   })
  // },
  bindcancel1: function() {
    this.setData({
      hidden1: true
    })
    wx.vibrateShort({
      success: function() {
        console.log("震动")
      }
    })
  },
  bindcancel2: function() {
    this.setData({
      hidden2: true
    })
    wx.vibrateShort({
      success: function() {
        console.log("震动")
      }
    })
  },
  bindcancel3: function() {
    this.setData({
      hidden3: true
    })
    wx.vibrateShort({
      success: function() {
        console.log("震动")
      }
    })
  },
  cancel1: function() {
    this.setData({
      hidden1: false
    })
    wx.vibrateShort({
      success: function() {
        console.log("震动")
      }
    })
  },
  cancel2: function() {
    console.log(this.data.flag03 === true)
    if (this.data.flag03 === true) { //逻辑待补充
      wx.vibrateLong({
        success: function() {
          console.log("震动")
        }
      })
      wx.showModal({
        title: '提示',
        content: "接单时间超过三分钟,不可取消订单,若有疑问请联系客服", //取消订单将需向对方支付违约金
        showCancel: false,
        success(res) {
          if (res.confirm) {
            console.log('点击确认');
            wx.vibrateShort({
              success: function() {
                console.log("震动")
              }
            })
          }
        }
      })
    } else {
      this.setData({
        hidden2: false
      })
    }
  },
  cancel3: function() {
    this.setData({
      hidden3: false
    })
    wx.vibrateShort({
      success: function() {
        console.log("震动")
      }
    })
  },
  t0_PayOrderButtonTap: function() {
    this.setData({
      modalHidden: false
    })
    wx.vibrateShort({
      success: function() {
        console.log("震动")
      }
    })
    console.log("点击订单付款")
  },
  t0_PayOrderModalConfirm: function() {
    this.setData({
      modalHidden: true
    })
    wx.vibrateShort({
      success: function() {
        console.log("震动")
      }
    })
    console.log("订单付款-点击确认")
  },
  t0_UrgeOrder: function() {
    console.log("催审订单")
    wx.vibrateShort({
      success: function() {
        console.log("震动")
      }
    })
  },
  t0_CancelOrder: function() {
    console.log("取消订单（待审核）")
    console.log("Server_id:" + this.data.Server_id)
    var that = this
    var Olyid = this.data.Olyid;
    var Condition = '5';
    var OpenidStr = wx.getStorageSync('openidStr');
    var client = this.data.client;
    var time = util.formatTime(new Date());
    // 判断订单是否为首次发布的订单，若不是，则为被接单过的订单需要操作取消
    wx.showLoading({
      title: '提交中...',
      mask: true,
    })
    wx.request({
      url: "https://www.sridc.cn/Tseries_Interface/Tseries__CancelOrder.php",
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        Olyid: Olyid,
        Condition: Condition,
        flagType: client,
        time: time,
        flag: 0
      },
      success: function(res) {
        wx.hideLoading()
        console.log(res.data)
        console.log("订单取消（待审核）成功")
        wx.showToast({
          title: '订单取消成功',
          icon: 'success',
          duration: 6000,
          success: function() {
            wx.navigateBack({
              delta: 2
            })
            that.setData({
              hasOrder: false,
              Order_condition: Condition
            })
            console.log("返回上级页面")
            wx.vibrateShort({
              success: function() {
                console.log("震动")
              }
            })
          }
        })
        wx.vibrateShort({
          success: function() {
            console.log("震动")
          }
        })
      },
      fail: function(res) {
        console.log(res.data)
        wx.showToast({
          title: '订单已被接取',
          image: '../../images/警告.png',
          duration: 2000,
          mask: true,
        })
      }
    })
  },
  t1_AlterOrder: function() {
    console.log("修改订单内容")
    var that = this
    var Olyid = this.data.Olyid;
    // 判断订单是否为首次发布的订单，若不是，则为被接单过的订单需要操作取消
    if (this.data.Server_id == 'null' || this.data.Customer_id == 'null') {
      wx.showLoading({
        title: '提交中...',
        mask: true,
      })
      wx.request({
        url: "https://www.sridc.cn/Tseries_Interface/Tseries__CancelOrder.php",
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          Olyid: Olyid,
        },
        success: function(res) {
          wx.hideLoading()
          console.log(res.data)
          console.log("订单修改（待接单）成功" + "Olyid:" + Olyid + "Condition:" + Condition)
          that.setData({
            hasOrder: false,
            Order_condition: Condition
          })
          wx.vibrateShort({
            success: function() {
              console.log("震动")
            }
          })
        },
        fail: function(res) {
          console.log(res.data)
          wx.showToast({
            title: '订单已被接取',
            image: '../../images/警告.png',
            duration: 2000,
            mask: true,
          })
        }
      }) //判断订单为顾客单还是服务者单
    } else if (this.data.client == 'Customer') {
      wx.showLoading({
        title: '提交中...',
        mask: true,
      })
      wx.request({
        url: "https://www.sridc.cn/Tseries_Interface/Tseries__RepeatCancelOrder_Customer.php",
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          Olyid: Olyid,
        },
        success: function(res) {
          wx.hideLoading()
          console.log(res.data)
          console.log("Olyid:" + Olyid + "Condition:" + Condition + "OpenidStr" + OpenidStr)
          console.log("订单修改（待接单）成功（顾客待接单）")
          that.setData({
            hasOrder: false,
            Order_condition: Condition
          })
          wx.vibrateShort({
            success: function() {
              console.log("震动")
            }
          })
        },
        fail: function(res) {
          console.log(res.data)
          wx.showToast({
            title: '订单已被接取',
            image: '../../images/警告.png',
            duration: 2000,
            mask: true,
          })
        }
      })
    } else if (this.data.client == 'Server') {
      wx.showLoading({
        title: '提交中...',
        mask: true,
      })
      wx.request({
        url: "https://www.sridc.cn/Tseries_Interface/Tseries__RepeatCancelOrder_Server.php",
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          Olyid: Olyid,
          Condition: Condition,
          OpenidStr: OpenidStr_Cancel
        },
        success: function(res) {
          wx.hideLoading()
          console.log(res.data)
          console.log("Olyid:" + Olyid + "Condition:" + Condition + "OpenidStr" + OpenidStr)
          console.log("订单修改（待接单）成功（服务者待接单）")
          that.setData({
            hasOrder: false,
            Order_condition: Condition
          })
          wx.vibrateShort({
            success: function() {
              console.log("震动")
            }
          })
        },
        fail: function(res) {
          console.log(res.data)
          wx.showToast({
            title: '订单已被接取',
            image: '../../images/警告.png',
            duration: 2000,
            mask: true,
          })
        }
      })
    }

  },
  t1_PayUpOrder: function() {
    console.log("提高订单酬劳")
    var that = this
    var Olyid = this.data.Olyid;
    // 判断订单是否为首次发布的订单，若不是，则为被接单过的订单需要操作取消
    if (this.data.Server_id == 'null' || this.data.Customer_id == 'null') {
      wx.request({
        url: "https://www.sridc.cn/Tseries_Interface/Tseries__CancelOrder.php",
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          Olyid: Olyid,
        },
        success: function(res) {
          console.log(res.data)
          console.log("订单修改酬劳（待接单）成功" + "Olyid:" + Olyid)
          that.setData({
            hasOrder: false,
            Order_condition: Condition
          })
          wx.vibrateShort({
            success: function() {
              console.log("震动")
            }
          })
        },
        fail: function(res) {
          console.log(res.data)
          wx.showToast({
            title: '订单已被接取',
            image: '../../images/警告.png',
            duration: 2000,
            mask: true,
          })
        }
      }) //判断订单为顾客单还是服务者单
    } else if (this.data.client == 'Customer') {
      wx.request({
        url: "https://www.sridc.cn/Tseries_Interface/Tseries__RepeatCancelOrder_Customer.php",
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          Olyid: Olyid,
        },
        success: function(res) {
          console.log(res.data)
          console.log("订单修改酬劳（待接单）成功 （顾客" + "Olyid:" + Olyid)
          that.setData({
            hasOrder: false,
            Order_condition: Condition
          })
          wx.vibrateShort({
            success: function() {
              console.log("震动")
            }
          })
        },
        fail: function(res) {
          console.log(res.data)
          wx.showToast({
            title: '订单已被接取',
            image: '../../images/警告.png',
            duration: 2000,
            mask: true,
          })
        }
      })
    } else if (this.data.client == 'Server') {
      wx.request({
        url: "https://www.sridc.cn/Tseries_Interface/Tseries__RepeatCancelOrder_Server.php",
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          Olyid: Olyid,
        },
        success: function(res) {
          console.log(res.data)
          console.log("订单修改酬劳（待接单）成功 （服务" + "Olyid:" + Olyid)
          that.setData({
            hasOrder: false,
            Order_condition: Condition
          })
          wx.vibrateShort({
            success: function() {
              console.log("震动")
            }
          })
        },
        fail: function(res) {
          console.log(res.data)
          wx.showToast({
            title: '订单已被接取',
            image: '../../images/警告.png',
            duration: 2000,
            mask: true,
          })
        }
      })
    }
  },
  t1_CancelOrder: function() {
    console.log("取消订单（待接单）")
    var that = this
    var Olyid = this.data.Olyid;
    var Condition = '5';
    var client = this.data.client
    var OpenidStr = wx.getStorageSync('openidStr');
    var time = util.formatTime(new Date());

    // 判断订单是否为首次发布的订单，若不是，则为被接单过的订单需要操作取消
    wx.request({
      url: "https://www.sridc.cn/Tseries_Interface/Tseries__CancelOrder.php",
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        Olyid: Olyid,
        Condition: Condition,
        flagType: client,
        time: time,
        flag: 1
      },
      success: function(res) {
        console.log(res.data)
        console.log("待接订单取消")
        wx.showToast({
          title: '订单取消成功',
          icon: 'success',
          duration: 6000,
          success: function() {
            wx.navigateBack({
              delta: 2
            })
            that.setData({
              hasOrder: false,
              Order_condition: Condition
            })
            console.log("返回上级页面")
            wx.vibrateShort({
              success: function() {
                console.log("震动")
              }
            })
          }
        })
        wx.vibrateShort({
          success: function() {
            console.log("震动")
          }
        })
      },
      fail: function(res) {
        console.log(res.data)
        wx.showToast({
          title: '订单已被接取',
          image: '../../images/警告.png',
          duration: 2000,
          mask: true,
        })
      }
    }) //判断订单为顾客单还是服务者单 并执行退押金等操作
  },
  t2_CompleteOrder: function() {
    var that = this
    var Olyid = this.data.Olyid;
    var Condition = '3';
    var Customer_id = this.data.Customer_id;
    var Server_id = this.data.Server_id;
    var OpenidStr = wx.getStorageSync('openidStr');
    var itoplevel = ""

    var time = util.formatTime(new Date());
    console.log("time" + time)
    if (!(Customer_id == OpenidStr)) {
      wx.showModal({
        title: '提示',
        content: "您无权限完成订单，请告知您的顾客点击完成",
        showCancel: false,
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../../index2/index2'
            })
            console.log('发生跳转事件');
          }
        }
      })
      wx.vibrateLong({
        success: function() {
          console.log("震动")
        }
      })
    }
    //是否需要双方共同确认再将订单状态变为待评价,
    else if (this.data.client == 'Customer') {
      wx.showLoading({
        title: '提交中...',
        mask: true,
      })
      console.log("确认完成订单")
      wx.request({
        url: "https://www.sridc.cn/Tseries_Interface/Tseries_Complete.php",
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          Olyid: Olyid,
          Condition: Condition,
          OpenidStr: OpenidStr,
          Server_id: Server_id,
          Complete_time: time,
          itoplevel: 0
        },
        success: function(res) {
          wx.hideLoading()
          console.log(res.data)
          that.setData({
            hasOrder: false,
            Order_condition: Condition,
            complete: 0
          })
          if (that.data.flag30 === true) { //逻辑待补充
            var clockTime = that.data.clock
            console.log("clock" + clockTime)
            wx.showModal({
              content: '订单超过规定完成时间（30min），平台将无法增加积分，如有疑问请携订单号联系客服',
              image: '../../images/frown.png',
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  wx.navigateBack({
                    delta: 2
                  })
                  console.log('发生跳转事件');
                }
                wx.vibrateShort({
                  success: function() {
                    console.log("震动")
                  }
                })
              }
            })
          } else {
            wx.showLoading({
              title: '提交中...',
              mask: true,
            })
            wx.request({
              url: 'https://www.sridc.cn/updataOrderData/updataOrderData_UpIntegral.php',
              method: "POST",
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              data: {
                User_id: Server_id,
              },
              success: function(res) {
                wx.hideLoading()
                console.log(res.data)
                that.setData({})
              }
            })
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
            title: '订单已被接取',
            image: '../../images/警告.png',
            duration: 2000,
            mask: true,
          })
        }
      })
    } else if (this.data.client == 'Server') {
      wx.showLoading({
        title: '提交中...',
        mask: true,
      })
      wx.request({
        url: "https://www.sridc.cn/Tseries_Interface/Tseries_Complete.php",
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          Olyid: Olyid,
          Condition: Condition,
          OpenidStr: Customer_id,
          Complete_time: time,
          itoplevel: 0
        },
        success: function(res) {
          wx.hideLoading()
          console.log(res.data)
          that.setData({
            hasOrder: false,
            Order_condition: Condition,
            complete: 0
          })

          if (that.data.flag30 === true) { //逻辑待补充
            wx.showModal({
              content: '订单超过规定完成时间（30min），平台将无法增加积分，如有疑问请携订单号联系客服',
              image: '../../images/frown.png',
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  wx.navigateBack({
                    delta: 2
                  })
                  console.log('发生跳转事件');
                }
                wx.vibrateShort({
                  success: function() {
                    console.log("震动")
                  }
                })
              }
            })
          } else {
            wx.showLoading({
              title: '提交中...',
              mask: true,
            })
            wx.request({
              url: 'https://www.sridc.cn/updataOrderData/updataOrderData_UpIntegral.php',
              method: "POST",
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              data: {
                User_id: Server_id,
              },
              success: function(res) {
                wx.hideLoading()
                console.log(res.data)
                that.setData({})
              }
            })
          }
        },
        fail: function(res) {
          console.log(res.data)
          wx.showToast({
            title: '订单已被接取',
            image: '../../images/警告.png',
            duration: 2000,
            mask: true,
          })
        }
      })
    }
  },
  t2_CancelOrder: function() {
    console.log("取消订单（待完成）")
    var that = this
    var Olyid = this.data.Olyid;
    var Condition = '1';
    var OpenidStr = wx.getStorageSync('openidStr');
    var itoplevel = ""

    //判断订单为顾客单，并判断执行操作为服务者，则状态退回（待接单）'1'
    //待完成订单由顾客发起 由顾客取消，则根据预定规则对顾客进行操作（退款）
    if (this.data.client == 'Customer' && this.data.Customer_id == OpenidStr) {
      wx.request({
        url: "https://www.sridc.cn/Tseries_Interface/Tseries__RepeatCancelOrder_Customer.php",
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          Olyid: Olyid,
          Condition: Condition,
          OpenidStr: OpenidStr,
          itoplevel: 2
        },
        success: function(res) {
          console.log(res.data)
          console.log("Olyid:" + Olyid + "Condition:" + Condition + "OpenidStr" + OpenidStr)
          console.log("待完成订单由顾客发起 由顾客取消，则根据预定规则对顾客进行操作（退款）")
          wx.showToast({
            title: '订单取消成功',
            icon: 'success',
            duration: 6000,
            success: function() {
              wx.navigateBack({
                delta: 2
              })
              that.setData({
                hasOrder: false,
                Order_condition: Condition,
              })
              console.log("返回上级页面")
              wx.vibrateShort({
                success: function() {
                  console.log("震动")
                }
              })
            }
          })
          wx.vibrateShort({
            success: function() {
              console.log("震动")
            }
          })
        },
        fail: function(res) {
          console.log(res.data)
          wx.showToast({
            title: '订单已被接取',
            image: '../../images/警告.png',
            duration: 2000,
            mask: true,
          })
        }
      })
      //待完成订单由顾客发起 由服务者取消，则根据预定规则对服务者进行操作
    } else if (this.data.client == 'Customer' && this.data.Customer_id !== OpenidStr) {
      wx.request({
        url: "https://www.sridc.cn/Tseries_Interface/Tseries__RepeatCancelOrder_Customer.php",
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          Olyid: Olyid,
          Condition: Condition,
          OpenidStr: OpenidStr,
          itoplevel: 2
        },
        success: function(res) {
          console.log(res.data)
          console.log("Olyid:" + Olyid + "Condition:" + Condition + "OpenidStr" + OpenidStr)
          console.log("待完成订单由顾客发起 由服务者取消，则根据预定规则对服务者进行操作")
          wx.showToast({
            title: '订单取消成功',
            icon: 'success',
            duration: 6000,
            success: function() {
              wx.navigateBack({
                delta: 2
              })
              that.setData({
                hasOrder: false,
                Order_condition: Condition,
              })
              console.log("返回上级页面")
              wx.vibrateShort({
                success: function() {
                  console.log("震动")
                }
              })
            }
          })
          wx.vibrateShort({
            success: function() {
              console.log("震动")
            }
          })
        },
        fail: function(res) {
          console.log(res.data)
          wx.showToast({
            title: '订单已被接取',
            image: '../../images/警告.png',
            duration: 2000,
            mask: true,
          })
        }
      })
      //待完成订单由服务者发起 由服务者取消，则根据预定规则对服务者进行操作
    } else if (this.data.client == 'Server' && this.data.Server_id == OpenidStr) {
      wx.request({
        url: "https://www.sridc.cn/Tseries_Interface/Tseries__RepeatCancelOrder_Server.php",
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          Olyid: Olyid,
          Condition: Condition,
          OpenidStr: OpenidStr,
          itoplevel: 2
        },
        success: function(res) {
          console.log(res.data)
          console.log("Olyid:" + Olyid + "Condition:" + Condition + "OpenidStr" + OpenidStr)
          console.log("待完成订单由服务者发起 由服务者取消，则根据预定规则对服务者进行操作")
          wx.showToast({
            title: '订单取消成功',
            icon: 'success',
            duration: 6000,
            success: function() {
              wx.navigateBack({
                delta: 2
              })
              that.setData({
                hasOrder: false,
                Order_condition: Condition,
              })
              console.log("返回上级页面")
              wx.vibrateShort({
                success: function() {
                  console.log("震动")
                }
              })
            }
          })
          wx.vibrateShort({
            success: function() {
              console.log("震动")
            }
          })
        },
        fail: function(res) {
          console.log(res.data)
          wx.showToast({
            title: '订单已被接取',
            image: '../../images/警告.png',
            duration: 2000,
            mask: true,
          })
        }
      })
      //待完成订单由服务者发起 由顾客取消，则根据预定规则对顾客进行操作
    } else if (this.data.client == 'Server' && this.data.Server_id !== OpenidStr) {
      wx.request({
        url: "https://www.sridc.cn/Tseries_Interface/Tseries__RepeatCancelOrder_Server.php",
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          Olyid: Olyid,
          Condition: Condition,
          OpenidStr: OpenidStr,
          itoplevel: 2
        },
        success: function(res) {
          console.log(res.data)
          console.log("Olyid:" + Olyid + "Condition:" + Condition + "OpenidStr" + OpenidStr)
          console.log("待完成订单由服务者发起 由服务者取消，则根据预定规则对服务者进行操作")
          wx.showToast({
            title: '订单取消成功',
            icon: 'success',
            duration: 6000,
            success: function() {
              wx.navigateBack({
                delta: 2
              })
              that.setData({
                hasOrder: false,
                Order_condition: Condition,
              })
              console.log("返回上级页面")
              wx.vibrateShort({
                success: function() {
                  console.log("震动")
                }
              })
            }
          })
          wx.vibrateShort({
            success: function() {
              console.log("震动")
            }
          })
        },
        fail: function(res) {
          console.log(res.data)
          wx.showToast({
            title: '订单已被接取',
            image: '../../images/警告.png',
            duration: 2000,
            mask: true,
          })
        }
      })
    }
  },
  t3_EvaOrder: function(a) {
    console.log("评价订单")
    wx.navigateTo({
      url: '../../order/ordered/or?Order_type=' + this.data.Order_type +
        '&create_time=' + this.data.create_time +
        '&Order_content=' + this.data.Order_content +
        '&Order_notes=' + this.data.Order_notes +
        '&Order_Add=' + this.data.Order_Add +
        '&Order_name=' + this.data.Order_name +
        '&Order_number=' + this.data.Order_number +
        '&Order_mon1a=' + this.data.Order_mon1a +
        '&Order_mon2a=' + this.data.Order_mon2a +
        '&Wechat=' + this.data.Wechat +
        '&Olyid=' + this.data.Olyid +
        '&Order_condition=' + this.data.Order_condition +
        '&Customer_id=' + this.data.Customer_id +
        '&Server_id=' + this.data.Server_id +
        '&client=' + this.data.client +
        '&Take_time=' + this.data.Take_time +
        '&Complete_time=' + this.data.Complete_time

    })
  },
  onPullDownRefresh: function() {
    var that = this
    that.onShow();
    console.log("下拉刷新")
    wx.stopPullDownRefresh()
    console.log("下拉刷新结束")
  }
})