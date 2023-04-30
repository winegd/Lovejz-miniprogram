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
    if (wx.getStorageSync('userInfo').openid != undefined) {
      this.connectSocket()
    }

  },
  globalData: {
    // wsUrl: 'wss://demo.lazyy.top/ws/game/' + wx.getStorageSync('userInfo').openid,
    wsUrl: 'ws://localhost/ws/game/' + wx.getStorageSync('userInfo').openid,
    // g_url: 'https://demo.lazyy.top/',
    g_url: 'http://localhost/',
    cdn_url: 'https://love-jz-stu.lazyy.top',
    userInfo: wx.getStorageSync('userInfo'),
    // websocket
    websocket: null, // 连接对象
    connectStatus: null, // 连接状态
    heartbeatInterval: null, // 心跳定时器
    dropReconnectInterval: null, // 掉线重连定时器
    messageCallback: function () { }, // 接收到消息函数

  },
  onHide () {
    const websocket = this.globalData.websocket,
      heartbeatInterval = this.globalData.heartbeatInterval,
      dropReconnectInterval = this.globalData.dropReconnectInterval;
    // 关闭全局定时器
    if (heartbeatInterval) clearInterval(heartbeatInterval);
    if (dropReconnectInterval) clearInterval(dropReconnectInterval);
    // 关闭socket
    if (websocket) websocket.close();

    this.globalData.websocket = null;
    this.globalData.connectStatus = "quit";
    this.globalData.heartbeatInterval = null;
    this.globalData.dropReconnectInterval = null;
  },

  /* 连接socket */
  connectSocket () {
    console.log("链接websocket")
    const that = this, userInfo = this.globalData.userInfo;
    this.globalData.connectStatus = null;
    const websocket = wx.connectSocket({
      url: this.globalData.wsUrl, timeout: 20000,
    });
    websocket.onOpen(() => {
      that.globalData.connectStatus = "success";
      // 保活心跳
      wx.hideLoading();
      that.connectHeatbeat();
    });
    websocket.onClose(() => {
      if (that.globalData.connectStatus != "quit")
        that.globalData.connectStatus = "close";
    });
    websocket.onError(() => {
      if (that.globalData.connectStatus != "quit")
        that.globalData.connectStatus = "error";
    });
    // 接收消息事件
    websocket.onMessage((res) => that.globalData.messageCallback(res));
    this.globalData.websocket = websocket;

    // 掉线重连检测
    this.dropReconnect();
  },

  /* websocket掉线重连 */
  dropReconnect: function () {
    const dropReconnectInterval = this.globalData.dropReconnectInterval;
    if (dropReconnectInterval) clearInterval(dropReconnectInterval);

    this.globalData.dropReconnectInterval = setInterval((that) => {
      const connectStatus = that.globalData.connectStatus;
      if (connectStatus == null || connectStatus == "success") return;

      // 掉线重连
      // wx.showLoading({ title: '掉线重连中...' });
      clearInterval(that.globalData.dropReconnectInterval);
      that.connectSocket();
    }, 1000, this);
  },

  /* websocket心跳 */
  connectHeatbeat () {
    const heartbeatInterval = this.globalData.heartbeatInterval;
    if (heartbeatInterval) clearInterval(heartbeatInterval);

    // 保活，每3秒ping一次
    this.globalData.heartbeatInterval = setInterval((that) => {
      if (that.globalData.connectStatus == "quit")
        clearInterval(that.globalData.heartbeatInterval);
      else if (that.globalData.connectStatus == "success")
        that.globalData.websocket.send({ data: 'ping' });
    }, 40000, this);
  },

  /* 发送websocket消息 */
  sendWebsocket (msg) {
    const websocket = this.globalData.websocket
    const connectStatus = this.globalData.connectStatus;
    if (!websocket || connectStatus != 'success') return false;
    if (msg != 'ping') {
      websocket.send({ data: JSON.stringify(msg) }); return true;
    } else {
      websocket.send({ data: msg }); return true;
    }

  }

})
