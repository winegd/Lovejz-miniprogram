// pages/practise/practise.js
import { getlistByKnowledegId } from '../../api/api'
import { saveRecords } from '../../api/record'
import { getQuestionRandom } from '../../api/question'
import { request } from "../../api/request"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    m: 0,
    toView: '',
    show: false

  },
  submit (e) {
    this.submit_record(e.detail)
    e.detail.push(123)
    this.setData({
      m: 1,
      list: e.detail
    })


  },
  submit_jiexi () {
    this.setData({
      toView: 'item0'
    })

  },
  updateQuestion (e) {
    let str = "list[" + e.detail.index + "]"
    this.setData({
      [str]: e.detail.list
    })
    // console.log(this.data.list)

  },
  nextQuestion (e) {
    if (e.detail != undefined) {
      let index = e.detail + 1
      if (index == this.data.list.length) {
        this.setData({
          show: true
        })
        console.log('已经是最后一题了')
      }
      this.selectComponent('#component' + e.detail).stopTimer()
      this.setData({
        toView: 'item' + index
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '此题型需手动划到下一题',
        duration: 1500,
      })

    }


  },
  Toquestion (e) {
    this.setData({
      toView: 'item' + e.detail
    })
  },
  stopAllTimer () {
    let data = this.data.list.pop()
    for (let i = 0; i < data.length; i++) {
      this.selectComponent('#component' + i).stopTimer()
    }

  },
  async submit_record (list) {
    let userInfo = wx.getStorageSync('userInfo')
    let records = []
    for (let i of list) {
      let record = {}
      record.userId = userInfo.openid
      record.questionId = i.id
      record.isCorrect = i.isCorrect
      record.usedTime = i.usedTime
      let selected = ''
      for (let j of i.options) {
        if (j.selected == 1) {
          // selected.push(j.id)
          selected = selected+j.id+','
        }
      }
      record.selected = selected
      records.push(record)
    }
    saveRecords(records).then(res => {
      if (res.code == 201) {
        wx.showToast({
          icon: 'none',
          title: '网络出错，请稍后再试',
        })
      }
    })
    console.log(records)
  },
  async get_record(id){
    let that = this
    request('record/getrecord/'+id,'GET').then(res=>{
      if(res.code == 200){
        let data = []
        data.push(res.data)
        for(let i of data[0].question.options){
          let res = data[0].selected.split(',').indexOf(i.id+'')
          // console.log(data[0].selected.split(','))
          if(res != -1){
            i.selected = 1
          }else{
            i.selected = 0
    
          }
          }
          that.setData({
            list:data,
            m:2
          })
          console.log(data)
      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.msg == 'random') {
      this.getQuestionRandom()
    } else if (options.msg == 'chapter_id') {
      this.getQuestions(options.data)

    } else if (options.msg == 'mistake') {
  
      this.get_record(options.data)
 
      
    }


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
    setTimeout(() => {
      const observer = this.createIntersectionObserver({
        thresholds: [0],
        observeAll: true
      }).relativeTo('.scroll-view_h').observe('.question_component', (res) => {
        // console.log(res)
        const index = res.dataset.index;

        if (res.intersectionRatio > 0 && this.data.m == 0) {
          // 当组件与scroll-view交叉时，启动计时器
          this.selectComponent('#component' + index).startTimer();
          // console.log(this.selectComponent('#component' + index));

        } else {
          this.selectComponent('#component' + index).stopTimer()

        }
      });
    }, 1000);








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
  async getQuestions (id) {

    getlistByKnowledegId(id, 1, 10).then(res => {
      for (let i of res.data) {
        i.isAnswer = 0
        i.isCorrect = 0
        i.usedTime = 1
        for (let j of i.options) {
          j.selected = 0
        }
      }
      res.data.push(123)
      this.setData({
        list: res.data
      })
    })
  },
  async getQuestionRandom () {
    let that = this
    getQuestionRandom().then(res => {
      if (res.code == 200) {
        that.setData({
          list: res.data
        })
      }
    })

  },
  scroll (e) {
    // console.log(e)

  }

})
