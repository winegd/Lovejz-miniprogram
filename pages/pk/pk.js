// pages/pk/pk.js
import { request } from "../../api/request"
import { saveRecords } from '../../api/record'

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg: '',
    list: {},
    toView: '',
    show: 0,
    questions: [],
    question_index: 0,
    AllTime: 0,
    score: 0,
    score2: 0,
    userInfo: wx.getStorageSync('userInfo'),
    show_button: true,
    show_pk_info: 0,
    userInfo2: {},
    loading: false,
    progress: 1,
    showFPopup: false,
    showTPopup: false,
    showPPopup: false,
    cdn_url: app.globalData.cdn_url,
    usedTime: 1,
    usedTime2: 1,
    opponent_state: true,
  },
  onClickHideF () {
    this.setData({ showFPopup: false });
  },
  onClickHideT () {
    this.setData({ showTPopup: false });
  },
  onClickHideP () {
    this.setData({ showPPopup: false });
  },
  showPopupF () { this.setData({ showFPopup: true }); },
  showPopupT () { this.setData({ showTPopup: true }); },
  showPopupP () { this.setData({ showPPopup: true }); },
  start_pk () {
    this.setData({
      show_button: false
    })
    this.showLoading()
    let data = {}
    data.type = 'MATCH_USER'
    data.msg = '匹配对手'
    this.send_data(data)


  },
  send_game_over () {
    let data = {}
    data.type = 'GAME_OVER'
    data.msg = '结束对局'
    this.send_data(data)
  },
  send_add () {
    let data = {}
    data.type = 'ADD_USER'
    data.msg = '加入匹配'
    this.send_data(data)
  },
  over_pk () {

    this.game_over()
  },
  cancel_pk () {
    this.setData({
      show_button: true
    })
    let data = {}
    data.type = 'CANCEL_MATCH'
    data.msg = '匹配对手'
    this.send_data(data)
    this.hideLoading()
  },
  send_data (msg) {
    if (app.sendWebsocket(msg)) {
      console.log('消息 ' + JSON.stringify(msg) + ' 发送成功')
    }
  },
  onMessage: function (event) {
    let data = JSON.parse(event.data)
    let type = data.chatMessage.type

    console.log('接收到消息：', data);
    if (data.code == 2000 && type == "MATCH_USER") {
      this.setData({
        userInfo2: data.chatMessage.data.opponentInfo
      })
      console.log(data.chatMessage.data.opponentInfo)
      this.start_game(data.chatMessage.data.questions)
    } if (data.code == 2004) {
      this.game_over()
    } if (type == "PLAY_GAME") {
      console.log(data.chatMessage.data)
      this.setData({ score2: data.chatMessage.data.score, usedTime2: data.chatMessage.data.usedTime })
    } if (data.code == 2005) {
      this.setData({ opponent_state: false })

    }

  },

  game_over () {
    this.setBackgroundColorImage()
    this.panduanWiner()
    this.setData({
      toView: '',
      show: 0,
      show_button: true,
      questions: [],
      list: {},
      question_index: 0,
      show_pk_info: 0,
      score: 0,
      score2: 0,
      userInfo2: {},
      AllTime: 0,
      progress: 0,
      opponent_state: true,
      usedTime: 1,
      usedTime2: 1,

    })

    setTimeout(() => {
      this.setData({ showPopup: false })

    }, 4000)



  },
  async panduanWiner () {
    let score = this.data.score
    let score2 = this.data.score2
    let usedTime = this.data.usedTime
    let usedTime2 = this.data.usedTime2
    let opponent_state = this.data.opponent_state
    if (opponent_state) {
      if (score > score2) {
        this.showPopupT()
      } else if (score < score2) {
        this.showPopupF()
      } else {
        if (usedTime < usedTime2) {
          this.showPopupT()
        } else if (usedTime > usedTime2) {
          this.showPopupF()
        } else {
          this.showPopupT()
        }
      }
    } else {
      this.showPopupT()
    }



    setTimeout(() => {
      this.onClickHideF()
      this.onClickHideT()
      this.onClickHideP()
    }, 2000)
  },


  start_game (list) {
    let question_index = this.data.question_index
    this.setData({
      show: 1
    })
    this.hideLoading()
    wx.showToast({
      title: '匹配成功',
      icon: 'success',
      duration: 1000
    })
    for (let i of list) {
      i.isAnswer = 0
      i.isCorrect = 0
      i.usedTime = 1
      for (let j of i.options) {
        j.selected = 0
      }
    }

    this.setData({
      questions: list
    })
    this.startProgress()
    setTimeout(() => {
      // this.setBackgroundColorWhite()
      this.setData({ list: list[question_index] })
      this.setData({
        show_pk_info: 1
      })
      this.selectComponent('#question_component').startTimer()

    }, 2000)

  },

  send_game_info () {
    let data = {}
    data.type = 'PLAY_GAME'
    data.msg = '游戏信息'
    data.score = this.data.score
    data.usedTime = this.data.usedTime
    this.send_data(data)

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    app.globalData.messageCallback = this.onMessage.bind(this);
    wx.setNavigationBarColor({//设置导航栏颜色
      frontColor: '#000000',//注意frontColor的值只能为000000或者111111
      backgroundColor: '#82bdfb'
    });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady () {

  },

  async startProgress () {
    let progress = this.data.progress;
    const intervalId = setInterval(() => {
      this.setData({ progress: progress++ })
      if (progress > 100) {
        clearInterval(intervalId);
      }
    }, 20);
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow () {
    // this.send_add()
    wx.setTabBarStyle({
      backgroundColor: '#75b9fc',

    })
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
  nextQuestion (e) {
    let questions = this.data.questions
    let question_index = parseInt(this.data.question_index) + 1

    let data = e.detail
    this.jisuan_score(data)
    let usedTime = this.data.usedTime + data.usedTime
    console.log(data)

    let arr = []
    arr.push(data)
    this.send_game_info()
    this.submit_record(arr)
    if (question_index + 1 <= questions.length) {
      setTimeout(() => {
        this.setData({
          list: questions[question_index],
          question_index: question_index,
          usedTime
        })
      }, 500)
    } else {
      this.selectComponent('#question_component').stopTimer()
      this.send_game_over()
      this.setData({
        show: 0,

      })
    }



  },
  jisuan_score (data) {
    let score = this.data.score
    for (let i of data.options) {
      if (i.isCorrect == 1 && i.selected == 1) {
        score = score + 20
      }
    }
    this.setData({
      score
    })
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
          selected = selected + j.id + ','
        }
      }
      record.selected = selected
      records.push(record)
    }
    console.log(records)
    this.saveMistake(records)
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
  async saveMistake (records) {
    let data = []
    for (let i of records) {
      if (i.isCorrect == 0) {
        data.push(i)
      }

    }
    request('mistake/saveall', 'PUT', data).then(res => {
      if (res.code == 201) {
        wx.showToast({
          icon: 'none',
          title: '网络出错，请稍后再试',
        })
      }
    })
  },
  showLoading () {
    this.setData({ loading: true })
  },
  hideLoading () {
    this.setData({ loading: false })
  },
  setBackgroundColorWhite () {
    wx.setTabBarStyle({
      backgroundColor: '#ffff',
    })
    wx.setNavigationBarColor({//设置导航栏颜色
      frontColor: '#000000',//注意frontColor的值只能为000000或者111111
      backgroundColor: '#ffff'
    })

  },
  setBackgroundColorImage () {
    wx.setTabBarStyle({
      backgroundColor: '#75b9fc',
    })
    wx.setNavigationBarColor({//设置导航栏颜色
      frontColor: '#000000',//注意frontColor的值只能为000000或者111111
      backgroundColor: '#82bdfb'
    })

  }
})