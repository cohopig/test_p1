Page({

  data: {
    valueinputnumber: 2,
    pickerArray: ["代购", "代拿", "求助", "帮做", "信息发布"],
    pickernum: 0,
    type: '1',
    src: "../../images/PAOTUIDAIGOU.png",
    src0: "../../images/PAOTUIDAIGOU.png",
    src1: "../../images/YUNDONG.png",
    src2: "../../images/DAISONGFUWU.png",
    src3: "../../images/SOUSUOHAIWAI.png",
    src4: "../../images/comment.png",
    i_1: "请填写订单信息",
    i_1_1: "订单内容",
    i_1_1_1: "订单内容",
    i_1_2: "订单备注",
    i_1_2_1: "选填",
    i_2: "请填写收件信息",
    i_2_1: "收货人",
    i_2_1_1: "名字",
    i_2_2: "wechat",
    i_2_2_1: "微信将用于进行订单审核（此栏将进行加密处理 tt将协助您共同维护隐私！）",
    i_2_3: "联系电话",
    i_2_3_1: "请输入手机号",
    i_2_4: "详细地址",
    i_2_4_1: "请输入详细地址(最多50字)",
    i_3: "订单价格",
    i_3_1: "订单总额",
    i_3_1_1: "仅包含商品金额，若不确定，可不填",
    i_4: "您付给跑手的酬劳",
    objectArray: [{
        id: 0,
        name: '代购'
      },
      {
        id: 1,
        name: '代拿'
      },
      {
        id: 2,
        name: '代送'
      }, {
        id: 3,
        name: '帮做'
      },
    ],

    onGotUserInfo: function(e) {
      console.log(e.detail.errMsg)
      console.log(e.detail.userInfo)
      console.log(e.detail.rawData)
    }
  },
  handleChange1: function(e) {
    this.setData({
      valueinputnumber: e.detail.value
    })
    console.log(e.detail.value)

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var Add = wx.getStorageSync('Add');
    var nam = wx.getStorageSync('nam');
    var num = wx.getStorageSync('num');
    var Wechat = wx.getStorageSync('Wechat');
    this.setData({
      Add: Add,
      nam: nam,
      num: num,
      Wechat: Wechat
    })
    console.log(Add + nam + num + Wechat)
    let that = this;
    let query = wx.createSelectorQuery().in(this)
    const OpenidStr = wx.getStorageSync('openidStr');
    var Condition = '1'
    //根据节点id查询节点部分的高度（px单位）
    // query.select('.header-title').boundingClientRect();
    query.exec((res) => {
      // 分别取出节点的高度
      // let aHeight = res[0].height;
      // let cHeight = res[2].height; 
      // console.log(cHeight) 值为0
      // 然后窗口高度（wx.getSystemInfoSync().windowHeight）减去其他不滑动界面的高度
      let scrollViewHeight = wx.getSystemInfoSync().windowHeight - 30;
      console.log(scrollViewHeight)
      // 算出来之后存到data对象里面
      that.setData({
        scrollHeight: scrollViewHeight,
      });
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  stripscript: function(s) {
    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
    var rs = "";
    for (var i = 0; i < s.length; i++) {
      rs = rs + s.substr(i, 1).replace(pattern, '');
    }
    return rs;
    console.log(rs)
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

  },
  formSubmit: function(e) {
    // this.stripscript()
    var warn = ""; //弹框时提示的内容
    var flag = true; //判断信息输入是否完整 !(/^[0-9a-zA-Z\u4e00-\u9fa5]+$/.test(e.detail.value.i_1_2))
    //判断的顺序依次是：姓名-手机号-地址-具体地址-预约日期-预约时间-开荒面积 [a-zA-Z\d\u4e00-\u9fa5]
    if (e.detail.value.i_1_1 == "") {
      warn = "请填写您的" + this.data.i_1_1;
    } else if (!(/^[0-9a-zA-Z\u4e00-\u9fa5\,\.\，\。\!\ \!\?\?]+$/.test(e.detail.value.i_1_1))) {
      warn = this.data.i_1_1 + "请勿带有特殊符号"
    } else if (e.detail.value.i_2_1 === "") {
      warn = "请选择您的" + this.data.i_2_1
    } else if (!(/^[0-9a-zA-Z\u4e00-\u9fa5\,\.\，\。\!\ \!]+$/.test(e.detail.value.i_2_1))) {
      warn = this.data.i_2_1 + "请勿带有特殊符号"
    } else if (e.detail.value.i_2_2 === "") {
      warn = "请选择您的" + this.data.i_2_2
    } else if (!(/^[0-9a-zA-Z\u4e00-\u9fa5\,\.\，\。\!\ \!]+$/.test(e.detail.value.i_2_2))) {
      warn = this.data.i_2_2 + "请勿带有特殊符号"
    } else if (e.detail.value.i_2_3 === "") {
      warn = "请填写您的！" + this.data.i_2_3;
    } else if (!(/^1(3|4|5|7|8)\d{9}$/.test(e.detail.value.i_2_3))) {
      warn = "手机号格式不正确";
    } else if (e.detail.value.i_2_4 === "") {
      warn = "请选择您的" + this.data.i_2_4
    } else if (!(/^[0-9a-zA-Z\u4e00-\u9fa5\,\.\，\。\!\ \!]+$/.test(e.detail.value.i_2_4))) {
      warn = this.data.i_2_4 + "请勿带有特殊符号"
    } else {
      console.log("0")

      if (!(e.detail.value.i_1_2 === "")) {
        console.log("1")
        if ((!(/^[0-9a-zA-Z\u4e00-\u9fa5\,\.\，\。\!\ \!]+$/.test(e.detail.value.i_1_2)))) {
          warn = this.data.i_1_2 + "请勿带有特殊符号"
        } else {
          console.log("2")

          if (!(e.detail.value.i_3_1 === "")) {
            console.log("3")
            if ((!(/^[0-9]+$/.test(e.detail.value.i_3_1)))) {
              warn = this.data.i_3_1 + "请填写正确金额"
            } else {
              console.log("4")
              flag = false; //若必要信息都填写，则不用弹框，且页面可以进行跳转
              var that = this;
              //？后面跟的是需要传递到下一个页面的参数
              wx.navigateTo({
                url: '../postorder/confirmForest?pickernum=' + e.detail.value.pickernum + '&i_1_1=' + e.detail.value.i_1_1 + '&i_1_2=' + e.detail.value.i_1_2 + '&i_2_1=' + e.detail.value.i_2_1 + '&i_2_2=' + e.detail.value.i_2_2 + '&i_2_3=' + e.detail.value.i_2_3 + '&i_2_4=' + e.detail.value.i_2_4 + '&i_3_1=' + e.detail.value.i_3_1 + '&i_4_1=' + this.data.valueinputnumber
              }) /** "&addre=" + that.data.addreRange[e.detail.value.addre]*/
              console.log('form发生了submit事件，携带数据为：', e.detail.value);
            }
          } else {
            console.log("4")
            flag = false; //若必要信息都填写，则不用弹框，且页面可以进行跳转
            var that = this;
            //？后面跟的是需要传递到下一个页面的参数
            wx.navigateTo({
              url: '../postorder/confirmForest?pickernum=' + e.detail.value.pickernum + '&i_1_1=' + e.detail.value.i_1_1 + '&i_1_2=' + e.detail.value.i_1_2 + '&i_2_1=' + e.detail.value.i_2_1 + '&i_2_2=' + e.detail.value.i_2_2 + '&i_2_3=' + e.detail.value.i_2_3 + '&i_2_4=' + e.detail.value.i_2_4 + '&i_3_1=' + e.detail.value.i_3_1 + '&i_4_1=' + this.data.valueinputnumber
            }) /** "&addre=" + that.data.addreRange[e.detail.value.addre]*/
            console.log('form发生了submit事件，携带数据为：', e.detail.value);
          }
        }
      } else {
        console.log("4")
        flag = false; //若必要信息都填写，则不用弹框，且页面可以进行跳转
        var that = this;
        //？后面跟的是需要传递到下一个页面的参数
        wx.navigateTo({
          url: '../postorder/confirmForest?pickernum=' + e.detail.value.pickernum + '&i_1_1=' + e.detail.value.i_1_1 + '&i_1_2=' + e.detail.value.i_1_2 + '&i_2_1=' + e.detail.value.i_2_1 + '&i_2_2=' + e.detail.value.i_2_2 + '&i_2_3=' + e.detail.value.i_2_3 + '&i_2_4=' + e.detail.value.i_2_4 + '&i_3_1=' + e.detail.value.i_3_1 + '&i_4_1=' + this.data.valueinputnumber
        }) /** "&addre=" + that.data.addreRange[e.detail.value.addre]*/
        console.log('form发生了submit事件，携带数据为：', e.detail.value);
      }
    }
    //如果信息填写不完整，弹出输入框
    if (flag == true) {
      wx.showToast({
        title: warn,
        icon: "none",
        duration: 2000
      })
      wx.vibrateShort({
        success: function() {
          console.log("震动")
        }
      })
    }
  },

  bindPickerChange: function(e) {
    if (e.detail.value == 0) {
      wx.showModal({
        title: '提示',
        content: "当前为代购类型，请在下单前仔细阅读<使用条款>！",
        showCancel: false,
      })
      this.setData({
        src: this.data.src0,
        pickernum: e.detail.value,
        i_1: "请填写订单内容",
        i_1_1: "订单内容",
        i_1_1_1: "订单内容",
        i_1_2: "订单备注",
        i_1_2_1: "选填",
        i_2: "请填写收件信息",
        i_2_1: "收件人",
        i_2_1_1: "名字",
        i_2_2: "wechat",
        i_2_2_1: "微信将用于进行订单审核（此栏将进行加密处理 tt将协助您共同维护隐私！）",
        i_2_3: "联系电话",
        i_2_3_1: "请输入手机号",
        i_2_4: "详细地址",
        i_2_4_1: "请输入详细地址(最多50字)",
        i_3: "订单价格",
        i_3_1: "订单总额",
        i_3_1_1: "仅包含商品金额，若不确定，可不填",
        i_4: "您付给跑手的酬劳",
        valueinputnumber: 2,
        type: '1'
      })
      console.log('picker发送选择改变，携带值为', e.detail.value)
    } else if (e.detail.value == 1) {
      wx.showModal({
        title: '提示',
        content: "当前为代拿类型，贵重物品请注意保管！",
        showCancel: false,
      })
      this.setData({
        src: this.data.src1,
        pickernum: e.detail.value,
        i_1: "请填写订单内容",
        i_1_1: "订单内容",
        i_1_1_1: "订单内容",
        i_1_2: "订单备注",
        i_1_2_1: "选填",
        i_2: "请填写收件信息",
        i_2_1: "收件人",
        i_2_1_1: "名字",
        i_2_2: "wechat",
        i_2_2_1: "微信将用于进行订单审核（此栏将进行加密处理 tt将协助您共同维护隐私！）",
        i_2_3: "联系电话",
        i_2_3_1: "请输入手机号",
        i_2_4: "详细地址",
        i_2_4_1: "请输入详细地址(最多50字)",
        i_3: "订单价格",
        i_3_1: "订单总额",
        i_3_1_1: "仅包含商品金额，若不确定，可不填",
        i_4: "您付给跑手的酬劳",
        valueinputnumber: 2,
        type: '1'
      })
      console.log('picker发送选择改变，携带值为', e.detail.value)
    } else if (e.detail.value == 2) {
      wx.showModal({
        title: '提示',
        content: "当前为 求助 类型",
        showCancel: false,
      })
      this.setData({
        src: this.data.src2,
        pickernum: e.detail.value,
        i_1: "请填写订单内容",
        i_1_1: "求助内容",
        i_1_1_1: "求助内容",
        i_1_2: "求助备注",
        i_1_2_1: "选填",
        i_2: "请填写收件信息",
        i_2_1: "收件人",
        i_2_1_1: "名字",
        i_2_2: "wechat",
        i_2_2_1: "微信将用于进行订单审核（此栏将进行加密处理 tt将协助您共同维护隐私！）",
        i_2_3: "联系电话",
        i_2_3_1: "请输入手机号",
        i_2_4: "详细地址",
        i_2_4_1: "请输入详细地址(最多50字)",
        i_3: "订单价格",
        i_3_1: "订单总额",
        i_3_1_1: "此栏价格指服务过程产生的额外费用，若无 可不填",
        i_4: "您付给跑手的酬劳",
        valueinputnumber: 2,
        type: '1'
      })
      console.log('picker发送选择改变，携带值为', e.detail.value)
    } else if (e.detail.value == 3) {
      wx.showModal({
        title: '提示',
        content: "当前为 帮做 类型，您将作为服务方提供服务给他人！",
        showCancel: false,
      })
      this.setData({
        src: this.data.src3,
        pickernum: e.detail.value,
        i_1: "分享的技能描述",
        i_1_1: "擅长的技能",
        i_1_1_1: "请描述你所擅长的技能或能力",
        i_1_2: "技能的成就",
        i_1_2_1: "您将承担其真实性的责任",
        i_2: "请填写您的基本信息",
        i_2_1: "名字",
        i_2_1_1: "名字",
        i_2_2: "wechat",
        i_2_2_1: "微信将用于进行订单审核（此栏将进行加密处理 tt将协助您共同维护隐私！）",
        i_2_3: "联系电话",
        i_2_3_1: "请输入手机号",
        i_2_4: "详细地址",
        i_2_4_1: "请输入详细地址(最多50字)",
        i_3: "订单价格",
        i_3_1: "订单价格",
        i_3_1_1: "此栏价格指服务过程产生的额外费用，若无 可不填",
        i_4: "您期望获得的酬劳",
        valueinputnumber: 0,
        type: '1'
      })
      console.log('picker发送选择改变，携带值为', e.detail.value)
    } else if (e.detail.value == 4) {
      this.setData({
        type: '2',
        //信息发布的经营模式，采取免费，附加增值服务类
        valueinputnumber: 0,
        src: this.data.src4,
        pickernum: e.detail.value,
        i_1: "信息发布内容",
        i_1_1: "主题/内容",
        i_1_1_1: "请填写主题/内容",
        i_1_2: "备注",
        i_1_2_1: "请填写内容或备注",
        i_2: "请填写您的基本信息",
        i_2_1: "名字",
        i_2_1_1: "名字",
        i_2_2: "wechat",
        i_2_2_1: "微信将用于进行订单审核（此栏将进行加密处理 tt将协助您共同维护隐私！）",
        i_2_3: "联系电话",
        i_2_3_1: "请输入手机号",
        i_2_4: "详细地址",
        i_2_4_1: "请输入详细地址(最多50字)",
        i_3: "订单价格（如涉及交易，请如实填写，以便保障您的权益）",
        i_3_1: "订单价格",
        i_3_1_1: "订单价格",
        i_4: "请勿填写此栏",
      })
    }
  },
})