// pages/profile/profile.js
import { request } from "../../api/request"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    userInfo: [
      {
        title: '头像',
        data: '/icon/cw.png'
      },
      {
        title: '昵称',
        data: '/icon/cw.png'
      },
      // {
      //   title: '姓名',
      //   data: '/icon/cw.png'
      // },
      // {
      //   title: '学号',
      //   data: '/icon/cw.png'
      // },
      // {
      //   title: '手机',
      //   data: '/icon/cw.png'
      // },
      // {
      //   title: '创建时间',
      //   data: '/icon/cw.png'
      // },
    ]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    let userInfo = wx.getStorageSync('userInfo')
    console.log(userInfo)
    let userInfoList = this.data.userInfo
    userInfoList[0].data = userInfo.avatarurl
    userInfoList[1].data = userInfo.nickname
    // userInfoList[2].data = userInfo.name
    // userInfoList[3].data = userInfo.no
    // userInfoList[4].data = userInfo.phone
    // userInfoList[5].data = this.formatTime(userInfo.createTime)

    this.setData({

      userInfo: userInfoList
    })



  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom () {
    console.log(1111111)

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage () {

  },
  formatTime (strTime) {
    let timestamp = Date.parse(strTime); // 将时间字符串转换为时间戳
    let date = new Date(timestamp);          // 将时间戳转换为日期对象
    let year = date.getFullYear();           // 获取年份
    let month = date.getMonth() + 1;         // 获取月份（注意：月份从0开始，需要加1）
    let day = date.getDate();                // 获取日期
    let hours = date.getHours();             // 获取小时
    let minutes = date.getMinutes();         // 获取分钟
    let seconds = date.getSeconds();         // 获取秒数

    let formattedTime = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
    return formattedTime            // 输出转换后的时间字符串
  }
})