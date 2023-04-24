import { setFavorite } from '../../api/record'
import { request } from "../../api/request"
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
    m: 0,
    timer: null,
    time: 1,
    timerStarted: false,
    sc_img: '/icon/sc_2.png',
    sc_img_2: '/icon/sc.png',
    sc_img_state: 1

  },
  observers: {
    'question': function (val) {
      // for (let i of val.options) {
      //   i.selected = 0
      //   // console.log(i)
      // }
      this.setData({
        list: val
      })
    },
    'mode': function (val) {
      this.setData({
        m: val
      })
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
    async setFavorite (questionId, state) {
      if (state == 1) {
      request('record/favorite/' + questionId + '/' + state, 'POST').then(res => {
          if (res.code == 200) {
            wx.showToast({
              icon: 'success',
              title: '收藏成功',
            })
          } else {
            wx.showToast({
              icon: 'error',
              title: '收藏失败',
            })
          }
        })
      } else {
        request('record/favorite/' + questionId + '/' + state, 'POST').then(res => {
          if (res.code == 200) {
            wx.showToast({
              icon: 'success',
              title: '取消收藏成功',
              duration:1000
            })
          } else {
            wx.showToast({
              icon: 'error',
              title: '取消收藏失败',
              duration:1000
            })
          }
        })

      }


    },
    cancel_sc(){
      this.setFavorite(this.data.list.questionId, 0)
      let data = this.data.list
      data.isFavorite = 0
      this.setData({
        list:data
      })



    },
    set_sc(){
      this.setFavorite(this.data.list.questionId, 1)
      let data = this.data.list
      data.isFavorite = 1
      this.setData({
        list:data
      })
    },
    change_sc () {
      // console.log(this.data.sc_img_state)
      let that = this
      if (this.data.sc_img_state) {
        this.setFavorite(this.data.list.id, this.data.sc_img_state)
        this.setData({
          sc_img: '/icon/sc.png',
          sc_img_state: 0
        })
      } else {
        this.setFavorite(this.data.list.id, this.data.sc_img_state)
        this.setData({
          sc_img: '/icon/sc_2.png',
          sc_img_state: 1
        })
      }
    },

    select_answer (e) {
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