const app = getApp()
import { getlist } from '../../api/chapter'
Page({
  offsetTopList: [],
  data: {
    chapters: [],
    activeTab: 0,
    vtabs: [],

  },
  onLoad (options) {
    getlist().then(res => {
      const vtabs = res.data.map(item => ({ title: item.name.substring(0, 3) }))
      this.setData({
        chapters: res.data,
        vtabs
      })
    })




  },
  onTabCLick (e) {
    const index = e.detail.index
    // console.log('tabClick', index)
  },

  onChange (e) {
    const index = e.detail.index
    // console.log('change', index)
  },
  onReady () {

  },
  onShow () {

  },
  onHide () {

  },
  onUnload () {

  },
  onShareAppMessage () {
    return {
      title: '',
    };
  },
  clickText (e) {
    let k_id = e.currentTarget.dataset.k.id
    wx.navigateTo({
      url: `/pages/practise/practise?msg=chapter_id&data=${k_id}`,
    })
    console.log(k_id)
  }

});