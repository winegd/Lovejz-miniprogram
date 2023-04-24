// app.js

App({
  onLaunch () {
    // 展示本地存储能力
    // const logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)


    // 登录
    // wx.login({
    //   success: res => {

    //   }
    // })
  },
  globalData: {
    userInfo: null,
    // g_url: 'https://demo.lazyy.top/',
    g_url: 'http://localhost/',
    cdn_url: 'https://love-jz-stu.lazyy.top',
    question_list:[]
  }

})
