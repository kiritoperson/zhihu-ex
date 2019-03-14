//index.js

const fetch = require('../../utils/fetch')
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    /**
     * 页面配置
     */
    winWidth: 0,
    winHeight: 0,
    // tab切换
    currentTab: 0,
    // 幻灯片数据
    topStories: [],
    // 日报数据
    dataThemes: [],
    // 精选数据
    datalist: [],
    // 显示加载更多 loading
    hothidden: true,

    // loading
    hidden: true,

    dataListDateCurrent: 0, // 当前日期current
    dataListDateCount: 0, // 请求次数

    /**
     * 滑动面板参数配置
     */
    indicatorDots: false, // 是否显示面板指示点
    autoplay: true, // 是否自动切换
    interval: 5000, // 自动切换时间间隔
    duration: 1000 // 滑动动画时长
  },
  swichNav: function(e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  /**
   * 获取格式化日期
   * 20161002
   */
  getFormatDate: function(str) {

    // 拆分日期为年 月 日
    var YEAR = str.substring(0, 4),
      MONTH = str.substring(4, 6),
      DATE = str.slice(-2);

    // 拼接为 2016/10/02 可用于请求日期格式
    var dateDay = YEAR + "/" + MONTH + "/" + DATE;

    // 获取星期几
    var week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
      day = new Date(dateDay).getDay();

    // 获取前一天日期 根据今天日期获取前一天的日期
    // var dateBefore = new Date( new Date( dateDay ) - 1000 * 60 * 60 * 24 ).toLocaleDateString();
    // var dateBefore = dateBefore.split('/');
    // if( dateBefore[1] < 10 ) {
    //     dateBefore[1] = '0' + dateBefore[1];
    // }
    // if( dateBefore[2] < 10 ) {
    //     dateBefore[2] = '0' + dateBefore[2];
    // }
    // dateBefore = dateBefore.join('');

    return {
      "dateDay": MONTH + "月" + DATE + "日 " + week[day]
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    var that = this;
    /**
     * 获取系统信息
     */
    wx.getSystemInfo({

      success: function(res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
    //取日报轮播数据
    fetch('4/news/latest')
      .then(res => {
        var arr = res.data;
        var format = that.getFormatDate(arr.date);
        console.log(format);

        // 格式化日期方便加载指定日期数据
        // 格式化日期获取星期几方便显示
        arr["dateDay"] = format.dateDay;
        // 获取当前现有数据进行保存
        var list = that.data.datalist;

        this.setData({
          datalist: list.concat(arr),
          topStories: arr.top_stories,
          dataListDateCurrent: arr.date, // 当前日期
          dataListDateCount: 1
        })
      });

    //取日报专栏数据
    fetch('3/news/hot')
      .then(res => {
        var arr = res.data.recent;
        console.log(arr);
        this.setData({
          dataThemes: arr
        })
      });

  },
  /**
   * 事件处理
   * scrolltolower 自动加载更多
   */
  scrolltolower: function(e) {

    var that = this;

    // 加载更多 loading
    that.setData({
      hothidden: true
    })

    var currentDate = this.data.dataListDateCurrent;

    // 如果加载数据超过10条
    if (this.data.dataListDateCount >= 8) {

      // 加载更多 loading
      that.setData({
        hothidden: false
      });

    } else {

      /**
       * 发送请求数据
       */
      fetch('4/news/before/' + currentDate)
        .then(res => {
          var arr = res.data;
          var format = that.getFormatDate(arr.date);

          // 格式化日期方便加载指定日期数据
          // 格式化日期获取星期几方便显示
          arr["dateDay"] = format.dateDay;

          // 获取当前数据进行保存
          var list = that.data.datalist;
          // 然后重新写入数据
          that.setData({
            datalist: list.concat(arr), // 存储数据
            dataListDateCurrent: arr.date,
            dataListDateCount: that.data.dataListDateCount + 1 // 统计加载次数

          });
        });
    }
  },

  /**
   * 滑动切换tab
   */
  bindChange: function(e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})