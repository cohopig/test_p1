var app = getApp();
Page({
  data: {
    list: {
      status: false, //是否显示列表
      count: 0, //次数
      data: [], //列表内容
      open: 0 //被展示的序号
    }
  },
  openList: function() {
    var that = this;
    if (!that.data.list.status) {
      that.setData({
        'list.status': true
      });
    } else {
      that.setData({
        'list.status': false
      });
    }
  },
  formSubmit: function(e) {
    var warn = "";
    var flag = true;
    if (e.detail.value.Title == "") {
      wx.showModal({
        title: '提示',
        content: "请填写反馈标题",
        showCancel: false
      });
    } else if (!(/^[0-9a-zA-Z\u4e00-\u9fa5]+$/.test(e.detail.value.Title))) {
      wx.showModal({
        title: '提示',
        content: "请勿带有特殊符号",
        showCancel: false
      });
    } else if (e.detail.value.Content == "") {
      wx.showModal({
        title: '提示',
        content: "请填写反馈内容",
        showCancel: false
      });
    } else if (!(/^[0-9a-zA-Z\u4e00-\u9fa5]+$/.test(e.detail.value.Content))) {
      wx.showModal({
        title: '提示',
        content: "请勿带有特殊符号",
        showCancel: false
      });
    } else {
      flag = false;
      wx.showLoading({
        title: '正在请求服务器...',
        mask: true,
      })
      var that = this;
      var OpenidStr = wx.getStorageSync('openidStr');
      wx.request({
        url: "https://www.sridc.cn/StorageOrderData/ProblemofFeedback.php",
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          Title: e.detail.value.Title,
          Content: e.detail.value.Content,
          OpenidStr: OpenidStr,
        },
        success: function(res) {
          wx.hideLoading()
          that.setData({
            'list.count': that.data.list.count++
          });
          wx.showModal({
            title: '提交成功',
            content: '您的反馈将被尽快处理！',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 2
                })
              }
              wx.vibrateShort({
                success: function() {
                  console.log("震动")
                }
              })
            }
          });
          console.log("回调：" + res.data)
          console.log(e.detail.value.Title)
          console.log(e.detail.value.Content)
          console.log(OpenidStr)
        },
        fail: function(res) {
          console.log(res.data)
          wx.showModal({
            title: '提交失败',
            content: '用户信息无效！',
          })
          wx.vibrateLong({
            success: function() {
              console.log("震动")
            }
          })
        }
      })
    }
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function() {
    // 页面渲染完成
  },
  onShow: function() {
    // 页面显示
  },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  }
})