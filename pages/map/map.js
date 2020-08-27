//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    scale: 18,
    latitude: 0,
    longitude: 0,
    time: false
  },
  // 页面加载
  onLoad: function (options) {
    var that = this;
    // 2.获取并设置当前位置经纬度
    wx.getLocation({
      type: "gcj02",
      success: (res) => {

        //获取用户的初始位置
        wx.setStorageSync('start_long', res.longitude);
        wx.setStorageSync('start_lati', res.latitude);
        this.setData({
          longitude: res.longitude,
          latitude: res.latitude
        });
      }
    });
    wx.setStorageSync('time', false);


    // this.setData({
    //   markers:[
    //     {
    //       "id": 1,
    //       "title": "去这里",
    //       "iconPath": "/images/markers.png",
    //       "latitude": 31.096575,
    //       "longitude": 121.506271,
    //       "width": 45,
    //       "height": 50 
    //     },
    //     {
    //       "id": 2,
    //       "title": "去这里",
    //       "iconPath": "/images/markers.png",
    //       "latitude": 31.09761,
    //       "longitude": 121.50666,
    //       "width": 45,
    //       "height": 50
    //     }
    //   ]
    // })
    // 4.请求服务器，显示附近的订单，用marker标记
    wx.request({
      url: '',
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: (res) => {
        console.log(res);
        let data = res.data.map((item, index, arr) => {
          return {
            "id": item.id,
            "title": "去这里",
            "iconPath": "/images/n.png",
            "latitude": item.latitude,
            "longitude": item.longitude,
            "width": 45,
            "height": 50
          }
        })
        console.log(data);
        this.setData({
          markers: data
        });
        //   console.log(res);
        //   for (var i = 0; i < res.data.length; i++) {
        //     data[i].id = res.data[i].id,
        //       data[i].title = "title",
        //       data[i].iconPath = "/images/markers.png",
        //       data[i].latitude = res.data[i].latitude,
        //       data[i].longitude = res.data[i].longitude,
        //       data[i].width = res.data[i].width,
        //       data[i].height = res.data[i].height
        //   }
        //   console.log(data);
        //   this.setData({
        //     markers: data
        //   })
      }
    });
    // 3.设置地图控件的位置及大小，通过设备宽高定位
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          controls: [{
            id: 1,
            iconPath: '/images/n.png',//定位图标
            position: {
              left: 20,
              top: res.windowHeight - 80,
              width: 50,
              height: 50
            },
            clickable: true
          },
          {
            id: 2,
            iconPath: '/images/n.png',//接单图标
            position: {
              left: res.windowWidth / 2 - 45,
              top: res.windowHeight - 100,
              width: 90,
              height: 90
            },
            clickable: true
          },
          {
            id: 3,
            iconPath: '/images/n.png',//投诉图标
            position: {
              left: res.windowWidth - 70,
              top: res.windowHeight - 80,
              width: 50,
              height: 50
            },
            clickable: true
          },
          {
            id: 4,
            iconPath: '/images/n.png',//标记图标
            position: {
              left: res.windowWidth / 2 - 11,
              top: res.windowHeight / 2 - 45,
              width: 22,
              height: 45
            },
            clickable: true
          },]
        });
      }
    });
  },
  // 页面显示
  onShow: function () {
    // 1.创建地图上下文，移动当前位置到地图中心
    this.mapCtx = wx.createMapContext("Map");
    this.movetoPosition()
  },
  // 地图控件点击事件
  bindcontroltap: function (e) {
    // 判断点击的是哪个控件 e.controlId代表控件的id，在页面加载时的第3步设置的id
    switch (e.controlId) {
      // 点击定位控件
      case 1: this.movetoPosition();
        break;
      // 点击立即接单，判断当前是否正在订单内//时间计费
      case 2: if (!wx.getStorageSync('time')) {
        //根据token判断是否登录，没有登录，先登录,第一种情况没有token
        //直接跳转到登录页，第二种情况有token，但是已经过期了，需要先删除token,再重新登录
        if (!wx.getStorageSync('token')) {
          wx.showModal({
            title: '请先登录',
            content: '接单失败',
            success: function (res) {
              wx.switchTab({
                url: '../login/login',
              });
            }
          });
        } else if (wx.getStorageSync('token')) {
          var token = wx.getStorageSync('token');
          wx.request({
            url: '',
            method: 'post',
            header: {
              token: token
            },
            success: function (res) {
              if (res.statusCode == '401') {
                wx.removeStorageSync('userInfo');
                wx.showModal({
                  title: '接单失败',
                  content: '登录已过期，请重新登录',
                  showCancel: false,
                  success: function (res) {
                    wx.switchTab({
                      url: '../login/login',
                    });
                  },
                });
              } else if (wx.getStorageSync('guarantee') == 0) {
                wx.showModal({
                  title: '接单失败',
                  content: '您的押金为0,请先充值199元',
                  showCancel: false,
                  success: function (res) {
                    wx.navigateTo({
                      url: '',//跳转充值界面
                    });
                  },
                })
              } else {
                wx.setStorageSync('login', true);
                wx.navigateTo({
                  url: '',
                })
              }
            }
          });
        }
      
      } else {
        wx.navigateTo({
          url: '../billing/index',
        })
      }
        break;
      // 点击投诉控件，跳转到投诉页
      case 3: wx.navigateTo({
        url: '../warn/index'
      });
        break;
      default: break;
    }
  },
  // 地图视野改变事件
  bindregionchange: function (e) {
    // 拖动地图，获取附件订单位置
    if (e.type == "begin") {
      wx.request({
        url: '',
        header: {
          'Content-Type': 'application/json'
        },
        data: {},
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {}, // 设置请求的 header
        success: (res) => {
          for (var i = 0; i < res.data.length; i++) {
            res.data[i].title = '去这里',
              res.data[i].iconPath = "/images/markers.png",
              res.data[i].width = 45,
              res.data[i].height = 50
          }
          this.setData({
            _markers: res.data
          })
        }
      })
      // 停止拖动，显示订单位置
    } else if (e.type == "end") {
      this.setData({
        markers: this.data._markers
      })
    }
  },
  // 地图标记点击事件，连接用户位置和点击的订单位置
  bindmarkertap: function (e) {
    console.log(e);
    let _markers = this.data.markers;
    let markerId = e.markerId;
    let currMaker = _markers[markerId];
    this.setData({
      polyline: [{
        points: [{
          longitude: this.data.longitude,
          latitude: this.data.latitude
        }, {
          longitude: currMaker.longitude,
          latitude: currMaker.latitude
        }],
        color: "#FF0000DD",
        width: 1,
        dottedLine: true
      }],
      scale: 18
    })
  },
  // 定位函数，移动位置到地图中心
  movetoPosition: function () {
    this.mapCtx.moveToLocation();
  }
})
