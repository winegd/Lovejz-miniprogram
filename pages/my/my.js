// pages/my/my.js
import { getUserInfo } from '../../api/student'
const app = getApp()
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
//七牛工具sdk qiniuUploader.js
const qiniuUploader = require("../../utils/qiniuUploader");
// 初始化七牛相关参数
function initQiniu () {
  var options = {
    // bucket所在区域，这里是华北区。ECN, SCN, NCN, NA, ASG，分别对应七牛云的：华东，华南，华北，北美，新加坡 5 个区域
    region: 'NCN',
    uploadURL: 'https://up-z1.qiniup.com',
    // 从指定 url 通过 HTTP GET 获取 uptoken，返回的格式必须是 json 且包含 uptoken 字段，例如： {"uptoken": "0MLvWPnyy..."}
    uptokenURL: app.globalData.g_url + 'stu/getQiNiuUpToken',
    // bucket 外链域名，下载资源时用到。如果设置，会在 success callback 的 res 参数加上可以直接使用的 fileURL 字段。否则需要自己拼接
    domain: 'https://love-jz-stu.lazyy.top',
    shouldUseQiniuFileName: true
  };
  // 将七牛云相关配置初始化进本sdk
  qiniuUploader.init(options);
}


Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: '',
    avatarUrl: defaultAvatarUrl,
    show_popup: false,
    nickName: '',
    defaultAvatarUrl: defaultAvatarUrl,
    content_list: [
      {
        'name': '错题本',
        'icon': '/icon/cw.png',
        'to': '/pages/mistake/mistake'
      },
      {
        'name': '收藏的题目',
        'icon': '/icon/sc.png',
        'to': '/pages/mistake/mistake'
      },
      {
        'name': '荣誉证书',
        'icon': '/icon/ry.png',
        'to': '/pages/mistake/mistake'
      },
      {
        'name': '荣誉证书',
        'icon': '/icon/ry.png',
        'to': '/pages/mistake/mistake'
      },
      {
        'name': '排行榜',
        'icon': '/icon/ph.png',
        'to': '/pages/mistake/mistake'
      }
    ]


  },
  onChooseAvatar (e) {
    const {
      avatarUrl
    } = e.detail

    this.setData({
      avatarUrl,
    })
    console.log(this.data.avatarUrl)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // const toast = this.selectComponent('#my-toast');
    let userInfo = wx.getStorageSync('userInfo')
    console.log(userInfo)
    // console.log(baseuserInfo)
    let nickName = this.data.nickName
    let that = this
    if (userInfo == '' || userInfo == null || userInfo.nickname == '微信用户') {
      wx.login({
        success (res) {
          if (res.code) {
            //发起网络请求
            wx.request({
              url: app.globalData.g_url + 'stu/get_openid',
              method: 'GET',
              data: {
                'code': res.code
              },
              header: {
                'content-type': 'application/json'
              },
              success (res) {
                // console.log(res)
                if (res.data.code == 200) {
                  let openid = res.data.data.openid
                  wx.setStorageSync('userInfo', { 'openid': openid })
                  that.getUserInfo(openid)
                }
                console.log('登陆成功')
                //   wx.lin.showMessage({
                //     type:'success',
                //     content:'获取信息完成'
                // })
                // setTimeout(()=>{
                //   wx.navigateTo({
                //     url: '/pages/login/login',
                //   })
                // },500)

              }

            }


            )
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    } else {
      this.setData({
        userInfo: userInfo
      })
      if (userInfo.nickname == '' || userInfo.nickname == null) {
        that.show_popup()
      }
    }

  },
  getUserInfo (openid) {
    let that = this
    getUserInfo(openid).then(res => {
      if (res.code == 200) {
        wx.setStorageSync('userInfo', res.data)
        this.setData({
          userInfo: res.data
        })
      } else {
        that.show_popup()
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {


  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  login () {
    console.log('尝试获取信息')

  },
  close_popup () {
    this.setData({
      show_popup: false

    })
  },
  show_popup () {
    let userInfo = wx.getStorageSync('userInfo')
    if (userInfo.nickname == '' || userInfo.nickname == null || userInfo.nickname == '微信用户') {
      this.setData({
        show_popup: true
      })
    } else {
      getUserInfo(userInfo.openid).then(res => {

        if (res.code == 200) {
          wx.navigateTo({
            url: '/pages/profile/profile'
          })
        } else {
          wx.navigateTo({
            url: '/pages/login/login'
          })
        }

      })

    }

  },
  setNickName (e) {
    this.setData({
      nickName: e.detail.value
    })
    console.log("设置昵称:" + e.detail.value)
  },
  submit_popup () {
    let that = this
    console.log(this.data.nickName)
    if (this.data.avatarUrl == defaultAvatarUrl) {
      wx.lin.showMessage({
        type: 'error',
        content: '请设置头像'
      })
    } else {


      this.upload_img(this.data.avatarUrl)
      // console.log(this.data.avatarUrl)
      this.close_popup()
    }

  },
  upload_img (url, openid) {
    let that = this
    let userInfo = wx.getStorageSync('userInfo')
    var openid = userInfo.openid
    let nickName = this.data.nickName
    console.log(openid)
    //第一步初始化
    initQiniu();
    //第二步交给七牛上传
    qiniuUploader.upload(url,
      (res) => {
        // sconsole.log(res);
        console.log('imgurl:' + res.imageURL)
        userInfo.avatarurl = res.imageURL
        userInfo.nickname = nickName
        wx.setStorageSync('userInfo', userInfo)
        that.setData({
          userInfo: userInfo
        })
      },
      (error) => {
      }
      // {
      //   region: 'NCN',
      //   uploadURL: 'https://up-z1.qiniup.com',
      //   uptokenURL: 'http://localhost:80/stu/getQiNiuUpToken',
      //   domain: 'http://love-jz-stu.lazyy.top',
      //   key:openid,
      // shouldUseQiniuFileName: false
      // },

    );
  }

})