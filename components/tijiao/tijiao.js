
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    s_list: Array,
    mode: Number,
    all_num: null,
    correct_num: null
  },

  /**
   * 组件的初始数据
   */
  data: {
    list: [],
    m: 0,
    all_time: 0
  },
  observers: {
    's_list': function (val) {
      val.pop()
      for (let i of val) {
        let flag = false
        for (let j of i.options) {

          if (j.selected == 1) {
            flag = true
          }
        }
        if (flag == true) {
          i.isAnswer = 1
        } else {
          i.isAnswer = 0
        }
      }
      this.setData({
        list: val
      })
      this.setAllTime(val)
    },
    'mode': function (val) {
      this.setData({
        m: val
      })
    }

  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    async setAllTime (list) {

      let all_time = 0
      for (let i of list) {
        all_time += i.usedTime
      }
      this.setData({
        all_time
      })

    },
    submit_jiexi () {
      this.triggerEvent('submit_jiexi')
    },

    click_qeustion (e) {
      this.triggerEvent('Toquestion', e.currentTarget.dataset.index)
    },
    submit () {
      let that = this
      let flag = false
      for (let i of this.data.list) {
        if (i.isAnswer == 0) {
          flag = true
          break
        }
      }

      if (flag) {
        wx.showModal({
          content: '还有题目未作答，要交卷吗',
          confirmColor: '#3B7BFB',
          cancelColor: '#FF0000',
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
              let list = that.setIsCorrect(that.data.list)
              that.triggerEvent('submit_answer', list)
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      } else {
        let list = that.setIsCorrect(this.data.list)
        that.triggerEvent('submit_answer', list)
      }

    },
    setIsCorrect (list) {
      let all_num = list.length
      let correct_num = 0
      for (let i of list) {
        let flag = true
        for (let j of i.options) {
          if (j.selected != j.isCorrect) {
            flag = false
          }
        }
        if (flag) {
          i.isCorrect = 1
          correct_num++
        }
      }
      this.setData({
        list,
        all_num,
        correct_num
      })
      return list
    }


  }
})
