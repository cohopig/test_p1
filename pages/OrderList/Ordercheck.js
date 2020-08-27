const app = getApp()
var util = require('../../utils/util.js');
var common = require("../../utils/common.js")
import {
  formatTime,
  countDown,
  clearTimeOut
} from '../../utils/common';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasOrder: false,
    pickerArray: ["代购", "代拿", "求助", "帮做", "信息发布"],
    ConditionArray: ["待审核", "待接单", "待完成", "待评价", '已评价'],
    second: 180,
    hasSecond: true,
    hidden: true,
    hidden2: true,
    srcArray: ["../../images/PAOTUIDAIGOU.png", "../../images/YUNDONG.png", "../../images/DAISONGFUWU.png", "../../images/SOUSUOHAIWAI.png", "../../images/comment.png"],
    nocancel: false,
    remainTime: null,
    hideCommon: false,
    hideCommon1: false,
    hideText: false,
    hideText2: false,
    flag03: false,
  },
  PhoneCall: function() {
    wx.makePhoneCall({
      phoneNumber: this.data.Order_number
    })
    this.setData({
      color_number: '#f3ca7e'
    })
  },

  countdown: function() {
    //无法确保数据周期，推荐使用数据库进行判断
    var that = this
    var second = this.data.second
    if (second == 0) {
      wx.request({
        url: "https://www.sridc.cn/updataOrderData/Updata_OrderCancelCondition.php",
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          Olyid: Olyid,
        },
        success: function(res) {
          console.log(res.data)
          that.setData({
            second: 180,
            hasSecond: false,
            CancelTime: false,
            hasSecond: false
          })
        }
      })
      return
    }
    var time = setTimeout(function() {
      // that.countdown(that) 递归使用
      that.setData({
        second: second - 1
      })
      that.countdown(that)
    }, 1000)
  },
  onLoad: function(options) {
    //var that=this,
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
      itoplevel: options.itoplevel
    })

  },
  onReady: function() {

  },
  onShow: function() {
    clearTimeOut();
    if (this.data.remainTime) {
      countDown(this)
    }
  },
  onHide: function() {

  },
  onUnload: function() {
    common.clearTimeOut()
  },
  onPullDownRefresh: function() {
    var that = this
    wx.setNavigationBarTitle({
      title: '刷新中'
    })
    wx.showNavigationBarLoading(); //在当前页面显示导航条加载动画。
    that.onShow();
    console.log("下拉刷新")
    wx.hideNavigationBarLoading(); //隐藏导航条加载动画。
    wx.stopPullDownRefresh()
    console.log("下拉刷新结束")
    wx.setNavigationBarTitle({
      title: '星球科技'
    }) //动态设置当前页面的标题
  },
  onReachBottom: function() {

  },
  onShareAppMessage: function() {},

  // judgeType: function() {
  //   var client = this.data.client;
  //   console.log("client：" + client)
  //   var that = this;
  //   if (client == 'Customer') {
  //     that.okOrder();
  //     console.log("判断为Customer")
  //   } else if (client == 'Server') {
  //     that.okOrder_Server();
  //     console.log("判断为Serer")
  //   }
  // },

  okOrder: function() {
    const UserRoot = wx.getStorageSync('UserRoot')
    var that = this;
    var Condition = '2'
    var Olyid = this.data.Olyid;
    var OpenidStr = wx.getStorageSync('openidStr');
    var Customer_id = this.data.Customer_id;
    var Server_id = this.data.Server_id;
    var client = this.data.client;
    var Order_mon2a = this.data.Order_mon2a;
    var time = util.formatTime(new Date());
    var itoplevel = this.data.itoplevel;
    var Ordertimes = wx.getStorageSync('Ordertimes');
    console.log('time' + time);
    wx.request({
      url: "https://www.sridc.cn/RetrieveOrder/checkOrderStatus.php",
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        Olyid: Olyid,
        client: client
      },
      success: function(res) {
        console.log(res.data)
        console.log(res.data[0].Order_condition)
        var Checkflag = res.data[0].Order_condition
        //Checkflag==Order_condition
        console.log(Checkflag == 1)
        console.log(Checkflag)
        //验证订单的最新状态，考虑极端情况
        if (Checkflag == 1) {
          if (UserRoot == null) {
            wx.navigateTo({
              url: '../Usercontent/Usercontent'
            })
            console.log('发生跳转事件');
          } else if (UserRoot !== "RootYES") {
            wx.vibrateLong({
              success: function() {
                console.log("震动")
              }
            })
            wx.showModal({
              title: '提示',
              content: "您未拥有接单权限，请联系客服按流程办理登记，即可开通接单权限",
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '../index2/index2'
                  })
                  that.setData({
                    hidden2: true,
                  })
                  console.log('发生跳转事件');
                }
              }
            }) //1订单必空一个ID 从而执行本判断
          } else if (Customer_id == OpenidStr || Server_id == OpenidStr) {
            wx.showModal({
              title: '提示',
              content: "平台不允许接取自己发布的订单",
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  that.setData({
                    hidden2: true,
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
          } else if (!(Ordertimes < 4)) {
            wx.showModal({
              title: '提示',
              content: "为确保效率问题,平台最多可同时接取四单,请完成当前所接取的订单",
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  wx.navigateBack({
                    delta: 2
                  })
                  that.setData({
                    hidden2: true,
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
          } else if (that.data.client == 'Customer') {
            //类型是Customer 则此时是接单员在进行该操作
            wx.showLoading({
              title: '正在请求服务器...',
              mask: true,
            })
            wx.request({
              url: "https://www.sridc.cn/updataOrderData/Updata_OrderCondition_Customer.php",
              method: "POST",
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              data: {
                Take_time: time,
                Olyid: Olyid,
                Condition: Condition,
                OpenidStr: OpenidStr,
                Customer_id: Customer_id,
                itoplevel: ++itoplevel
              },
              success: function(res) {
                console.log(res.data)
                console.log(Customer_id)
                console.log("Olyid:" + Olyid + "Condition:" + Condition)
                that.setData({
                  Take_time: time,
                  hasOrder: true,
                  Order_condition: 2,
                  hidden2: true,
                })
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

                    that.onShow()
                  }
                })
                wx.vibrateShort({
                  success: function() {
                    console.log("震动")
                  }
                })
                // that.countdown(that)
                //服务单的时间需要重新考量
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
          } else if (that.data.client == 'Server') {
            wx.showLoading({
              title: '正在请求服务器...',
              mask: true,
            })
            wx.request({
              url: 'https://www.sridc.cn/Pay_/Pay_index.php', //改成你自己的链接
              data: {
                openid: OpenidStr,
                total_fee: Order_mon2a,
                body: "Server订单接取-微信支付"
              },
              method: 'GET',
              success: function(res) {
                console.log(res.data);
                console.log('调起支付');
                wx.requestPayment({
                  'timeStamp': res.data.timeStamp,
                  'nonceStr': res.data.nonceStr,
                  'package': res.data.package,
                  'signType': res.data.signType,
                  'paySign': res.data.paySign,
                  'success': function(res) {
                    console.log('success');
                    console.log(res);
                    wx.showToast({
                      title: '支付成功',
                      icon: 'success',
                      duration: 3000
                    });
                    wx.request({
                      url: "https://www.sridc.cn/updataOrderData/Updata_OrderCondition_Server.php",
                      method: "POST",
                      header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                      },
                      data: {
                        Take_time: time,
                        Olyid: Olyid,
                        Condition: Condition,
                        OpenidStr: OpenidStr,
                        Server_id: Server_id,
                        itoplevel: ++itoplevel
                      },
                      success: function(res) {
                        wx.hideLoading()
                        console.log(res.data)
                        console.log("我是sERVER" + Server_id)
                        console.log("Olyid:" + Olyid + "Condition:" + Condition)
                        that.setData({
                          Take_time: time,
                          hasOrder: true,
                          Order_condition: 2,
                          hidden2: true,
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
                          title: '請求失敗,请刷新后重试',
                          icon: 'fail',
                          duration: 2000,
                          mask: true,
                        })
                      }
                    })
                  },
                  'fail': function(res) {
                    wx.hideLoading()
                    console.log('fail');
                    console.log(res)
                    wx.showModal({
                      title: '提示',
                      content: "请预支付订单，以便更好完成服务。",
                      showCancel: false,
                      success(res) {
                        console.log(res)
                      }
                    })
                  },
                  'complete': function(res) {
                    wx.hideLoading()
                    console.log('complete');
                    console.log(res)
                    console.debug(res)
                    console.info(res)
                  }
                });
              },
              fail: function(res) {
                console.log(res)
              }
            });
          } else {
            wx.hideLoading()
            wx.showModal({
              title: '提示',
              content: "数据出错，请稍后重试",
              showCancel: false,
              success(res) {
                console.log(res)
              }
            })
          }
          //checkflag(Order_condition)不等于1，即有人接单 
        } else {
          wx.showToast({
            title: '订单已被接取',
            image: '../../images/警告.png',
            duration: 2000,
            mask: true,
          })
          that.setData({
            hidden2: true,
          })
        }
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
  },
  bindcancel: function() {
    this.setData({
      hidden: true
    })
  },
  bindcancel2: function() {
    this.setData({
      hidden2: true
    })
  },
  cancel: function() {
    // var time = util.formatTime(new Date());
    // var Take_time = this.data.Take_time
    // var date1 = new Date(Take_time) //接单时间
    // var date2 = new Date(time) //当前时间
    // var s1 = date1.getTime()
    // var s2 = date2.getTime()
    // var total = (s2 - s1) / 1000;
    // //计算整数天数
    // var day = parseInt(total / (24 * 60 * 60));
    // //取得算出天数后剩余的秒数
    // var afterDay = total - day * 24 * 60 * 60;
    // //计算整数小时数
    // var hour = parseInt(afterDay / (60 * 60));
    // //取得算出小时数后剩余的秒数
    // var afterHour = total - day * 24 * 60 * 60 - hour * 60 * 60;
    // //计算整数分
    // var min = parseInt(afterHour / 60);
    // //取得算出分后剩余的秒数
    // var afterMin = total - day * 24 * 60 * 60 - hour * 60 * 60 - min * 60;
    // console.log("差距" + min + ":" + afterMin)
    // console.log("当前时间time" + time)
    // console.log("接单时间Take_time" + Take_time)
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
    } else {
      this.setData({
        hidden: false
      })
    }
  },
  ok: function() {
    this.setData({
      hidden2: false
    })
    wx.vibrateShort({
      success: function() {
        console.log("震动")
      }
    })
  },

  CancelOrder: function() {
    var that = this
    var Olyid = this.data.Olyid;
    var Condition = '1';
    var OpenidStr = wx.getStorageSync('openidStr');
    var client = this.data.client;
    var Customer_id = this.data.Customer_id;
    var Server_id = this.data.Server_id;
    // var time = "Cancel";
    var itoplevel = "";
    console.log(client == 'Customer');
    console.log(client == 'Server');
    //本页面只存在接单人 因此只需要判断订单类型。顾客无法在此页面取消订单
    //在这里不可以接自己的单 所以直接可以确定是谁执行取消操作，即本OpenidStr执行，那么OpenidStr接单加1，则取消减1，函数里直接绑定着OpenidStr进行操作 因此无需过多的判断
    if (this.data.client == 'Customer') {
      wx.showLoading({
        title: '正在请求服务器...',
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
          Condition: Condition,
          OpenidStr: OpenidStr,
          Customer_id: Customer_id,
          itoplevel: 2
        },
        success: function(res) {
          wx.hideLoading()
          console.log(res.data)
          console.log(Customer_id)
          console.log(Server_id)
          console.log("Customer Olyid:" + Olyid + "Condition:" + Condition)
          wx.navigateBack({
            delta: 2
          })
          that.setData({
            hasOrder: false,
            Order_condition: 1,
            hidden: true,
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
            title: '請求失敗,请刷新后重试',
            icon: 'fail',
            duration: 2000,
            mask: true,
          })
        }
      })
    } else if (this.data.client == 'Server') {
      wx.showLoading({
        title: '正在请求服务器...',
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
          OpenidStr: OpenidStr,
          Server_id: Server_id,
          itoplevel: 2
        },
        success: function(res) {
          wx.hideLoading()
          console.log(res.data)
          console.log(Server_id)
          console.log("Server Olyid:" + Olyid + "Condition:" + Condition)
          wx.navigateBack({
            delta: 2
          })
          that.setData({
            hasOrder: false,
            Order_condition: 1,
            hidden: true,
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
            title: '請求失敗,请刷新后重试',
            icon: 'fail',
            duration: 2000,
            mask: true,
          })
        }
      })
    }
  }
})