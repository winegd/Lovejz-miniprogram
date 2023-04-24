// pages/mistake/mistake.js
import { request } from "../../api/request";
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    zimu: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'],
    tixing: ['单选题', '多选题'],
    nandu: ['基础', '适中', '提高'],


  },
  search_input (e) {
    // console.log(e.detail.value)
  },
  click_question (e) {
    let index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: `/pages/practise/practise?msg=mistake&data=${this.data.list[index].id}`,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {

    this.getRecords(1, 5)

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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage () {

  },
  async getRecords (offset, pagesize) {
    let userInfo = wx.getStorageSync("userInfo")
    let that = this
    request("record/getrecord/" + userInfo.openid + '/isCorrect/0/' + offset + '/' + pagesize, "GET").then(res => {
      that.setData({
        list: res.data
      })
    })
  }
})