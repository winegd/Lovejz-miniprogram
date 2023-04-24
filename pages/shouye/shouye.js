// pages/shouye/shouye.js
import { request } from "../../api/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content_list: [
      {
        'name': '今日做题',
        'count': 0,
        'color': 'black'
      },
      {
        'name': '答对',
        'count': 0,
        'color': '#08E61D'
      },
      {
        'name': '平均用时',
        'count': '0' + 's',
        'color': 'black'
      },
      {
        'name': '正确率',
        'count': '0' + '%',
        'color': 'red'
      }
    ],
    gongneng: [
      {
        'name': '专项刷题',
        'icon': '/icon/zxst.png',
        'to': '/pages/chapter/chapter'
      },
      {
        'name': '随机刷题',
        'icon': '/icon/sj.png',
        'to': "/pages/practise/practise?msg=random"
      },
      {
        'name': '刷错题',
        'icon': '/icon/ct.png',
        'to': '/pages/practise/practise?msg=random'
      },


    ]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {



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
    let list = this.data.content_list
    let that = this
    request("record/todayData", 'GET').then(res => {
      list[0].count = res.data.total
      list[1].count = res.data.correct
      list[2].count = res.data.avgTime + 's'
      if (res.data.correctRate >= 0.7) {
        list[3].color = '#08E61D'
      } else {
        list[3].color = 'red'
      }
      list[3].count = res.data.correctRate * 100 + '%'
      that.setData({
        content_list: list
      })
    })

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

  }
})