// pages/login/login.js
import { request } from "../../api/request"

import { getCaptcha } from '../../api/captcha'
import { getClasslist } from '../../api/classinfo'
import { registerUser } from '../../api/question'
import { getUserInfo } from '../../api/student'
import { haveTch } from '../../api/teacher'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: '',
    m: 0,
    classInfo: null,
    classList: null,
    no: '',
    name: '',
    phone: '',
    class_id: '',
    banji: '',
    username: '',
    password: ''
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getClass()
  },
  toTch () {
    this.setData({
      m: 1
    })
  },
  toStu () {
    this.setData({
      m: 0
    })
  },
  getCapcha () {
    getCaptcha().then(res => {
      console.log(res)
      this.setData({
        imgUrl: res.data.imgUrl
      })
    })
  },
  getClass () {
    getClasslist().then(res => {
      let class_list = []
      for (let i of res.data) {
        class_list.push(i.name)
      }
      this.setData({
        classList: class_list,
        classInfo: res.data
      })
    })
  },
  change_class (e) {
    this.setData({
      class_id: this.data.classInfo[parseInt(e.detail.value)].id,
      banji: this.data.classInfo[parseInt(e.detail.value)].name
    })
  },
  submitStu () {

    if (this.validateForm()) {
      let student = {}
      let userInfo = wx.getStorageSync('userInfo')
      student.no = this.data.no
      student.classId = this.data.class_id
      student.name = this.data.name
      student.phone = this.data.phone
      student.openid = userInfo.openid
      student.avatarurl = userInfo.avatarurl
      student.nickname = userInfo.nickname
      console.log(student)

      let that = this
 

      request('stu/user/update', 'POST', student).then(res => {
        if (res.code == 200) {
          getUserInfo(userInfo.openid).then(r => {
            if (r.code == 200) {
              wx.setStorageSync('userInfo', r.data)
            }
          })
          wx.lin.showMessage({
            type: 'success',
            icon: 'success',
            content: '注册成功'
          })

          wx.switchTab({
            url: '/pages/my/my'
          })
        }
      })

    }
  },
  validateForm () {
    let student = {}
    student.no = this.data.no
    student.class_id = this.data.class_id
    student.name = this.data.name
    student.phone = this.data.name
    if (student.no == '' || student.class_id == '' || student.name == '' || student.phone == '') {

      wx.lin.showMessage({
        type: 'warning',
        icon: 'warning',
        content: '表单未填写完整'
      })
      return false

    } else {
      return true
    }

  },
  changeUsername (e) {
    this.setData({
      username: e.detail.value
    })

  },
  changePassword (e) {
    this.setData({
      password: e.detail.value
    })

  },
  submitTch () {
    if (this.data.username == '' || this.data.password == '') {
      wx.lin.showMessage({
        type: 'warning',
        icon: 'warning',
        content: '表单未填写完整'
      })
    } else {
      let tch = {}
      let userInfo = wx.getStorageSync('userInfo')
      tch.username = this.data.username
      tch.password = this.data.password
      tch.openid = userInfo.openid
      tch.avatarurl = userInfo.avatarurl
      tch.nickname = userInfo.nickname
      haveTch(tch).then(res => {
        if (res.code == 200) {
          wx.lin.showMessage({
            type: 'success',
            icon: 'success',
            content: res.msg
          })
          wx.setStorageSync('userInfo', res.data)
          wx.switchTab({
            url: '/pages/my/my'
          })
        } else {
          wx.lin.showMessage({
            type: 'error',
            icon: 'error',
            content: res.msg
          })
        }


      })

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
  changeName (e) {
    this.setData({
      name: e.detail.value
    })
  },
  changeNo (e) {
    this.setData({
      no: e.detail.value
    })
  },
  changePhone (e) {
    this.setData({
      phone: e.detail.value
    })
  }
})