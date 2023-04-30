import { setFavorite } from '../../api/record'
import { request } from "../../api/request"
const app = getApp()
Component({

  /**
   * 页面的初始数据
   */
  properties: {
    question: {
      type: Object
    },
    mode: Number,
    index: Number
  },
  data: {
    imgarr: [],
    list: null,
    zimu: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'],
    tixing: ['单选题', '多选题'],
    nandu: ['基础', '适中', '提高'],
    m: 0,
    timer: null,
    time: 1,
    timerStarted: false,
    sc_img: '/icon/sc_2.png',
    sc_img_2: '/icon/sc.png',

  },
  observers: {
    'question,mode': function (question, mode) {
      // for (let i of val.options) {
      //   i.selected = 0
      //   // console.log(i)
      // }
      let that = this

      if (mode == 1) {
        this.isFavorite(wx.getStorageSync('userInfo').openid, question.id).then(res => {
          question.isFavorite = res
          that.setData({
            list: question,
            m: mode
          })
        })
      } else {
        this.setData({
          list: question,
          m: mode
        })
      }


    }


  },

  lifetimes: {
    attached: function () {


    },
    detached: function () {
      // 在组件卸载时停止计时器
      this.stopTimer();
    }
  },
  methods: {
    async cancelFavorite (openid, question_id) {
      let that = this
      request('favorite/delete/' + openid + '/' + question_id, 'DELETE').then(res => {
        if (res.code == 200) {
          wx.showToast({
            icon: 'success',
            title: '取消成功',
          })
          let data = that.data.list
          data.isFavorite = 0
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
    async setFavorite (favorite) {
      let that = this
      request('favorite/save', 'PUT', favorite).then(res => {
        if (res.code == 200) {
          wx.showToast({
            icon: 'success',
            title: '收藏成功',
          })
          let data = that.data.list
          data.isFavorite = 1
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
    async isFavorite (openid, questionId) {
      let code = undefined
      await request('favorite/isFavorite/' + openid + '/' + questionId, 'GET').then(res => {
        if (res.code == 200) {

          code = res.data

        }
      })
      return code
    },
    cancel_sc () {
      this.cancelFavorite(app.globalData.userInfo.openid, this.data.list.id)




    },
    set_sc () {
      let favorite = {}
      favorite.userId = app.globalData.userInfo.openid
      favorite.usedTime = this.data.list.usedTime
      favorite.questionId = this.data.list.id
      let selected = ''
      for (let j of this.data.list.options) {
        if (j.selected == 1) {
          // selected.push(j.id)
          selected = selected + j.id + ','
        }
      }
      favorite.selected = selected
      console.log(favorite)
      this.setFavorite(favorite)
    },


    select_answer (e) {
      if (this.data.m == 11) {
        this.select_answer_pk(e)
      } else {
        // console.log(e.currentTarget.dataset)
        let index = e.currentTarget.dataset.index
        let selected = e.currentTarget.dataset.selected
        let type = e.currentTarget.dataset.type
        let list = this.change_select(this.data.list, index, selected, type)
        // this.setData({
        //   list: this.change_select(this.data.list, index, selected, type)
        // })
        let data = {}
        data.list = list
        data.list.usedTime = this.data.time
        data.index = this.properties.index
        this.triggerEvent('updateQuestion', data)
        if (type == 0) {
          this.triggerEvent('nextQuestion', this.properties.index)
        } else if (type == 1) {
          this.triggerEvent('nextQuestion')
        }
      }

    },
    select_answer_pk (e) {
      // console.log(this.data.list)

      let index = e.currentTarget.dataset.index
      // let selected = e.currentTarget.dataset.selected
      // let type = 0
      let list = this.change_select_pk(this.data.list, index)
      this.setData({
        list
      })
      list.usedTime = this.data.time
      this.setData({
        time: 1
      })
      // console.log(this.data.list)

      this.triggerEvent('nextQuestion', this.properties.list)
    },
    click_question (e) {
      let content = e.currentTarget.dataset.content
      this.showImage(content)

    },
    showImage (content) {
      let imgarr = [];
      let regex = new RegExp(/<img.*?(?:>|\/>)/gi); // 匹配所有图片
      let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i; // 匹配src图片
      let arrsImg = content.match(regex); // content后台返回的富文本数据
      if (arrsImg != null) {
        for (let a = 0; a < arrsImg.length; a++) {
          let srcs = arrsImg[a].match(srcReg);
          imgarr.push(srcs[1])
        }
        wx.previewImage({
          current: imgarr[0], // 当前显示图片的http链接
          urls: imgarr // 需要预览的图片http链接列表
        })
      }

    },
    change_select (list, index, selected, type) {
      if (type == 0) {
        for (let i = 0; i < list.options.length; i++) {
          if (i == index) {
            list.options[i].selected = this.set_selected(selected)
          }
          else {
            list.options[i].selected = 0
          }
        }
      } else if (type == 1) {
        for (let i = 0; i < list.options.length; i++) {

          if (i == index) {
            list.options[i].selected = this.set_selected(selected)
          }
        }
      }
      return list

    },

    change_select_pk (list, index) {
      list.options[index].selected = 1
      list.isAnswer = 1

      for (let i of list.options) {
        if (i.selected == 1 && i.isCorrect == 1) {
          list.isCorrect = 1
        }
      }
      console.log(list)
      return list

    },
    set_selected (selected) {
      if (selected == 0) return 1
      else return 0

    },
    startTimer: function () {
      // 启动计时器，并设置更新时间的函数
      // if (!this.data.timerStarted) {
      //   this.setData({
      //     timerStarted: true,
      //     timer: setInterval(this.updateTime.bind(this), 1000)
      //   })
      // }

      this.setData({
        timer: setInterval(this.updateTime.bind(this), 1000)
      })



    },
    stopTimer: function () {
      // 停止计时器
      clearInterval(this.data.timer);
    },
    updateTime: function () {
      // 更新计时器时间，并将时间更新到界面上
      var time = this.data.time + 1;
      this.setData({
        time: time
      })
    }

  }

})