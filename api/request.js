const app = getApp()
module.exports = {
  /*
   * url:请求的接口地址
   * methodType:请求方式
   * data: 要传递的参数
  */
  request: function (url, methodType, data) {
    let fullUrl = app.globalData.g_url + `${url}`
    wx.showLoading({ title: "加载中" });
    return new Promise((resolve, reject) => {
      wx.request({
        url: fullUrl,
        method: methodType,
        data,
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: (res) => {
          if (res.statusCode == 200) {
            resolve(res.data)
            // if (res.data.code == 200) {
            //   resolve(res.data)
            // } else {
            //   wx.showToast({
            //     title: res.data.data,
            //     icon: 'none'
            //   })
            //   reject(res.data)
            // }
          } else {
            wx.showToast({
              title: '接口请求错误',
              icon: 'none'
            })
          }

        },
        fail: () => {
          wx.showToast({
            title: '接口请求错误',
            icon: 'none'
          })
          reject('接口请求错误')
        },
        complete: () => {
          setTimeout(() => {
            wx.hideLoading()
          }, 100)
        }
      })
    })
  }
}
