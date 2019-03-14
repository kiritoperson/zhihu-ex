// pages/detail/detail.js
const fetch = require('../../utils/fetch')
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    databody: null,
    data: [],
    comments: [],  // 评论
  },
// 格式化时间戳
  getTime: function(timestamp) {
    var time = arguments[0] || 0;
    var t, y, m, d, h, i, s;
    t = time ? new Date(time * 1000) : new Date();
    y = t.getFullYear();    // 年
    m = t.getMonth() + 1;   // 月
    d = t.getDate();        // 日

    h = t.getHours();       // 时
    i = t.getMinutes();     // 分
    s = t.getSeconds();     // 秒

    return [y, m, d].map(formatNumber).join('-') + ' ' + [h, i, s].map(formatNumber).join(':');

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var id = options.id;
    fetch("4/news/" + id)
      .then(res => {

        var arr = res.data;
        var body = arr.body;

        console.log(arr);
        body = body.match(/<p>.*?<\/p>/g);
        var ss = [];
        for (var i = 0, len = body.length; i < len; i++) {

          ss[i] = /<img.*?>/.test(body[i]);

          if (ss[i]) {
            body[i] = body[i].match(/(http:|https:).*?\.(jpg|jpeg|gif|png)/);
          } else {
            body[i] = body[i].replace(/<p>/g, '')
              .replace(/<\/p>/g, '')
              .replace(/<strong>/g, '')
              .replace(/<\/strong>/g, '')
              .replace(/<a.*?\/a>/g, '')
              .replace(/&nbsp;/g, ' ')
              .replace(/&ldquo;/g, '"')
              .replace(/&rdquo;/g, '"');
          }
        }
        this.setData({
          data: arr,
          databody: body
        })
      });
 
    fetch("4/story/" + id + "/short-comments").then(res =>{
    var arr = res.data.comments;

    for (var i = 0, len = arr.length; i < len; i++) {
      arr[i]['times'] = that.getTime(arr[i].time);
    }

    // 重新写入数据
    that.setData({
      comments: arr
    });
    })
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

  }
})