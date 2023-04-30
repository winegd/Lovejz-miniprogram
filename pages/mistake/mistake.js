// pages/mistake/mistake.js
import { request } from "../../api/request";
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sc_img: '/icon/sc_2.png',
    sc_img_2: '/icon/sc.png',
    list: [],
    zimu: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'],
    tixing: ['单选题', '多选题'],
    nandu: ['基础', '适中', '提高'],
    offset: 1,
    pagesize: 5,
    m: 0


  },
  search_input (e) {
    // console.log(e.detail.value)
  },
  click_question (e) {
    let index = e.currentTarget.dataset.index
    let msg = 'mistake'
    if (this.data.m == 1) {
      msg = 'favorite'
    }

    wx.navigateTo({
      url: `/pages/practise/practise?msg=${msg}&data=${this.data.list[index].id}`,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {

    if (options.data == 0) {
      this.getRecords(this.data.offset, this.data.pagesize)

    } else if (options.data == 1) {
      this.getFavorites(this.data.offset, this.data.pagesize)
      this.setData({
        m: 1
      })


    }

  },
  /**
  * 页面上拉触底事件的处理函数
  */
  onReachBottom () {
    let offset = this.data.offset + 1
    if (this.data.m == 0) {
      this.getRecords(offset, this.data.pagesize)

    } else if (this.data.m == 1) {
      this.getFavorites(offset, this.data.pagesize)
    }



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
   * 用户点击右上角分享
   */
  onShareAppMessage () {

  },
  async getFavorites (offset, pagesize) {
    let userInfo = wx.getStorageSync("userInfo")
    let that = this
    request("favorite/list/" + userInfo.openid + '/' + offset + '/' + pagesize, "GET").then(res => {
      let list = [...this.data.list, ...res.data]
      // console.log(list)
      that.setData({
        list,
        offset
      })
    })
  },
  async getRecords (offset, pagesize) {
    let userInfo = wx.getStorageSync("userInfo")
    let that = this
    request("mistake/list/" + userInfo.openid + '/' + offset + '/' + pagesize, "GET").then(res => {
      let list = [...this.data.list, ...res.data]
      // console.log(list)
      that.setData({
        list,
        offset
      })
    })
  },
  async cancelFavorite (openid, question_id, index) {
    let that = this
    request('favorite/delete/' + openid + '/' + question_id, 'DELETE').then(res => {
      if (res.code == 200) {
        wx.showToast({
          icon: 'success',
          title: '取消成功',
        })
        let data = that.data.list
        data[index].isFavorite = 0
        that.setData({
          list: data
        })
      } else {
        wx.showToast({
          icon: 'error',
          title: '取消失败',
        })
      }
    })


  },
  async setFavorite (favorite, index) {
    let that = this
    request('favorite/save', 'PUT', favorite).then(res => {
      if (res.code == 200) {
        wx.showToast({
          icon: 'success',
          title: '收藏成功',
        })
        let data = that.data.list
        data[index].isFavorite = 1
        that.setData({
          list: data
        })
      } else {
        wx.showToast({
          icon: 'error',
          title: '收藏失败',
        })
      }
    })


  },
  cancel_sc (e) {
    let index = e.currentTarget.dataset.index
    console.log(this.data.list[index])
    this.cancelFavorite(this.data.list[index].userId, this.data.list[index].questionId, index)




  },
  set_sc (e) {
    let favorite = {}
    let index = e.currentTarget.dataset.index
    favorite.userId = this.data.list[index].userId
    favorite.usedTime = this.data.list[index].usedTime
    favorite.questionId = this.data.list[index].questionId
    favorite.selected = this.data.list[index].selected
    console.log(favorite)
    this.setFavorite(favorite, index)
  },

})